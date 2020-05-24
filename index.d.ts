import { Api } from './api';
import { Auth } from './auth';
import { ClientConfig, ClientType, ConnectionType, LiveSyncConfig, NexusConfig } from './common';
import { LiveEvent, LiveSync } from './livesync';
import { Module } from './module';
import { Multitool } from './multitool';
import { ClientAuth, SystemInstance, SystemLoggerOptions } from './system';
export {
  Api,
  Auth,
  LiveSync,
  Module,
  LiveEvent,
  ClientType,
  ClientAuth,
  ConnectionType,
  ClientConfig,
  NexusConfig,
  LiveSyncConfig,
  SystemInstance,
};
export declare type ConfigSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
  auth: ClientAuth;
  logging: SystemLoggerOptions;
  livesync?: LiveSyncConfig;
};
export interface BfLib {
  api: Api;
  auth: Auth;
  livesync: LiveSync;
  module: Module;
  multitool: Multitool;
}
export default function bflib(settings: ConfigSettings): Promise<BfLib>;
