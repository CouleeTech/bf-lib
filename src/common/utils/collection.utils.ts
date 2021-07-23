/**
 * Ensure that a value is a collection.
 *
 * @param collection A value that might be a collection.
 */
export function getCollection<T extends any>(collection: T[] | null | undefined): T[] {
  return Array.isArray(collection) ? collection : [];
}

/**
 * Ensure that a value is a collection that has items in it.
 *
 * @param collection A value that might be a collection with items in it.
 */
export function hasItems<T extends any>(collection: T[] | null | undefined): collection is T[] {
  return Array.isArray(collection) && collection.length > 0;
}
