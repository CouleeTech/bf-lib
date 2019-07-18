import { Domain, DomainModule, IEntity, IModuleLink, ISODATE, ModuleProperty, UUID } from 'bf-types';
import { Nullable } from '../common';

type GeneratedProperties = {
  id: UUID;
  [ModuleProperty.CREATED_BY]: IModuleLink;
  [ModuleProperty.CREATED_DATE]: ISODATE;
  [ModuleProperty.UPATED_DATE]: ISODATE;
  [ModuleProperty.ORGANIZATION]: IModuleLink;
};

type GeneratedPropertyKeys = keyof GeneratedProperties;

export type InsertData<T extends IEntity> = Partial<Omit<T, GeneratedPropertyKeys>>;

export interface ModuleEntity<T extends IEntity = IEntity> {
  get(id: UUID): Promise<Nullable<T>>;
  create(data: InsertData<T>): Promise<Nullable<T & IModuleLink>>;
  delete<U extends object>(id: UUID, data?: U): Promise<Nullable<T & IModuleLink>>;
  view<U extends object>(id: UUID, data?: U): Promise<Nullable<IModuleLink>>;
}

export interface ModuleExternal {
  get<T extends IEntity = IEntity>(domain: Domain, module: DomainModule, id: UUID): Promise<Nullable<T>>;

  create<T extends IEntity = IEntity>(
    domain: Domain,
    module: DomainModule,
    data: InsertData<T>,
  ): Promise<Nullable<T & IModuleLink>>;

  delete<T extends IEntity = IEntity, U extends object = object>(
    domain: Domain,
    module: DomainModule,
    id: UUID,
    data?: U,
  ): Promise<Nullable<T & IModuleLink>>;

  view<U extends object>(domain: Domain, module: DomainModule, id: UUID, data?: U): Promise<Nullable<IModuleLink>>;
}

export interface Module<T extends IEntity = IEntity> extends ModuleExternal {
  <G extends T>(domain: Domain, module: DomainModule): ModuleEntity<G>;
}
