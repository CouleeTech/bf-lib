import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Domain, DomainModule, SearchFilter } from 'bf-types';
import { Auth } from '../auth';
import { domainToUri, moduleToUri, Nullable, validateDomainAndModule } from '../common';
import System, { HeadersType, LibModule } from '../system';
import { makeCallable } from '../system/Utils';
import { DELETE, FORBIDDEN, GET, POST, PUT, RequestMethod, UNAUTHORIZED, X_CLIENT_TZ, X_ORGANIZATION } from './Consts';
import { Api, SearchOptions } from './Types';

let lastAuthHeaders = -1;
let cachedAuthHeaders: HeadersType = {};

async function getAuthHeaders(useCachedHeaders = true): Promise<Record<string, any>> {
  if (process.env.NODE_ENV === 'test') {
    return {};
  }

  const timestamp = Date.now();
  if (useCachedHeaders) {
    if (timestamp - lastAuthHeaders < 300000) {
      return cachedAuthHeaders;
    }
  }

  lastAuthHeaders = timestamp;
  const auth = System.getLibModule<Auth>(LibModule.AUTH);
  const organization = await auth.getOrganization();

  cachedAuthHeaders = {
    [X_ORGANIZATION]: organization.module_id,
    [X_CLIENT_TZ]: Intl.DateTimeFormat().resolvedOptions().timeZone,
    'Content-Type': 'application/json;charset=UTF-8',
  };

  return cachedAuthHeaders;
}

function rejectedBecauseAuth(e: AxiosError) {
  return Boolean(
    e.response && e.response.status && (e.response.status === FORBIDDEN || e.response.status === UNAUTHORIZED),
  );
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

async function request<R = any, P = Record<string, any>, H = HeadersType>(
  method: RequestMethod,
  uri: string,
  data?: P,
  headers?: H,
  canRetryAuth = true,
  customBaseUrl?: string,
): Promise<Nullable<R>> {
  let authFailed = false;

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

  const authHeaders = await getAuthHeaders(canRetryAuth);
  const impersonateHeaders = System.isProtected() ? System.getImpersonationHeaders() : {};
  requestSettings.headers = { ...authHeaders, ...System.getHttpHeaders(), ...headers, ...impersonateHeaders };

  try {
    const baseUrl = customBaseUrl || System.nexus.getUrl();
    const url = `${baseUrl}/${sanitizeUri(uri)}`;
    const response = (await Axios(url, requestSettings)) as AxiosResponse<R>;
    if (!response || !response.data) {
      return null;
    }

    return response.data;
  } catch (e) {
    authFailed = rejectedBecauseAuth(e);
  }

  if (authFailed && canRetryAuth) {
    // TODO: consider setting an amount of times to retry auth
    const user = await System.nexus.reconnect();
    if (user) {
      return request<R, P, H>(method, uri, data, headers, false);
    }
  }

  return null;
}

function get<R = any, P = Record<string, any>, H extends HeadersType = HeadersType>(
  uri: string,
  params?: P,
  headers?: H,
  customBaseUrl?: string,
): Promise<Nullable<R>> {
  return request<R, P, H>(GET, uri, params, headers, true, customBaseUrl);
}

function del<R = any, P = Record<string, any>, H extends HeadersType = HeadersType>(
  uri: string,
  params?: P,
  headers?: H,
  customBaseUrl?: string,
): Promise<Nullable<R>> {
  return request<R, P, H>(DELETE, uri, params, headers, true, customBaseUrl);
}

function post<R = any, P = Record<string, any>, H extends HeadersType = HeadersType>(
  uri: string,
  payload?: P,
  headers?: H,
  customBaseUrl?: string,
): Promise<Nullable<R>> {
  return request<R, P, H>(POST, uri, payload, headers, true, customBaseUrl);
}

function put<R = any, P = Record<string, any>, H extends HeadersType = HeadersType>(
  uri: string,
  payload?: P,
  headers?: H,
  customBaseUrl?: string,
): Promise<Nullable<R>> {
  return request<R, P, H>(PUT, uri, payload, headers, true, customBaseUrl);
}

async function search<T = any, H extends HeadersType = HeadersType>(
  domain: Domain,
  module: DomainModule,
  filters: SearchFilter[],
  options?: SearchOptions<H>,
): Promise<T[]> {
  validateDomainAndModule(domain, module);
  const domainUri = domainToUri(domain);
  const moduleUri = moduleToUri(module);
  if (options?.withFormData) {
    const response = await request(
      PUT,
      `${domainUri}/${moduleUri}/search/context`,
      { ...options, filters },
      options?.headers,
    );
    return response ? response.map(({ entity }: any) => entity) : [];
  }
  const response = await request(PUT, `${domainUri}/${moduleUri}/search`, { ...options, filters }, options?.headers);
  return response ? response : [];
}

const api: Api = Object.freeze(makeCallable(request, { get, delete: del, post, put, search }));
export default System.sealModule(api);
