import { IModuleLink, UUID } from 'bf-types';

export const LIVE_SYNC = 'LIVE_SYNC';
export const PUBLISH_LIVE_SYNC_EVENT = 'PUBLISH_LIVE_SYNC_EVENT';

export enum LiveSyncConnectionType {
  ORGANIZATION = 'ORGANIZATION',
}

export interface LiveSyncConnectionOptions extends IModuleLink {
  module_name: LiveSyncConnectionType;
}

export enum ConnectionEventType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  UNAUTHORIZED = 'unauthorized',
}

export type SyncEventType = ConnectionEventType | string;
export type Subscription<T = any> = (data: LiveEvent<T>) => void;
export type SubscriptionSet = Set<Subscription>;
export type SubscriptionMap = Map<SyncEventType, SubscriptionSet>;

/**
 * Events that are recieved over the WebSocket connection
 */
export interface LiveEvent<T> {
  /** Id of the event */
  id: UUID;

  /** Id of the command that initiated this event */
  command: UUID;

  /** Body of the event */
  body: T;
}

export interface InternalLiveEvent<T> {
  eventType: SyncEventType;
  eventPayload: LiveEvent<T>;
}

/**
 * Provides subscriptions to live events emitted over a WebSocket connection
 */
export interface LiveSync {
  /**
   * Establishes the WebSocket connection and begins the LiveSync
   *
   * This should fail silently is the connection has already begun.
   */
  begin(): void;

  /**
   * Subscribe a function that will be invoked each time a particular event is emitted
   *
   * @param eventType The globally unique name for the event being subscribed to
   * @param subscription A function that will be invoked each time the event is emitted
   */
  subscribe<T>(eventType: SyncEventType, subscription: Subscription<T>): Subscription;

  /**
   * Unsubscribe a function from a particular event
   *
   * @param eventType The globally unique name for the event that is currently subscribed to
   * @param subscription A function that was previously subscribed to the event
   */
  unsubscribe(eventType: SyncEventType, subscription: Subscription): Subscription;
}
