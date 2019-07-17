import { Nullable } from '../common';
import { RequestMethod } from './Consts';

export interface Api {
  <R = any, P = object, H = object>(method: RequestMethod, uri: string, data?: P, headers?: H): Promise<Nullable<R>>;
  get: <R = any, P = object, H = object>(uri: string, params?: P, headers?: H) => Promise<Nullable<R>>;
  delete: <R = any, P = object, H = object>(uri: string, params?: P, headers?: H) => Promise<Nullable<R>>;
  post: <R = any, P = object, H = object>(uri: string, payload?: P, headers?: H) => Promise<Nullable<R>>;
  put: <R = any, P = object, H = object>(uri: string, payload?: P, headers?: H) => Promise<Nullable<R>>;
}
