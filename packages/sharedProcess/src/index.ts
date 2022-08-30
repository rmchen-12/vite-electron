/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ipcRenderer } from 'electron';
import { Server as MessagePortServer } from 'base/parts/ipc/electron-browser/ipc.mp';
import { Disposable } from 'base/common/lifecycle';
import { ChecksumService } from 'platform/checksum/node/checksumService';
import { ProxyChannel } from 'base/parts/ipc/common/ipc';
import { IInstantiationService, ServicesAccessor } from 'platform/instantiation/common/instantiation';
import { ServiceCollection } from 'platform/instantiation/common/serviceCollection';
import { InstantiationService } from 'platform/instantiation/common/instantiationService';
import { IChecksumService } from 'platform/checksum/common/checksumService';
import { SyncDescriptor } from 'platform/instantiation/common/descriptors';

class SharedProcessMain extends Disposable {

  private server = this._register(new MessagePortServer());

  constructor() {
    super();

    this.registerListeners();
  }

  private registerListeners(): void {

    // Shared process lifecycle
    const onExit = () => this.dispose();
    process.once('exit', onExit);
    ipcRenderer.once('vscode:electron-main->shared-process=exit', onExit);

    // Shared process worker lifecycle
    //
    // We dispose the listener when the shared process is
    // disposed to avoid disposing workers when the entire
    // application is shutting down anyways.
    //
  }

  async open(): Promise<void> {

    // Services
    const instantiationService = await this.initServices();

    instantiationService.invokeFunction(accesser => {
      const checksumService = accesser.get(IChecksumService);

      console.log('checksumService success', checksumService);

      this.initChannels(accesser);
    });

  }

  private async initServices(): Promise<IInstantiationService> {
    const services = new ServiceCollection();

    services.set(IChecksumService, new SyncDescriptor(ChecksumService));

    return new InstantiationService(services);
  }


  private initChannels(accesser: ServicesAccessor): void {

    // Checksum
    const checksumChannel = ProxyChannel.fromService(accesser.get(IChecksumService));
    this.server.registerChannel('checksum', checksumChannel);
  }
}

export async function main(): Promise<void> {

  // create shared process and signal back to main that we are
  // ready to accept message ports as client connections
  const sharedProcess = new SharedProcessMain();
  ipcRenderer.send('vscode:shared-process->electron-main=ipc-ready');

  // await initialization and signal this back to electron-main
  await sharedProcess.open();
  ipcRenderer.send('vscode:shared-process->electron-main=init-done');
}

main();
