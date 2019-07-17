import { IUserEntity } from 'bf-types';
import { ClientConfig, ClientType, NexusConfig, Nullable } from '../common';

export interface Nexus {
  getUrl(): string;
  getLoginUrl(returnUrl?: string): string;
  getUser(): IUserEntity;
}

type FirstStageNexus = Omit<Nexus, 'getUser'>;

export default async function nexus(config: NexusConfig, client: ClientConfig): Promise<Nexus> {
  let baseUrl = config.url;
  if (baseUrl[baseUrl.length - 1] === '/') {
    baseUrl = baseUrl.slice(0, -1);
  }

  function getUrl() {
    return baseUrl;
  }

  function getLoginUrl(returnUrl?: string) {
    if (typeof returnUrl !== 'string') {
      return `${baseUrl}/login`;
    }

    return `${baseUrl}/login?returnUrl=${returnUrl}`;
  }

  const instance: FirstStageNexus = {
    getUrl,
    getLoginUrl,
  };

  try {
    const user = await authenticate(instance, client);

    if (!user) {
      throw new Error('Was not able to authenticate the user.');
    }

    function getUser() {
      return user as IUserEntity;
    }

    return Object.freeze({ ...instance, getUser });
  } catch (e) {
    throw new Error(`Failed to establish a proper connection with a Nexus node. ${e.message}`);
  }
}

async function authenticate(instance: FirstStageNexus, client: ClientConfig) {
  if (client.type === ClientType.BROWSER) {
    return authenticateBrowserClient(instance, client);
  } else if (client.type === ClientType.CONSOLE) {
    throw new Error(`Console clients aren't available yet.`);
  }

  throw new Error(`${client.type} is not a valid type of client to use with bf-lib.`);
}

async function authenticateBrowserClient(
  instance: FirstStageNexus,
  client: ClientConfig,
): Promise<Nullable<IUserEntity>> {
  if (typeof window === 'undefined') {
    throw new Error('Tried to authenticate as browser client outside of a browser.');
  }

  if (client.apiKey) {
    throw new Error('API keys are not allowed when using a browser client.');
  }

  const logInUrl = instance.getLoginUrl(window.location.href);
  const userUrl = `${instance.getUrl()}/user`;
  const requestOptions = { method: 'GET', credentials: 'include' };

  const response = await fetch(userUrl, requestOptions as RequestInit);

  if (response.url) {
    if (response.status === 403 || response.status === 401) {
      window.location.href = logInUrl;
      return new Promise(_ => {
        setTimeout(() => null, 10000);
      });
    } else if (response.ok) {
      const userData = await response.json();
      return userData as IUserEntity;
    }
  }

  window.location.href = logInUrl;
  return new Promise(_ => {
    setTimeout(() => null, 10000);
  });
}
