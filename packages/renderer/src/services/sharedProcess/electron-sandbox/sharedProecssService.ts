/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Client as MessagePortClient } from 'base/parts/ipc/common/ipc.mp';
import { IChannel, IServerChannel, getDelayedChannel } from 'base/parts/ipc/common/ipc';
import { Disposable } from 'base/common/lifecycle';

import { Barrier, timeout } from 'base/common/async';
import { acquirePort } from 'base/parts/ipc/electron-sandbox/ipc.mp';

export interface ISharedProcessService {

  readonly _serviceBrand: undefined;

  getChannel(channelName: string): IChannel;
  registerChannel(channelName: string, channel: IServerChannel<string>): void;

  notifyRestored(): void;
}

export class SharedProcessService extends Disposable implements ISharedProcessService {

  declare readonly _serviceBrand: undefined;

  private readonly withSharedProcessConnection: Promise<MessagePortClient>;

  private readonly restoredBarrier = new Barrier();

  constructor(
    readonly windowId: number,
  ) {
    super();

    this.withSharedProcessConnection = this.connect();
  }

  private async connect(): Promise<MessagePortClient> {
    // Our performance tests show that a connection to the shared
    // process can have significant overhead to the startup time
    // of the window because the shared process could be created
    // as a result. As such, make sure we await the `Restored`
    // phase before making a connection attempt, but also add a
    // timeout to be safe against possible deadlocks.
    await Promise.race([this.restoredBarrier.wait(), timeout(2000)]);

    // Acquire a message port connected to the shared process
    const port = await acquirePort('vscode:createSharedProcessMessageChannel', 'vscode:createSharedProcessMessageChannelResult');

    return this._register(new MessagePortClient(port, `window:${this.windowId}`));
  }

  notifyRestored(): void {
    if (!this.restoredBarrier.isOpen()) {
      this.restoredBarrier.open();
    }
  }

  getChannel(channelName: string): IChannel {
    return getDelayedChannel(this.withSharedProcessConnection.then(connection => connection.getChannel(channelName)));
  }

  registerChannel(channelName: string, channel: IServerChannel<string>): void {
    this.withSharedProcessConnection.then(connection => connection.registerChannel(channelName, channel));
  }
}
