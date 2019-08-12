import { EnumLiteralsOf } from 'bf-types';

export type LibModule = EnumLiteralsOf<typeof LibModule>;
// tslint:disable-next-line: variable-name
export const LibModule = Object.freeze({
  API: Symbol('API'),
  AUTH: Symbol('AUTH'),
  LIVESYNC: Symbol('LIVESYNC'),
  MODULE: Symbol('MODULE'),
} as const);
