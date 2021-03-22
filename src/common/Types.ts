import { DomainModule, EnumLiteralsOf } from 'bf-types';

// TODO: Add more to this type as needed...
export type ValidModuleName = DomainModule;

export type Nullable<T> = T | null;

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

export type PartialExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;
