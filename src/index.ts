import { Api } from './api';
import { Auth } from './auth';
import { ClientConfig, NexusConfig } from './common';
import System, { LibModule } from './system';

export type ConfigSettings = {
  nexus: NexusConfig;
  client: ClientConfig;
};

export interface Lib {
  api: Api;
  auth: Auth;
}

export default async function bflib(settings: ConfigSettings): Promise<Lib> {
  await System.init(settings);
  return Object.freeze({
    get api() {
      return System.getLibModule<Api>(LibModule.API);
    },
    get auth() {
      return System.getLibModule<Auth>(LibModule.AUTH);
    },
  });
}
