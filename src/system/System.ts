import { ClientConfig, ConnectionType, LiveSyncConfig, NexusConfig, Nullable } from '../common';
import { proxyWrap } from '../common/Utils';
import { LiveSyncConnectionOptions, LiveSyncConnectionType } from '../livesync/Types';
import Nexus, { Nexus as NexusType } from './Nexus';
import { LibModule } from './Types';

export type InitSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
  livesync?: LiveSyncConfig;
};

interface SystemWrapper {
  init(settings: InitSettings): void;
  sealModule<T extends object>(module: T): Lock<T>;
}

interface SystemInstance {
  getLibModule: <T>(type: LibModule) => T;
  liveSyncOptions: () => Nullable<LiveSyncConnectionOptions>;
  nexus: NexusType;
}

export type System = SystemInstance & SystemWrapper;

let initialized = false;
const seal = Symbol();

type Lock<T> = (suppliedKey: symbol) => T;

function lock<T extends object>(obj: T, key: symbol): Lock<T> {
  const guard = Object.freeze({ key });

  function unlock(suppliedKey: symbol) {
    const keyRef = suppliedKey;
    if (typeof keyRef === 'symbol' && guard.key === keyRef) {
      return obj;
    }
    throw new Error('Illegal access to a protected object.');
  }

  Object.defineProperty(unlock, 'name', { value: Symbol() });
  Object.defineProperty(unlock, 'prototype', { value: null });
  Object.defineProperty(unlock, '__proto__', { value: null });
  return Object.freeze(unlock);
}

function sealModule<T extends object>(module: T): Lock<T> {
  return lock<T>(module, seal);
}

async function init(settings: InitSettings) {
  if (initialized) {
    return;
  }

  const libModuleMap = new Map<LibModule, Lock<any>>();
  const nexus = await Nexus(settings.nexus, settings.client);
  const liveSyncConnectionOptions = settings.livesync ? Object.freeze({ ...settings.livesync }) : null;

  function getLibModule<T>(type: LibModule): T {
    const libModule = libModuleMap.get(type);
    if (!libModule) {
      throw new Error('An attempt was mad to access an instance for a missing Lib Module.');
    }
    return libModule(seal);
  }

  function liveSyncOptions(): Nullable<LiveSyncConnectionOptions> {
    if (!liveSyncConnectionOptions) {
      return null;
    }

    if (liveSyncConnectionOptions.type === ConnectionType.ORGANIZATION) {
      return { module_name: LiveSyncConnectionType.ORGANIZATION, module_id: nexus.getUser().organization[0] };
    }

    return null;
  }

  libModuleMap.set(LibModule.AUTH, require('../auth/Auth').default);
  libModuleMap.set(LibModule.API, require('../api/Api').default);
  libModuleMap.set(LibModule.LIVESYNC, require('../livesync/LiveSync').default);
  libModuleMap.set(LibModule.MODULE, require('../module/Module').default);

  const instanceMethods: SystemInstance = { getLibModule, liveSyncOptions, nexus };
  Object.assign(instance, instanceMethods);
  Object.freeze(instance);
  initialized = true;
}

const [instance, system] = proxyWrap<SystemInstance, SystemWrapper>({}, { init, sealModule });
export default system;
