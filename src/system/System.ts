import Api from '../api/Api';
import Auth, { setAuthInstance } from '../auth/Auth';
import { Auth as AuthInterface } from '../auth/Types';
import { toDisplay } from '../common';
import { LibModule } from './Types';

export type InitSettings = {
  auth: AuthInterface;
};

let initialized = false;
const libModuleMap = new Map<LibModule, any>();

async function init(settings: InitSettings) {
  if (initialized) {
    return;
  }

  setAuthInstance(settings.auth);
  setLibModule(LibModule.AUTH, Auth);
  setLibModule(LibModule.API, Api);

  initialized = true;
}

function getLibModule<T>(type: LibModule): T {
  const module = libModuleMap.get(type);
  if (!module) {
    throw new Error(`No instance was found for the ${toDisplay(type)} Lib Module.`);
  }
  return module;
}

function setLibModule(type: LibModule, module: any) {
  if (!initialized) {
    libModuleMap.set(type, module);
  }
}

export default Object.freeze({
  init,
  getLibModule,
});
