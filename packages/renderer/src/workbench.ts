import { IInstantiationService } from 'platform/instantiation/common/instantiation';
import { ServiceCollection } from 'platform/instantiation/common/serviceCollection';
import { getSingletonServiceDescriptors } from 'platform/instantiation/common/extensions';
import { InstantiationService } from 'platform/instantiation/common/instantiationService';
import { IChecksumService } from 'platform/checksum/common/checksumService';
import { IUpdateService } from 'platform/update/common/update';

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from '/@/App.vue';
import SvgIcon from '/@/components/svgIcon/index.vue';
import 'virtual:svg-icons-register';

import { Boot } from '@wangeditor/editor';
import attachmentModule from '@wangeditor/plugin-upload-attachment';

Boot.registerModule(attachmentModule);

Vue.use(ElementUI);

Vue.component('svg-icon', SvgIcon);

export class Workbench {

  constructor(
    private readonly serviceCollection: ServiceCollection,
  ) {

  }

  startup(): IInstantiationService {
    // try {
    const instantiationService = this.initServices(this.serviceCollection);

    instantiationService.invokeFunction(async accessor => {
      const check = accessor.get(IChecksumService);
      const update = accessor.get(IUpdateService);

      console.log(await check.checksum());
      console.log(await update.checkForUpdates(true));

      new Vue({ render: h => h(App) }).$mount('#app');
    });

    return instantiationService;
    // } catch (error) {
    //   throw error;
    // }
  }

  private initServices(serviceCollection: ServiceCollection): IInstantiationService {

    // All Contributed Services
    const contributedServices = getSingletonServiceDescriptors();
    for (let [id, descriptor] of contributedServices) {
      serviceCollection.set(id, descriptor);
    }

    const instantiationService = new InstantiationService(serviceCollection, true);

    // Wrap up
    instantiationService.invokeFunction(accessor => {

    });

    return instantiationService;
  }
}
