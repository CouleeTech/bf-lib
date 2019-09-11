import * as io from 'socket.io-client';
import * as msgpackParser from 'socket.io-msgpack-parser';
import { sleep } from '../common/Utils';
import System, { Event } from '../system';
import {
  ConnectionEventType,
  InternalLiveEvent,
  LiveSync,
  LIVE_SYNC,
  PUBLISH_LIVE_SYNC_EVENT,
  Subscription,
  SubscriptionSet,
  SyncEventType,
} from './Types';

class LiveSyncException extends Error {
  public constructor(message: string) {
    super(message);
  }
}

function subscribeAfterBegun() {
  throw new LiveSyncException("Can't subscribe after the connection has already begun.");
}

function noSubscriptionSet(eventType: SyncEventType) {
  throw new LiveSyncException(
    `Failed to unsubscribe to the ${eventType} event type. ${eventType} has no subscription set.`,
  );
}

function subscriptionNotInSet(eventType: SyncEventType) {
  const msg = `Failed to unsubscribe to the ${eventType} event type.
  The provided subscription is not a part of the ${eventType} subscription set.`;
  throw new LiveSyncException(msg);
}

const AUTHENTICATION = 'authentication';
const subscriptionMap = new Map<SyncEventType, SubscriptionSet>();
let socket: SocketIOClient.Socket;
let isSyncing = false;
let hasBegun = false;
let connectionTries = 0;

function begin() {
  if (isSyncing) {
    // TODO: Myabe add some form of logging here
    return;
  }

  System.getEventBus().subscribe(LIVE_SYNC, handleInternalPublishEvent);
  const connectionOptions = System.liveSyncOptions();
  if (!connectionOptions) {
    // TODO: Myabe add some form of logging here
    return;
  }

  isSyncing = true;
  const baseUrl = System.nexus.getUrl();

  socket = io(baseUrl, {
    transports: ['websocket'],
    autoConnect: false,
    parser: msgpackParser,
  } as any);

  socket.on(ConnectionEventType.CONNECT, () => {
    socket.emit(AUTHENTICATION, connectionOptions);
    invokeSubscriptionSet(ConnectionEventType.CONNECT, null);
  });

  socket.on(ConnectionEventType.DISCONNECT, reconnect);

  socket.on(ConnectionEventType.UNAUTHORIZED, (reason: string) => {
    invokeSubscriptionSet(ConnectionEventType.UNAUTHORIZED, reason);
    socket.disconnect();
  });

  for (const eventType of subscriptionMap.keys()) {
    socket.on(eventType, (data: any) => {
      invokeSubscriptionSet(eventType, data);
    });
  }

  socket.open();
  hasBegun = true;
}

function subscribe<T>(eventType: SyncEventType, subscription: Subscription<T>): Subscription {
  let subscriptionSet = subscriptionMap.get(eventType);
  if (!subscriptionSet) {
    if (hasBegun) {
      subscribeAfterBegun();
    }

    subscriptionSet = new Set<Subscription>();
    subscriptionMap.set(eventType, subscriptionSet);
  }

  subscriptionSet.add(subscription);
  return subscription;
}

function unsubscribe(eventType: SyncEventType, subscription: Subscription): Subscription {
  const subscriptionSet = subscriptionMap.get(eventType) as SubscriptionSet;

  if (!subscriptionSet) {
    noSubscriptionSet(eventType);
  }

  if (!subscriptionSet.has(subscription)) {
    subscriptionNotInSet(eventType);
  }

  subscriptionSet.delete(subscription);
  return subscription;
}

/* ~~ Helper Functions ~~ */

function handleInternalPublishEvent(event: Event<InternalLiveEvent<any>>) {
  if (event.topic === PUBLISH_LIVE_SYNC_EVENT) {
    invokeSubscriptionSet(event.data.eventType, event.data.eventPayload);
  }
}

/**
 * Invoke an entire subscription set with data emitted from an event
 *
 * @param eventType The globally unique name for the event the data was emitted from
 * @param data The data that will be passed as an argument to each subscription
 */
function invokeSubscriptionSet(eventType: SyncEventType, data: any) {
  const subscriptionSet = subscriptionMap.get(eventType);

  if (subscriptionSet) {
    for (const subscription of subscriptionSet) {
      subscription(data);
    }
  }
}

async function reconnect() {
  isSyncing = false;
  socket.close();

  if (connectionTries > 10) {
    await invokeSubscriptionSet(ConnectionEventType.DISCONNECT, null);
  } else {
    await sleep(1000);
    connectionTries++;
    begin();
  }
}

const livesync: LiveSync = {
  begin,
  subscribe,
  unsubscribe,
};

export default System.sealModule(Object.freeze(livesync));
