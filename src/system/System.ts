import Api from '../api/Api';
import Auth from '../auth/Auth';
import { ClientConfig, NexusConfig, proxyWrap, toDisplay } from '../common';
import Nexus, { Nexus as NexusType } from './Nexus';
import { LibModule } from './Types';

export type InitSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
};

interface SystemWrapper {
  init: (settings: InitSettings) => void;
}

interface SystemInstance {
  getLibModule: <T>(type: LibModule) => T;
  nexus: NexusType;
}

export type System = SystemInstance & SystemWrapper;

let initialized = false;

async function init(settings: InitSettings) {
  if (initialized) {
    return;
  }

  const libModuleMap = new Map<LibModule, any>();
  const nexus = await Nexus(settings.nexus, settings.client);

  function getLibModule<T>(type: LibModule): T {
    const module = libModuleMap.get(type);
    if (!module) {
      throw new Error(`No instance was found for the ${toDisplay(type)} Lib Module.`);
    }
    return module;
  }

  libModuleMap.set(LibModule.AUTH, Auth);
  libModuleMap.set(LibModule.API, Api);

  Object.assign(instance, { getLibModule, nexus });
  Object.freeze(instance);
  initialized = true;
}

const [instance, system] = proxyWrap<SystemInstance, SystemWrapper>({}, { init });
export default system;
