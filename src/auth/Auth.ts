import {
  CORE_MODULES,
  IModuleLink,
  IOrganization,
  IParticipant,
  IUser,
  IUserEntity,
  ScopeDefinition,
  TParticipantScope,
  TSecurityTypes,
} from 'bf-types';
import System, { LibModule } from '../system';

import { Api } from '../api';
import { Auth } from './Types';
import { moduleLink } from '../common';

async function getUser(): Promise<IUserEntity> {
  return System.nexus.getUser();
}

async function getUserDoc(): Promise<IUser> {
  const api = System.getLibModule<Api>(LibModule.API);
  const userId = System.nexus.getUser().sub;
  const user = await api.get<IUser>(`core/user/entity/${userId}`);

  if (!user) {
    throw new Error('Failed to retrieve the document for the authenticated user.');
  }

  return user;
}

async function getUserDocs(): Promise<IUser[]> {
  const api = System.getLibModule<Api>(LibModule.API);
  const users = await api.get<IUser[]>('users');

  if (!users || !Array.isArray(users)) {
    return [];
  }

  return users;
}

async function getOrganization(): Promise<IModuleLink> {
  return moduleLink(CORE_MODULES.ORGANIZATION, System.nexus.getUser().organization[0]);
}

async function getOrganizationDoc(): Promise<IOrganization> {
  const api = System.getLibModule<Api>(LibModule.API);
  const organizationId = System.nexus.getUser().organization[0];
  const organization = await api.get<IOrganization>(`core/organization/entity/${organizationId}`);

  if (!organization) {
    throw new Error("failed to retrieve the document for the authenticated user's organization");
  }

  return organization;
}

export function hasPermissions(
  participants: IParticipant[],
  securityLevel: TSecurityTypes,
  ...validModules: IModuleLink[]
): boolean {
  let state = false;
  const scopes: TParticipantScope[] = [];
  const validModuleIds = validModules.map((m) => m.module_id);

  for (const participant of participants) {
    if (validModuleIds.includes(participant.module_id)) {
      scopes.push(...participant.scopes);
    }
  }

  for (const scope of scopes) {
    // if disallows, return immediately
    if (ScopeDefinition[scope].disallows.indexOf(securityLevel) !== -1) {
      return false;
    }
    // if allowed set state to true, but continue looking, in case a scope disallows it, Disallows trumps allows
    if (ScopeDefinition[scope].allows.indexOf(securityLevel) !== -1) {
      state = true;
    }
  }

  return state;
}

function logOut() {
  System.nexus.disconnect();
}

const auth: Auth = {
  getUser,
  getUserDoc,
  getUserDocs,
  getOrganizationDoc,
  getOrganization,
  hasPermissions,
  logOut,
};

export default System.sealModule(Object.freeze(auth));
