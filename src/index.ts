import { Api } from './api';
import { Auth } from './auth';
import { ClientConfig, ClientType, NexusConfig } from './common';
import { Module } from './module';
import { Multitool } from './multitool';
import System, { ClientAuth, LibModule, SystemInstance, SystemLoggerOptions } from './system';

export { Api, Auth, Module, ClientType, ClientAuth, ClientConfig, NexusConfig, SystemInstance };

export type ConfigSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
  auth: ClientAuth;
  logging: SystemLoggerOptions;
};

export interface BfLib {
  api: Api;
  auth: Auth;
  module: Module;
  multitool: Multitool;
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
  });
}
