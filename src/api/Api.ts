import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Domain, DomainModule, ISearchFilter } from 'bf-types';
import { Auth } from '../auth';
import { domainToUri, minutesToMs, moduleToUri, Nullable, validateDomainAndModule } from '../common';
import { makeCallable } from '../common/Utils';
import System, { LibModule } from '../system';
import {
  DELETE,
  FORBIDDEN,
  GET,
  POST,
  PUT,
  RequestMethod,
  UNAUTHORIZED,
  X_CLIENT_TZ_OFFSET,
  X_ORGANIZATION,
} from './Consts';
import { Api, SearchOptions } from './Types';

let lastAuthHeaders = -1;
let cachedAuthHeaders = {};

async function getAuthHeaders(): Promise<Record<string, any>> {
  if (process.env.NODE_ENV === 'test') {
    return {};
  }

  const timestamp = Date.now();
  if (timestamp - lastAuthHeaders < 300000) {
    return cachedAuthHeaders;
  }

  lastAuthHeaders = timestamp;
  const auth = System.getLibModule<Auth>(LibModule.AUTH);
  const organization = await auth.getOrganization();

  cachedAuthHeaders = {
    [X_ORGANIZATION]: organization.module_id,
    [X_CLIENT_TZ_OFFSET]: minutesToMs(new Date().getTimezoneOffset()),
    'Content-Type': 'application/json;charset=UTF-8',
  };

  return cachedAuthHeaders;
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
  validateDomainAndModule(domain, module);
  const domainUri = domainToUri(domain);
  const moduleUri = moduleToUri(module);
  const response = await request(PUT, `${domainUri}/${moduleUri}/search`, { ...options, filters });
  return response ? response : [];
}

const api: Api = Object.freeze(makeCallable(request, { get, delete: del, post, put, search }));
export default System.sealModule(api);
