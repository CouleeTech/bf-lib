import { EnumLiteralsOf, IUserEntity } from 'bf-types';
import { ClientConfig, LiveSyncConfig, NexusConfig, Nullable } from '../common/Types';
import { LiveSyncConnectionOptions } from '../livesync/Types';
import { Nexus } from './Nexus';

export type Lock<T> = (suppliedKey: symbol) => T;

export type InitSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
  auth: ClientAuth;
  livesync?: LiveSyncConfig;
};

export interface SystemWrapper {
  init(settings: InitSettings): void;
  sealModule<T extends object>(module: T): Lock<T>;
}

export interface SystemInstance {
  getLibModule: <T>(type: LibModule) => T;
  liveSyncOptions: () => Nullable<LiveSyncConnectionOptions>;
  nexus: Nexus;
}

export type System = SystemInstance & SystemWrapper;

export type LibModule = EnumLiteralsOf<typeof LibModule>;
// tslint:disable-next-line: variable-name
export const LibModule = Object.freeze({
  API: Symbol('API'),
  AUTH: Symbol('AUTH'),
  LIVESYNC: Symbol('LIVESYNC'),
  MODULE: Symbol('MODULE'),
} as const);

export interface ClientAuth {
  connect(system: System): Promise<Nullable<IUserEntity>> | Nullable<IUserEntity>;
  reconnect(system: System): Promise<Nullable<IUserEntity>> | Nullable<IUserEntity>;
  disconnect(system: System): void;
}
