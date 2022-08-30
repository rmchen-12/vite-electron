import './importService';

import { ServiceCollection } from 'platform/instantiation/common/serviceCollection';
import { domContentLoaded } from 'base/browser/dom';
import { Workbench } from 'render/workbench';
import { ElectronIPCMainProcessService } from 'platform/ipc/electron-sandbox/mainProcessService';
import { IMainProcessService, ISharedProcessService } from 'platform/ipc/electron-sandbox/services';
import { SharedProcessService } from 'render/services/sharedProcess/electron-sandbox/sharedProecssService';
import { Disposable } from 'base/common/lifecycle';

export class DesktopMain extends Disposable {
  constructor() {
    super();
  }

  async open(): Promise<void> {

    // Init services and wait for DOM to be ready in parallel
    const [services] = await Promise.all([this.initServices(), domContentLoaded()]);

    // Create Workbench
    const workbench = new Workbench(services.serviceCollection);

    // Listeners
    // this.registerListeners(workbench, services.storageService);

    // Startup
    const instantiationService = workbench.startup();

    // Window
    // this._register(instantiationService.createInstance(NativeWindow));
  }

  private async initServices(): Promise<{ serviceCollection: ServiceCollection; }> {
    const serviceCollection = new ServiceCollection();

    // Main Process
    const mainProcessService = this._register(new ElectronIPCMainProcessService(999));
    serviceCollection.set(IMainProcessService, mainProcessService);


    // Shared Process
    const sharedProcessService = new SharedProcessService(999);
    serviceCollection.set(ISharedProcessService, sharedProcessService);

    // Shared Process Worker
    // const sharedProcessWorkerWorkbenchService = new SharedProcessWorkerWorkbenchService(this.configuration.windowId, logService, sharedProcessService);
    // serviceCollection.set(ISharedProcessWorkerWorkbenchService, sharedProcessWorkerWorkbenchService);

    return { serviceCollection };
  }
}

const workbench = new DesktopMain();

workbench.open();
