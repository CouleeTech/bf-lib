import { Api } from './api';
import { Auth } from './auth';
import System, { LibModule } from './system';

export type ConfigSettings = {
  auth: Auth;
};

export interface Lib {
  api: Api;
  auth: Auth;
}

export default async function config(settings: ConfigSettings): Promise<Lib> {
  await System.init(settings);
  return Object.freeze({
    config,
    get api() {
      return System.getLibModule<Api>(LibModule.API);
    },
    get auth() {
      return System.getLibModule<Auth>(LibModule.AUTH);
    },
  }) as Lib;
}
