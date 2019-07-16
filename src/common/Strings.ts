import { camelCase, capitalize, chain, decapitalize, snakeCase } from 'voca';

export function formatFloat(value: number, decimalPlaces: number): string {
  return String(Number(Math.round(parseFloat(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces));
}

export function toDisplay(str: string): string {
  const split = str
    .replace(/_/g, ' ')
    .toLocaleLowerCase()
    .split(' ');

  const toUpper = split.map(s => toUpperFirstLetter(s));

  return toUpper.join(' ');
}

export function toLowerCamel<T extends string = string>(str: T): T {
  return (camelCase(str) as any) as T;
}

export function toUpperCamel<T extends string = string>(str: string): T {
  return (chain(str)
    .camelCase()
    .capitalize()
    .value() as any) as T;
}

export function toLowerFirstLetter<T extends string = string>(str: string): T {
  return (decapitalize(str) as any) as T;
}

export function toUpperFirstLetter<T extends string = string>(str: string): T {
  return (capitalize(str) as any) as T;
}

export function toLowerSnakeCase<T extends string = string>(str: string): T {
  return (snakeCase(str) as any) as T;
}

export function toUpperSnakeCase<T extends string = string>(str: string): T {
  return (chain(str)
    .snakeCase()
    .upperCase()
    .value() as any) as T;
}
