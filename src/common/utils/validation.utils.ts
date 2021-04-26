// @ts-ignore
import * as deepEqual from 'deep-equal';

// eslint-disable-next-line max-len
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

/**
 * Verify that a value is an email address
 *
 * @param email A value that should be an email address
 */
export function isValidEmail(email?: string | null): boolean {
  return emailRegex.test(String(email));
}

/**
 * Create a function which, when given a particular value, will create a function to test
 * that value against the field value of an object.
 *
 * e.g., let x = { a: 1 }; fieldEquals('a')(1)(x) === true; fieldEquals('a')(2)(x) === false;
 *
 * @param field The name of a property for an object type.
 */
export function fieldEquals<T>(field: keyof T) {
  return <C extends T>(value: C[typeof field]) => (item: T): item is C => item && item[field] === value;
}

export function fieldNotEquals<T>(field: keyof T) {
  return (value: any): ((item: T) => boolean) => (item: T) => item[field] !== value;
}

export const titleEquals = fieldEquals<{ title: string }>('title');

export const statusEquals = fieldEquals<{ status: string }>('status');

export const idEquals = fieldEquals<{ id: string }>('id');

export const idNotEquals = fieldNotEquals<{ id: string }>('id');

/**
 * Check if a collection of arbitrary values are equal.
 *
 * @param values A collection of arbitrary values.
 */
export function equal(...values: any[]): boolean {
  if (values.length === 0) {
    return true;
  }

  const firstValue = values[0];

  for (let i = 1; i < values.length; i++) {
    if (!deepEqual(firstValue, values[i])) {
      return false;
    }
  }

  return true;
}
