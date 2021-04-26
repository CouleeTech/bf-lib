import { DeepFields } from '../types';

export function equals<V>(value: V) {
  return <T extends V>(check: T): boolean => check === value;
}

export function notEquals<V>(value: V) {
  return <T extends V>(check: T): boolean => check !== value;
}

/**
 * Creates a function which will reduce an object type down to one of its named properties.
 *
 * @param field The name of a property for an object type.
 */
export function getField<K extends PropertyKey>(field: K) {
  return <T extends Record<K, unknown>>(obj: T): Pick<T, K> => obj[field] as Pick<T, K>;
}

/**
 * Creates a function which will reduce an object type down to one that excludes a named property.
 *
 * @param field The name of a property for an object type.
 */

export function removeField<K extends PropertyKey>(field: K) {
  return <T extends Partial<Record<K, unknown>>>(obj: T): Omit<T, K> => {
    const good: any = {};
    const objAny = obj as any;
    for (const key of Object.keys(obj)) {
      if (field !== key) {
        good[key] = objAny[key];
      }
    }
    return good as Omit<T, K>;
  };
}

/* export function removeField<K extends PropertyKey>(field: K) {
  return <T extends Partial<Record<K, unknown>>>(obj: T): Omit<T, K> =>
    Object.fromEntries(
      Object.keys(obj)
        .filter(notEquals<PropertyKey>(field))
        .map((field) => [field, obj[field as keyof typeof obj]]),
    ) as Omit<T, K>;
}*/

export const removeId = removeField('id');

/**
 * Creates a function which will map an object to a new one with an additional named property.
 *
 * @param field The name of a property for an object type.
 */
export function addField<K extends PropertyKey>(field: K) {
  return <V extends any>(value: V) => <T extends Record<string, unknown>>(obj: T): T & Record<K, V> =>
    ({ ...obj, [field]: value } as T & Record<K, V>);
}

/**
 * Creates a function which will reduce an object type down to a subset of its named properties.
 *
 * @param fields A list of property names for an object type.
 */
export function getFields<K extends PropertyKey>(...fields: K[]) {
  return <T extends Record<K, unknown>>(obj: T): Pick<T, K> => {
    const good2: any = {};
    const obj2: any = obj;
    const fiedls2: any[] = fields;
    for (const key of Object.keys(obj2) as any[]) {
      if (fiedls2.includes(key)) {
        good2[key] = obj2[key];
      }
    }
    return good2 as Pick<T, K>;
  };
}

/**
 * Works like getField except it can get properties for nested object fields.
 *
 * For example, if we have an object like: { A: { B: { C: true } } }
 * and we get these fields: A, B, C
 * then we will reduce the original object to A.B.C which is the value true.
 *
 * @param fields A list of property names
 */
export function getPath<T extends Record<string, unknown>>(...fields: Array<DeepFields<T>>): (obj: T) => any {
  return <V>(obj: T): V =>
    fields.reduce<any>((subObj, field) => (subObj && typeof subObj === 'object' ? subObj[field] : subObj), obj);
}

/**
 * Create a function that composes a list of functions
 *
 * @param fns A list of functions to be used in the pipe
 */
export function pipe(...fns: Array<(arg: any) => any>) {
  return <I>(input: I): I => fns.reduce((nextInput, fn) => fn(nextInput), input);
}
