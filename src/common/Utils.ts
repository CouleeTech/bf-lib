type FunctionType = (...args: any[]) => any;
type ObjectType = Record<string, any>;

export function makeCallable<F extends FunctionType, O extends ObjectType>(func: F, object: O): F & O {
  Object.assign(func, object);
  return func as F & O;
}

function intercept(wrapper: any) {
  return (target: any, property: string) => {
    if (target[property]) {
      if (wrapper[property]) {
        const propertyType = typeof wrapper[property];
        if (propertyType === 'function') {
          wrapper[property](...arguments);
        }
      }

      return target[property];
    } else {
      if (wrapper[property]) {
        return wrapper[property];
      }

      throw new Error('Tried to access an unititialized property.');
    }
  };
}

/**
 * Wrap an object in a proxy
 *
 * If a wrapper is supplied, each of its properties will be added to the proxy.
 * If a property is a function on the wrapper and target, the wrapper's function
 * will be invoked and then the target's will be.
 * If the proxy encounters a property that does not exist on the target or the
 * wrapper, it will throw an error.
 *
 * @param target The object what will be wrapped in a proxy
 * @param wrapper An optional object whose properties will be added to the proxy
 */
export function proxyWrap<T extends object, W extends Record<string, any> | undefined = T>(
  target: Record<string, any>,
  wrapper?: W,
): [T, T & W] {
  const proxy = new Proxy(target, {
    get: intercept(wrapper || {}),
    set() {
      throw new Error('Tried to update a readonly object.');
    },
  });

  return [target as T, proxy];
}

/**
 * Return a promise that will resolve after the given number of milliseconds
 *
 * @param time The time in milliseconds to wait before resolving the promise
 */
export function sleep(time: number): Promise<void> {
  return new Promise(done => {
    setTimeout(done, time);
  });
}
