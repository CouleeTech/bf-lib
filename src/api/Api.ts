import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Domain, DomainModule, ISearchFilter } from 'bf-types';
import { Auth } from '../auth';
import { makeCallable, Nullable } from '../common';
import System, { LibModule } from '../system';
import { DELETE, FORBIDDEN, GET, POST, PUT, RequestMethod, UNAUTHORIZED, X_ORGANIZATION } from './Consts';
import { Api, SearchOptions } from './Types';

async function getAuthHeaders(): Promise<Record<string, any>> {
  if (process.env.NODE_ENV === 'test') {
    return {};
  }

  const auth = System.getLibModule<Auth>(LibModule.AUTH);
  const organization = await auth.getOrganization();
  const headers = {
    [X_ORGANIZATION]: organization.module_id,
    'Content-Type': 'application/json;charset=UTF-8',
  };

  return headers;
}

function redirectToLogin() {
  window.location.href = System.nexus.getLoginUrl(window.location.href);
}

function rejectedBecauseAuth(e: AxiosError) {
  return e.response && e.response.status && (e.response.status === FORBIDDEN || e.response.status === UNAUTHORIZED);
}

/**
 * Makes sure that a URI contains no leading '/' characters
 *
 * @param uri The URI being sanitized
 */
function sanitizeUri(uri: string) {
  const length = uri.length;
  let i = 0;
  for (; i < length; i++) {
    if (uri.charAt(i) !== '/') {
      break;
    }
  }

  if (i === 0) {
    return uri;
  }

  return uri.substr(i);
}

async function request<R = any, P = object, H = object>(
  method: RequestMethod,
  uri: string,
  data?: P,
  headers?: H,
): Promise<Nullable<R>> {
  const requestSettings: AxiosRequestConfig = {
    method,
    withCredentials: true,
  };

  if (data) {
    if (method === GET || method === DELETE) {
      requestSettings.params = data;
    } else {
      requestSettings.data = data;
    }
  }

  const authHeaders = await getAuthHeaders();
  requestSettings.headers = headers ? { ...headers, ...authHeaders } : authHeaders;

  try {
    const url = `${System.nexus.getUrl()}/${sanitizeUri(uri)}`;
    const response = (await Axios(url, requestSettings)) as AxiosResponse<R>;
    if (!response.data) {
      return null;
    }

    return response.data;
  } catch (e) {
    if (rejectedBecauseAuth(e)) {
      redirectToLogin();
    }
  }

  return null;
}

async function get<R = any, P = object, H = object>(uri: string, params?: P, headers?: H): Promise<Nullable<R>> {
  return request<R, P, H>(GET, uri, params, headers);
}

async function del<R = any, P = object, H = object>(uri: string, params?: P, headers?: H): Promise<Nullable<R>> {
  return request<R, P, H>(DELETE, uri, params, headers);
}

async function post<R = any, P = object, H = object>(uri: string, payload?: P, headers?: H): Promise<Nullable<R>> {
  return request<R, P, H>(POST, uri, payload, headers);
}

async function put<R = any, P = object, H = object>(uri: string, payload?: P, headers?: H): Promise<Nullable<R>> {
  return request<R, P, H>(PUT, uri, payload, headers);
}

async function search<T = any>(
  domain: Domain,
  module: DomainModule,
  filters: ISearchFilter[],
  options?: SearchOptions,
): Promise<T[]> {
  const response = await request(PUT, `${domain}/${module}/search`, { ...options, filters });
  return response ? response : [];
}

const api: Api = Object.freeze(makeCallable(request, { get, delete: del, post, put, search }));
export default api;
