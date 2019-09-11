import { Event, EventBus, EventHandler, EventHandlerMap, EventHandlerSet } from './Types';

export default function eventBus(): EventBus {
  const eventHandlerMap: EventHandlerMap = new Map();

  function publish(channel: string, event: Event<any>) {
    const eventHandlers = eventHandlerMap.get(channel);
    if (!eventHandlers) {
      return;
    }

    for (const handle of eventHandlers) {
      handle(event);
    }
  }

  function subscribe(channel: string, handler: EventHandler<any>) {
    let eventHandlers = eventHandlerMap.get(channel) as EventHandlerSet;
    if (eventHandlers) {
      eventHandlers = new Set();
      eventHandlerMap.set(channel, eventHandlers);
    }

    eventHandlers.add(handler);
  }

  const bus: EventBus = {
    publish,
    subscribe,
  };

  return Object.freeze(bus);
}
