import { ICreatedDateDoc, ModuleProperty, SortDirection } from 'bf-types';

/**
 * Generate a function to sort string values.
 *
 * @param dir The sort direction.
 */
export function stringSorter(dir: SortDirection): (l: string, r: string) => number {
  if (dir === 'asc') {
    return (l: string, r: string) => l.localeCompare(r);
  }

  return (l: string, r: string) => -l.localeCompare(r);
}

/**
 * Generate a function used to sort objects with a particular string field.
 *
 * @param field The name of a property on the type being sorted.
 * @param dir The sort direction.
 */
export function stringFieldSorter<T extends Record<string, any>>(
  field: keyof T,
  dir: SortDirection,
): (l: T, r: T) => number {
  if (dir === 'asc') {
    return ({ [field]: l }: T, { [field]: r }: T) => l.localeCompare(r);
  }

  return ({ [field]: l }: T, { [field]: r }: T) => -l.localeCompare(r);
}

/**
 * Sort a collection of objects by the value of their created date field.
 *
 * @param dir The sort direction. Defaults to SortDirection.DESC.
 */
export function sortByCreatedDate<T extends ICreatedDateDoc>(
  dir: SortDirection = SortDirection.DESC,
): (l: T, r: T) => number {
  return stringFieldSorter<T>(ModuleProperty.CREATED_DATE, dir);
}
