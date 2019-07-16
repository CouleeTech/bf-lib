type FunctionType = (...args: any[]) => any;
type ObjectType = Record<string, any>;

export function makeCallable<F extends FunctionType, O extends ObjectType>(func: F, object: O): F & O {
  for (const prop in object) {
    if (object.hasOwnProperty(prop)) {
      (func as any)[prop] = object[prop];
    }
  }

  return func as F & O;
}
