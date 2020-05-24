import { Domain, DomainModule, ISearchFilter, ISearchQueryWithFiltersSimple } from 'bf-types';
import { Nullable } from '../common';
import type { ObjectType } from '../system/Types';
import { RequestMethod } from './Consts';

export type SearchOptions = Omit<ISearchQueryWithFiltersSimple, 'filters'>;

export interface Api {
  <R = any, P = ObjectType, H = ObjectType>(method: RequestMethod, uri: string, data?: P, headers?: H): Promise<
    Nullable<R>
  >;
  get: <R = any, P = ObjectType, H = ObjectType>(uri: string, params?: P, headers?: H) => Promise<Nullable<R>>;
  delete: <R = any, P = ObjectType, H = ObjectType>(uri: string, params?: P, headers?: H) => Promise<Nullable<R>>;
  post: <R = any, P = ObjectType, H = ObjectType>(uri: string, payload?: P, headers?: H) => Promise<Nullable<R>>;
  put: <R = any, P = ObjectType, H = ObjectType>(uri: string, payload?: P, headers?: H) => Promise<Nullable<R>>;
  search: <T = any>(
    domain: Domain,
    module: DomainModule,
    filters: ISearchFilter[],
    options?: SearchOptions,
  ) => Promise<T[]>;
}
