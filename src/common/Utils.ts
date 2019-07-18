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
 * Wrap and object in a proxy
 *
 * If a wrapper is supplied, each of its properties will be added to the proxy.
 * If a property in a function on the wrapper and target, the wrapper's will be
 * invoked and then the target's will be.
 * If the proxy encounters a property that does not exists on the target or the
 * wrapper, it will fail hard and throw an error.
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
      throw new Error('Illegal access to a protected object.');
    },
  });

  return [target as T, proxy];
}

export type Lock<T> = (suppliedKey: symbol) => T;

export function lock<T extends object>(obj: T, key: symbol): Lock<T> {
  const guard = Object.freeze({ key });

  function unlock(suppliedKey: symbol) {
    const keyRef = suppliedKey;
    if (typeof keyRef === 'symbol' && guard.key === keyRef) {
      return obj;
    }
    throw new Error('Illegal access to a protected object.');
  }

  return Object.freeze(unlock);
}
