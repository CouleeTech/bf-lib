import { IUserEntity } from 'bf-types';
import { NexusConfig } from '../common';
import { ClientAuth, System } from './Types';

export interface Nexus {
  getUrl(): string;
  getLoginUrl(returnUrl?: string): string;
  getUser(): IUserEntity;
  logOut(): void;
}

type FirstStageNexus = Omit<Nexus, 'getUser'>;

export default async function nexus(system: System, config: NexusConfig, clientAuth: ClientAuth): Promise<Nexus> {
  let baseUrl = config.url;
  if (baseUrl[baseUrl.length - 1] === '/') {
    baseUrl = baseUrl.slice(0, -1);
  }

  function logOut() {
    clientAuth.disconnect(system);
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
    logOut,
  };

  try {
    const user = await clientAuth.connect(baseUrl);

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
