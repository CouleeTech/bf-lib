import { CORE_MODULES, IModuleLink, IOrganization, IUser, IUserEntity } from 'bf-types';
import { Api } from '../api';
import { moduleLink, Nullable } from '../common';
import System, { LibModule } from '../system';
import { Auth } from './Types';

let userDoc: Nullable<IUser> = null;
let userDocs: Nullable<IUser[]> = null;
let organizationDoc: Nullable<IOrganization> = null;

async function getUser(): Promise<IUserEntity> {
  return System.nexus.getUser();
}

async function getUserDoc(): Promise<IUser> {
  if (userDoc) {
    return userDoc;
  }

  const api = System.getLibModule<Api>(LibModule.API);
  const userId = System.nexus.getUser().sub;
  const user = await api.get<IUser>(`core/user/entity/${userId}`);

  if (!user) {
    throw new Error('Failed to retrieve the document for the authenticated user.');
  }

  userDoc = user;
  return user;
}

async function getUserDocs(): Promise<IUser[]> {
  if (userDocs) {
    return userDocs;
  }

  const api = System.getLibModule<Api>(LibModule.API);
  const users = await api.get<IUser[]>('users');

  if (!users || !Array.isArray(users)) {
    return [];
  }

  userDocs = users;
  return users;
}

async function getOrganization(): Promise<IModuleLink> {
  return moduleLink(CORE_MODULES.ORGANIZATION, System.nexus.getUser().organization[0]);
}

async function getOrganizationDoc(): Promise<IOrganization> {
  if (organizationDoc) {
    return organizationDoc;
  }

  const api = System.getLibModule<Api>(LibModule.API);
  const organizationId = System.nexus.getUser().organization[0];
  const organization = await api.get<IOrganization>(`core/organization/entity/${organizationId}`);

  if (!organization) {
    throw new Error(`Failed to retrieve the document for the authenticated user's organization.`);
  }

  organizationDoc = organization;
  return organization;
}

function logOut() {
  System.nexus.logOut();
}

const auth: Auth = {
  getUser,
  getUserDoc,
  getUserDocs,
  getOrganizationDoc,
  getOrganization,
  logOut,
};

export default System.sealModule(Object.freeze(auth));
