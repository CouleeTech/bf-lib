import { Api } from './api';
import { Auth } from './auth';
import { ClientConfig, NexusConfig } from './common';
import { Module } from './module';
import System, { LibModule } from './system';

export { Api, Auth, Module };

export type ConfigSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
};

export interface BfLib {
  api: Api;
  auth: Auth;
  module: Module;
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
  });
}
