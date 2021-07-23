import { DomainModule } from 'bf-types';

export type Await<T> = T extends Promise<infer U> ? U : T;

/**
 * A string formatted as a ISO 8601 timestamp
 */
export type ISODATE = string;

// TODO: Add more to this type as needed...
export type ValidModuleName = DomainModule;

export type Nullable<T> = T | null;

export type PartialExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;
