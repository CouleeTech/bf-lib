import { IModuleLink, IOrganization, IUser, IUserEntity } from 'bf-types';

export interface Auth {
  getUser(): Promise<IUserEntity>;
  getUserDoc(): Promise<IUser>;
  getUserDocs(): Promise<IUser[]>;
  getOrganization(): Promise<IModuleLink>;
  getOrganizationDoc(): Promise<IOrganization>;
  logOut(): void;
}
