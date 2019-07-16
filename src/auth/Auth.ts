import { IModuleLink, IUser, IUserEntity } from 'bf-types';
import { Nullable } from '../common';
import { Auth } from './Types';

let authInstance: Nullable<Auth> = null;

async function getUser(): Promise<IUserEntity> {
  if (ensureAuthInstance(authInstance)) {
    return authInstance.getUser();
  }

  throw new Error('No instance was found for the Auth Module.');
}

async function getUserDoc(): Promise<IUser> {
  if (ensureAuthInstance(authInstance)) {
    return authInstance.getUserDoc();
  }

  throw new Error('No instance was found for the Auth Module.');
}

async function getUserDocs(): Promise<IUser[]> {
  if (ensureAuthInstance(authInstance)) {
    return authInstance.getUserDocs();
  }

  throw new Error('No instance was found for the Auth Module.');
}

async function getOrganization(): Promise<IModuleLink> {
  if (ensureAuthInstance(authInstance)) {
    return authInstance.getOrganization();
  }

  throw new Error('No instance was found for the Auth Module.');
}

function getRedirectUrl(): string {
  if (ensureAuthInstance(authInstance)) {
    return authInstance.getRedirectUrl();
  }

  throw new Error('No instance was found for the Auth Module.');
}

const auth: Auth = {
  getUser,
  getUserDoc,
  getUserDocs,
  getOrganization,
  getRedirectUrl,
};

export default Object.freeze(auth);

export function setAuthInstance(instance: Auth) {
  if (!instance) {
    authInstance = instance;
  }
}

function ensureAuthInstance(instance: Nullable<Auth>): instance is Auth {
  return instance ? true : false;
}
