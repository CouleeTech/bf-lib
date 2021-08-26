import { Auth, hasPermissions } from './auth';
import { ClientConfig, ClientType, NexusConfig } from './common';
import { ExternalModuleEntity, InsertData, ModuleEntity } from './module/Types';
import System, { ClientAuth, InitSettings, LibModule, SystemInstance } from './system';

import { Api } from './api';
import { Module } from './module';
import { Multitool } from './multitool';

export {
  Api,
  Auth,
  Module,
  ClientType,
  ClientAuth,
  ClientConfig,
  NexusConfig,
  SystemInstance,
  InsertData,
  ModuleEntity,
  ExternalModuleEntity,
  hasPermissions,
};

export type ConfigSettings = InitSettings;

export interface BfLib {
  api: Api;
  auth: Auth;
  module: Module;
  multitool: Multitool;
  protected: (impersonate: InitSettings['impersonate']) => Promise<BfLib>;
}

export default async function bflib(settings: ConfigSettings): Promise<BfLib> {
  await System.init(settings);
  return Object.freeze({
    get api() {
      return System.getLibModule<Api>(LibModule.API);
    },
    get auth() {
      return System.getLibModule<Auth>(LibModule.AUTH);
    },
    get module() {
      return System.getLibModule<Module>(LibModule.MODULE);
    },
    get multitool() {
      return System.getLibModule<Multitool>(LibModule.MULTITOOL);
    },
    async protected(impersonate): Promise<BfLib> {
      return bflib({ ...settings, impersonate, protected: true });
    },
  });
}
