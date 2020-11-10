import { Domain, DomainModule, SearchFilter, SearchOptions as BfSearchOptions } from 'bf-types';
import { Nullable } from '../common';
import type { HeadersType, ObjectType } from '../system/Types';
import { RequestMethod } from './Consts';

export type SearchOptions<H extends HeadersType = HeadersType> = Omit<BfSearchOptions, 'filters'> & { headers?: H };

export interface Api {
  <R = any, P = ObjectType, H extends HeadersType = HeadersType>(
    method: RequestMethod,
    uri: string,
    data?: P,
    headers?: H,
  ): Promise<Nullable<R>>;
  get: <R = any, P = ObjectType, H extends HeadersType = HeadersType>(
    uri: string,
    params?: P,
    headers?: H,
  ) => Promise<Nullable<R>>;
  delete: <R = any, P = ObjectType, H extends HeadersType = HeadersType>(
    uri: string,
    params?: P,
    headers?: H,
  ) => Promise<Nullable<R>>;
  post: <R = any, P = ObjectType, H extends HeadersType = HeadersType>(
    uri: string,
    payload?: P,
    headers?: H,
  ) => Promise<Nullable<R>>;
  put: <R = any, P = ObjectType, H extends HeadersType = HeadersType>(
    uri: string,
    payload?: P,
    headers?: H,
  ) => Promise<Nullable<R>>;
  search: <T = any, H extends HeadersType = HeadersType>(
    domain: Domain,
    module: DomainModule,
    filters: SearchFilter[],
    options?: SearchOptions<H>,
  ) => Promise<T[]>;
}
