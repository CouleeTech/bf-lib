import { IModuleLink, IUser, IUserEntity } from 'bf-types';

export interface Auth {
  getUser(): Promise<IUserEntity>;
  getUserDoc(): Promise<IUser>;
  getUserDocs(): Promise<IUser[]>;
  getOrganization(): Promise<IModuleLink>;
  getRedirectUrl(): string;
}
