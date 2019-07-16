import { EnumLiteralsOf } from 'bf-types';

export type LibModule = EnumLiteralsOf<typeof LibModule>;
// tslint:disable-next-line: variable-name
export const LibModule = Object.freeze({
  API: 'API',
  AUTH: 'AUTH',
} as const);
