import { Decimal } from 'decimal.js';
import { camelCase, capitalize, chain, decapitalize, snakeCase } from 'voca';

/* ~~~ General String Functions ~~~ */

export function formatFloat(value: number, decimalPlaces?: number | false): string {
  let numberValue = NaN;

  if (!decimalPlaces) {
    numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      numberValue = 0;
    }
    return String(numberValue);
  }

  numberValue = new Decimal(Number(value)).toDP(decimalPlaces).toNumber();
  if (Number.isNaN(numberValue)) {
    numberValue = 0;
  }

  return numberValue.toFixed(decimalPlaces);
}

export function numberWithCommas(str: string): string {
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDecimal(value: number, decimalPlaces: number | false = 2): string {
  const rounded = formatFloat(value, decimalPlaces);
  const chunks = rounded.split('.');
  if (chunks.length < 2) {
    return numberWithCommas(rounded);
  }

  return `${numberWithCommas(chunks[0])}.${chunks[1]}`;
}

export function toDisplay(str: string): string {
  const split = str.replace(/_/g, ' ').toLocaleLowerCase().split(' ');

  const toUpper = split.map((s) => toUpperFirstLetter(s));

  return toUpper.join(' ');
}

export function toLowerCamel<T extends string = string>(str: T): T {
  return (camelCase(str) as any) as T;
}

export function toUpperCamel<T extends string = string>(str: string): T {
  return (chain(str).camelCase().capitalize().value() as any) as T;
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
  return (chain(str).snakeCase().upperCase().value() as any) as T;
}
