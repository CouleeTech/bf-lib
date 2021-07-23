import { EnumLiteralsOf } from 'bf-types';

export type NexusConfig = {
  url: string;
};

export type ClientType = EnumLiteralsOf<typeof ClientType>;
// tslint:disable-next-line: variable-name
export const ClientType = Object.freeze({
  BROWSER: 'BROWSER',
  NODE: 'NODE',
} as const);

export type ClientConfig = {
  type: ClientType;
};
