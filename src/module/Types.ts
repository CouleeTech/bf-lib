import {
  Domain,
  DomainModule,
  ICustomAttribute,
  ICustomAttributeAddedDTO,
  ICustomAttributeRemovedDTO,
  ICustomAttributeUpdatedDTO,
  IEntity,
  IModuleLink,
  ISearchFilter,
  ISODATE,
  ModuleProperty,
  UUID,
} from 'bf-types';
import { SearchOptions } from '../api/Types';
import { Nullable, PartialExceptFor } from '../common';

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

export interface ExternalModuleEntity<T extends IEntity = IEntity> {
  get(id: UUID): Promise<Nullable<T>>;
  create(data: InsertData<T>): Promise<Nullable<T>>;
  update(data: PartialExceptFor<T, 'id'>): Promise<Nullable<T>>;
  search(filters: ISearchFilter[], options?: SearchOptions): Promise<T[]>;
  addCustomAttribute<A>(
    moduleId: UUID,
    attribute: Omit<ICustomAttribute<A>, 'id'>,
  ): Promise<Nullable<ICustomAttributeAddedDTO>>;
  removeCustomAttribute(moduleId: UUID, attributeId: UUID): Promise<Nullable<ICustomAttributeRemovedDTO>>;
  updateCustomAttribute<A>(
    moduleId: UUID,
    attribute: PartialExceptFor<ICustomAttribute<A>, 'id'>,
  ): Promise<Nullable<ICustomAttributeUpdatedDTO>>;
}

export interface ModuleInternal {
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

  /**
   * Create an object with access to external module APIs
   *
   * @param moduleName The name of the external module formatted in UPPER_SNAKE_CASE
   */
  external<T extends IEntity = any>(moduleName: string): ExternalModuleEntity<T>;
}

export interface Module<T extends IEntity = IEntity> extends ModuleInternal {
  <G extends T>(domain: Domain, module: DomainModule): ModuleEntity<G>;
}
