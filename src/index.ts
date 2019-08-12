import { Api } from './api';
import { Auth } from './auth';
import { ClientConfig, ClientType, ConnectionType, LiveSyncConfig, NexusConfig } from './common';
import { LiveEvent, LiveSync } from './livesync';
import { Module } from './module';
import System, { ClientAuth, LibModule } from './system';

export { Api, Auth, LiveSync, Module, LiveEvent, ClientType, ConnectionType };

export type ConfigSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
  auth: ClientAuth;
  livesync?: LiveSyncConfig;
};

export interface BfLib {
  api: Api;
  auth: Auth;
  livesync: LiveSync;
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
    get livesync() {
      return System.getLibModule<LiveSync>(LibModule.LIVESYNC);
    },
    get module() {
      return System.getLibModule<Module>(LibModule.MODULE);
    },
  });
}
