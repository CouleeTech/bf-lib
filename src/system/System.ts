import { ClientConfig, NexusConfig } from '../common';
import { Lock, lock, proxyWrap } from '../common/Utils';
import Nexus, { Nexus as NexusType } from './Nexus';
import { LibModule } from './Types';

export type InitSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
};

interface SystemWrapper {
  init(settings: InitSettings): void;
  sealModule<T extends object>(module: T): Lock<T>;
}

interface SystemInstance {
  getLibModule: <T>(type: LibModule) => T;
  nexus: NexusType;
}

export type System = SystemInstance & SystemWrapper;

let initialized = false;
const seal = Symbol();

function sealModule<T extends object>(module: T): Lock<T> {
  return lock<T>(module, seal);
}

async function init(settings: InitSettings) {
  if (initialized) {
    return;
  }

  const libModuleMap = new Map<LibModule, Lock<any>>();
  const nexus = await Nexus(settings.nexus, settings.client);

  function getLibModule<T>(type: LibModule): T {
    const libModule = libModuleMap.get(type);
    if (!libModule) {
      throw new Error('An attempt was mad to access an instance for a missing Lib Module.');
    }
    return libModule(seal);
  }

  const auth = require('../auth/Auth');
  const api = require('../api/Api');
  const module = require('../module/Module');

  libModuleMap.set(LibModule.AUTH, auth);
  libModuleMap.set(LibModule.API, api);
  libModuleMap.set(LibModule.MODULE, module);

  Object.assign(instance, { getLibModule, nexus });
  Object.freeze(instance);
  initialized = true;
}

const [instance, system] = proxyWrap<SystemInstance, SystemWrapper>({}, { init, sealModule });
export default system;
