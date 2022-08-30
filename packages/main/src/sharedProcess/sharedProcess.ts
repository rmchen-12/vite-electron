/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow, Event as ElectronEvent, ipcMain, IpcMainEvent, MessagePortMain } from 'electron';
import { validatedIpcMain } from 'base/parts/ipc/electron-main/ipcMain';
import { Barrier } from 'base/common/async';
import { Emitter, Event } from 'base/common/event';
import { Disposable } from 'base/common/lifecycle';
import { assertIsDefined } from 'base/common/types';
import { connect as connectMessagePort } from 'base/parts/ipc/electron-main/ipc.mp';
import { join } from 'path';
import { WindowError } from 'platform/window/electron-main/window';
import { IProcessEnvironment } from 'base/common/platform';
import { ILifecycleMainService } from 'platform/lifecycle/electron-main/lifecycleMainService';
import { ILogService } from 'platform/log/common/log';
import { toErrorMessage } from 'base/common/errorMessage';

export interface ISharedProcess {

  /**
   * Toggles the visibility of the otherwise hidden
   * shared process window.
   */
  toggle(): Promise<void>;
}

export class SharedProcess extends Disposable implements ISharedProcess {

  private readonly firstWindowConnectionBarrier = new Barrier();

  private window: BrowserWindow | undefined = undefined;
  private windowCloseListener: ((event: ElectronEvent) => void) | undefined = undefined;

  private readonly _onDidError = this._register(new Emitter<{ type: WindowError; details?: { reason: string; exitCode: number } }>());
  readonly onDidError = Event.buffer(this._onDidError.event); // buffer until we have a listener!

  constructor(
    private readonly machineId: string,
    private userEnv: IProcessEnvironment,
    @ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
    @ILogService private readonly logService: ILogService,
  ) {
    super();

    this.registerListeners();
  }

  private registerListeners(): void {

    // Shared process connections from workbench windows
    ipcMain.on('vscode:createSharedProcessMessageChannel', (e, nonce: string) => this.onWindowConnection(e, nonce));

    // Shared process worker relay
    // validatedIpcMain.on('vscode:relaySharedProcessWorkerMessageChannel', (e, configuration: ISharedProcessWorkerConfiguration) => this.onWorkerConnection(e, configuration));

    // Lifecycle
    this._register(this.lifecycleMainService.onWillShutdown(() => this.onWillShutdown()));
  }

  private async onWindowConnection(e: IpcMainEvent, nonce: string): Promise<void> {
    // this.logService.trace('SharedProcess: on vscode:createSharedProcessMessageChannel');


    // release barrier if this is the first window connection
    if (!this.firstWindowConnectionBarrier.isOpen()) {
      this.firstWindowConnectionBarrier.open();
    }

    // await the shared process to be overall ready
    // we do not just wait for IPC ready because the
    // workbench window will communicate directly
    await this.whenReady();

    // connect to the shared process window
    const port = await this.connect();

    // Check back if the requesting window meanwhile closed
    // Since shared process is delayed on startup there is
    // a chance that the window close before the shared process
    // was ready for a connection.
    if (e.sender.isDestroyed()) {
      return port.close();
    }

    // send the port back to the requesting window
    e.sender.postMessage('vscode:createSharedProcessMessageChannelResult', nonce, [port]);
  }

  private _whenReady: Promise<void> | undefined = undefined;
  whenReady(): Promise<void> {
    if (!this._whenReady) {
      // Overall signal that the shared process window was loaded and
      // all services within have been created.
      this._whenReady = new Promise<void>(resolve => validatedIpcMain.once('vscode:shared-process->electron-main=init-done', () => {
        resolve();
      }));
    }

    return this._whenReady;
  }

  private _whenIpcReady: Promise<void> | undefined = undefined;
  private get whenIpcReady() {
    if (!this._whenIpcReady) {
      this._whenIpcReady = (async () => {

        // Always wait for first window asking for connection
        await this.firstWindowConnectionBarrier.wait();

        // Create window for shared process
        this.createWindow();

        // Listeners
        this.registerWindowListeners();

        // Wait for window indicating that IPC connections are accepted
        await new Promise<void>(resolve => validatedIpcMain.once('vscode:shared-process->electron-main=ipc-ready', () => {
          resolve();
        }));
      })();
    }

    return this._whenIpcReady;
  }

  private createWindow(): void {
    // shared process is a hidden window by default
    this.window = new BrowserWindow({
      show: false,
      webPreferences: {
        preload: join(__dirname, '../../preload/dist/index.cjs'),
        additionalArguments: ['-window-kind=shared-process'],
        v8CacheOptions: 'bypassHeatCheck',
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        enableWebSQL: false,
        spellcheck: false,
        images: false,
        webgl: false,
      },
    });

    // Load with config
    this.window.loadURL(new URL('../sharedProcess/dist/index.html', 'file://' + __dirname).toString());
  }

  private registerWindowListeners(): void {
    if (!this.window) {
      return;
    }

    // Prevent the window from closing
    this.windowCloseListener = (e: ElectronEvent) => {
      // We never allow to close the shared process unless we get explicitly disposed()
      // e.preventDefault();

      // Still hide the window though if visible
      if (this.window?.isVisible()) {
        this.window.hide();
      }
    };

    this.window.on('close', this.windowCloseListener);

    // Crashes & Unresponsive & Failed to load
    // We use `onUnexpectedError` explicitly because the error handler
    // will send the error to the active window to log in devtools too
    this.window.webContents.on('render-process-gone', (event, details) => this._onDidError.fire({ type: WindowError.CRASHED, details }));
    this.window.on('unresponsive', () => this._onDidError.fire({ type: WindowError.UNRESPONSIVE }));
    this.window.webContents.on('did-fail-load', (event, exitCode, reason) => this._onDidError.fire({ type: WindowError.LOAD, details: { reason, exitCode } }));
  }

  private onWillShutdown(): void {
    const window = this.window;
    if (!window) {
      return; // possibly too early before created
    }

    // Signal exit to shared process when shutting down
    this.send('vscode:electron-main->shared-process=exit');

    // Shut the shared process down when we are quitting
    //
    // Note: because we veto the window close, we must first remove our veto.
    // Otherwise the application would never quit because the shared process
    // window is refusing to close!
    //
    if (this.windowCloseListener) {
      window.removeListener('close', this.windowCloseListener);
      this.windowCloseListener = undefined;
    }

    // Electron seems to crash on Windows without this setTimeout :|
    setTimeout(() => {
      try {
        window.close();
      } catch (err) {
        // ignore, as electron is already shutting down
      }

      this.window = undefined;
    }, 0);
  }

  private send(channel: string, ...args: any[]): void {
    if (!this.isAlive()) {
      this.logService.warn(`Sending IPC message to channel '${channel}' for shared process window that is destroyed`);
      return;
    }

    try {
      this.window?.webContents.send(channel, ...args);
    } catch (error) {
      this.logService.warn(`Error sending IPC message to channel '${channel}' of shared process: ${toErrorMessage(error)}`);
    }
  }

  async connect(): Promise<MessagePortMain> {

    // Wait for shared process being ready to accept connection
    await this.whenIpcReady;

    // Connect and return message port
    const window = assertIsDefined(this.window);
    return connectMessagePort(window);
  }

  async toggle(): Promise<void> {

    // wait for window to be created
    await this.whenIpcReady;

    if (!this.window) {
      return; // possibly disposed already
    }

    if (this.window.isVisible()) {
      this.window.webContents.closeDevTools();
      this.window.hide();
    } else {
      this.window.show();
      this.window.webContents.openDevTools();
    }
  }

  isVisible(): boolean {
    return this.window?.isVisible() ?? false;
  }

  private isAlive(): boolean {
    const window = this.window;
    if (!window) {
      return false;
    }

    return !window.isDestroyed() && !window.webContents.isDestroyed();
  }
}
