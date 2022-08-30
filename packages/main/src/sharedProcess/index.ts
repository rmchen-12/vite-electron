import { SharedProcess } from 'main/sharedProcess/sharedProcess';
import { Client as MessagePortClient } from 'base/parts/ipc/electron-main/ipc.mp';

export const setupSharedProcess = (): { sharedProcess: SharedProcess; sharedProcessReady: Promise<MessagePortClient>; sharedProcessClient: Promise<MessagePortClient> } => {
  // @ts-ignore
  const sharedProcess = new SharedProcess();

  const sharedProcessClient = (async () => {
    const port = await sharedProcess.connect();
    return new MessagePortClient(port, 'main');
  })();

  const sharedProcessReady = (async () => {
    await sharedProcess.whenReady();

    return sharedProcessClient;
  })();

  return { sharedProcess, sharedProcessReady, sharedProcessClient };
};
