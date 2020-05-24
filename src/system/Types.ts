import { EnumLiteralsOf, IUserEntity } from 'bf-types';
import { ClientConfig, LiveSyncConfig, NexusConfig, Nullable } from '../common/Types';
import { LiveSyncConnectionOptions } from '../livesync/Types';
import { Nexus } from './Nexus';

export type ObjectType = Record<string, any>;

export type Lock<T> = (suppliedKey: symbol) => T;

export type InitSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
  auth: ClientAuth;
  logging: SystemLoggerOptions;
  livesync?: LiveSyncConfig;
};

export type SystemLogLevel = 'debug' | 'info' | 'warn' | 'error';

export type SystemLogLevelMask = SystemLogLevel[];

export type SystemLoggerOptions = {
  logger: SystemLogger;
  mask: SystemLogLevelMask;
};

export interface SystemLogger {
  debug: (message: any) => void;
  info: (message: any) => void;
  warn: (message: any) => void;
  error: (message: any) => void;
}

export interface SystemWrapper {
  init(settings: InitSettings): void;
  sealModule<T extends ObjectType>(module: T): Lock<T>;
}

export interface SystemInstance {
  nexus: Nexus;
  getHttpHeaders(): Record<string, string>;
  setHttpHeader(key: string, value: string): void;
  getEventBus(): EventBus;
  getLibModule: <T>(type: LibModule) => T;
  liveSyncOptions: () => Nullable<LiveSyncConnectionOptions>;
}

export type System = SystemInstance & SystemWrapper;

export type LibModule = EnumLiteralsOf<typeof LibModule>;
// tslint:disable-next-line: variable-name
export const LibModule = Object.freeze({
  API: Symbol('API'),
  AUTH: Symbol('AUTH'),
  LIVESYNC: Symbol('LIVESYNC'),
  MODULE: Symbol('MODULE'),
  MULTITOOL: Symbol('MULTITOOL'),
} as const);

export interface ClientAuth {
  connect(nexusUrl: string): Promise<Nullable<IUserEntity>> | Nullable<IUserEntity>;
  afterConnect?: (system: SystemInstance) => void;
  reconnect(system: SystemInstance): Promise<Nullable<IUserEntity>> | Nullable<IUserEntity>;
  disconnect(system: SystemInstance): void;
}

export type Event<T> = {
  topic: string;
  data: T;
};

export type EventHandler<T> = (event: Event<T>) => void;
export type EventHandlerSet = Set<EventHandler<any>>;
export type EventHandlerMap = Map<string, EventHandlerSet>;

/**
 * An EventBus is used by the system for interal, decoupled communication
 * between different modules
 */
export interface EventBus {
  publish(channel: string, event: Event<any>): void;
  subscribe(channel: string, handler: EventHandler<any>): void;
}
