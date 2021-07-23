import { IUserEntity } from 'bf-types';
import { NexusConfig, Nullable } from '../common';
import { ClientAuth, System } from './Types';

export interface Nexus {
  getUrl(): string;
  getLoginUrl(returnUrl?: string): string;
  getUser(): IUserEntity;
  disconnect(): void;
  reconnect(): Promise<Nullable<IUserEntity>>;
}

type FirstStageNexus = Omit<Nexus, 'getUser'>;

export default async function nexus(system: System, config: NexusConfig, clientAuth: ClientAuth): Promise<Nexus> {
  let user: Nullable<IUserEntity> = null;

  let baseUrl = config.url;
  if (baseUrl[baseUrl.length - 1] === '/') {
    baseUrl = baseUrl.slice(0, -1);
  }

  function getUrl() {
    return baseUrl;
  }

  function getUser() {
    return user as IUserEntity;
  }

  function getLoginUrl(returnUrl?: string) {
    if (typeof returnUrl !== 'string') {
      return `${baseUrl}/login`;
    }

    return `${baseUrl}/login?returnUrl=${returnUrl}`;
  }

  async function disconnect() {
    await clientAuth.disconnect(system);
    if (clientAuth.afterDisconnect) {
      clientAuth.afterDisconnect(system);
    }
  }

  async function reconnect(): Promise<Nullable<IUserEntity>> {
    await disconnect();
    const result = await clientAuth.reconnect(system);
    if (!result) {
      return null;
    }

    user = result;

    if (clientAuth.afterConnect) {
      clientAuth.afterConnect(system);
    }

    return result;
  }

  const instance: FirstStageNexus = {
    getUrl,
    getLoginUrl,
    disconnect,
    reconnect,
  };

  try {
    user = await clientAuth.connect(baseUrl);
    if (!user) {
      throw new Error('was not able to authenticate the user');
    }

    return Object.freeze({ ...instance, getUser });
  } catch (e) {
    throw new Error(`failed to establish a proper connection with a nexus node: ${e.message}`);
  }
}
