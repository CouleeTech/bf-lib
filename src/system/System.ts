import { ConnectionType, Nullable } from '../common';
import { LiveSyncConnectionOptions, LiveSyncConnectionType } from '../livesync/Types';
import { proxyWrap } from '../system/Utils';
import EventBusGenerator from './EventBus';
import { SetInstrumentorLogger } from './Instrumentor';
import Nexus from './Nexus';
import { EventBus, InitSettings, LibModule, Lock, SystemInstance, SystemLogLevel, SystemWrapper } from './Types';

let initialized = false;
const seal = Symbol();

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

  const { logger, mask } = settings.logging;
  const debugLoggingEnabled = !mask.includes('debug');

  function log(level: SystemLogLevel, message: any) {
    switch (level) {
      case 'debug': {
        if (debugLoggingEnabled) {
          logger[level](message);
        }
        break;
      }

      default: {
        logger[level](message);
        break;
      }
    }
  }

  log('debug', 'beginning to initialize the internal bf-lib system');
  SetInstrumentorLogger(log);

  const httpHeaders: Record<string, string> = {};
  const libModuleMap = new Map<LibModule, Lock<any>>();
  const nexus = await Nexus(system, settings.nexus, settings.auth);
  const eventBus: EventBus = EventBusGenerator();
  const liveSyncConnectionOptions = settings.livesync ? Object.freeze({ ...settings.livesync }) : null;

  function getEventBus(): EventBus {
    return eventBus;
  }

  function getHttpHeaders(): Record<string, string> {
    return { ...httpHeaders };
  }

  function setHttpHeader(key: string, value: string) {
    httpHeaders[key] = value;
  }

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
  const getSettings = () => {
    return settings;
  };

  log('debug', 'beginning to initialize all system lib modules');
  libModuleMap.set(LibModule.AUTH, require('../auth/Auth').default);
  libModuleMap.set(LibModule.API, require('../api/Api').default);
  libModuleMap.set(LibModule.LIVESYNC, require('../livesync/LiveSync').default);
  libModuleMap.set(LibModule.MODULE, require('../module/Module').default);
  libModuleMap.set(LibModule.MULTITOOL, require('../multitool/Multitool').default);
  log('debug', 'finished initializing all system lib modules');

  const instanceMethods: SystemInstance = {
    getEventBus,
    getHttpHeaders,
    setHttpHeader,
    getLibModule,
    liveSyncOptions,
    getSettings,
    nexus,
  };

  Object.assign(instance, instanceMethods);
  if (settings.auth.afterConnect) {
    settings.auth.afterConnect(instance);
  }
  initialized = true;

  log('debug', 'finished initializing the internal bf-lib system');
}

const [instance, system] = proxyWrap<SystemInstance, SystemWrapper>({}, { init, sealModule });
export default system;
