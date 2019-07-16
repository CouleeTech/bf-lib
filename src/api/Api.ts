import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Auth } from '../auth';
import { makeCallable, Nullable } from '../common';
import System, { LibModule } from '../system';
import { DELETE, FORBIDDEN, GET, POST, PUT, RequestMethod, UNAUTHORIZED, X_ORGANIZATION } from './Consts';
import { Api } from './Types';

async function getAuthHeaders(): Promise<Record<string, any>> {
  if (process.env.NODE_ENV === 'test') {
    return {};
  }

  const auth = System.getLibModule<Auth>(LibModule.AUTH);
  const organization = await auth.getOrganization();
  const headers = {
    [X_ORGANIZATION]: organization.module_id,
  };

  return headers;
}

function redirectToLogin() {
  const auth = System.getLibModule<Auth>(LibModule.AUTH);
  const redirectUrl = auth.getRedirectUrl();
  window.location.href = redirectUrl;
}

function rejectedBecauseAuth(e: AxiosError) {
  return e.response && e.response.status && (e.response.status === FORBIDDEN || e.response.status === UNAUTHORIZED);
}

async function request<R = any, P = object, H = object>(
  method: RequestMethod,
  url: string,
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
  requestSettings.headers ? { ...headers, ...authHeaders } : authHeaders;

  try {
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

async function get<R = any, P = object, H = object>(url: string, params?: P, headers?: H): Promise<Nullable<R>> {
  return request<R, P, H>(GET, url, params, headers);
}

async function del<R = any, P = object, H = object>(url: string, params?: P, headers?: H): Promise<Nullable<R>> {
  return request<R, P, H>(DELETE, url, params, headers);
}

async function post<R = any, P = object, H = object>(url: string, payload?: P, headers?: H): Promise<Nullable<R>> {
  return request<R, P, H>(POST, url, payload, headers);
}

async function put<R = any, P = object, H = object>(url: string, payload?: P, headers?: H): Promise<Nullable<R>> {
  return request<R, P, H>(PUT, url, payload, headers);
}

const api: Api = Object.freeze(makeCallable(request, { get, delete: del, post, put }));
export default api;
