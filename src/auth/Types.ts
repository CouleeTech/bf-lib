import { IModuleLink, IOrganization, IParticipant, IUser, IUserEntity, TSecurityTypes } from 'bf-types';

export interface Auth {
  getUser(): Promise<IUserEntity>;
  getUserDoc(): Promise<IUser>;
  getUserDocs(): Promise<IUser[]>;
  getOrganization(): Promise<IModuleLink>;
  getOrganizationDoc(): Promise<IOrganization>;
  hasPermissions(participants: IParticipant[], securityLevel: TSecurityTypes, ...validModules: IModuleLink[]): boolean;
  logOut(): void;
}
