import {
  Domain,
  DomainModule,
  ICustomAttribute,
  ICustomAttributeAddedDTO,
  ICustomAttributeRemovedDTO,
  ICustomAttributeUpdatedDTO,
  IEntity,
  IModuleLink,
  ISODATE,
  ModuleProperty,
  SearchFilter,
  UUID,
} from 'bf-types';
import { SearchOptions } from '../api/Types';
import { Nullable, PartialExceptFor } from '../common';
import type { HeadersType, ObjectType } from '../system/Types';

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
  get: <H extends HeadersType = HeadersType>(id: UUID, headers?: H) => Promise<Nullable<T>>;
  bulkCreate: <H extends HeadersType = HeadersType>(
    data: Array<InsertData<T>>,
    headers?: H,
  ) => Promise<Array<T & IModuleLink>>;
  create: <H extends HeadersType = HeadersType>(data: InsertData<T>, headers?: H) => Promise<Nullable<T & IModuleLink>>;
  delete: <U extends ObjectType, H extends HeadersType = HeadersType>(
    id: UUID,
    data?: U,
    headers?: H,
  ) => Promise<Nullable<T & IModuleLink>>;
  search: <H extends HeadersType = HeadersType>(filters: SearchFilter[], options?: SearchOptions<H>) => Promise<T[]>;
  view: <U extends ObjectType, H extends HeadersType = HeadersType>(
    id: UUID,
    data?: U,
    headers?: H,
  ) => Promise<Nullable<IModuleLink>>;
}

export interface ExternalModuleEntity<T extends IEntity = IEntity> {
  get: <H extends HeadersType = HeadersType>(id: UUID, headers?: H) => Promise<Nullable<T>>;
  create: <H extends HeadersType = HeadersType>(data: InsertData<T>, headers?: H) => Promise<Nullable<T>>;
  update: <H extends HeadersType = HeadersType>(data: PartialExceptFor<T, 'id'>, headers?: H) => Promise<Nullable<T>>;
  search: <H extends HeadersType = HeadersType>(filters: SearchFilter[], options?: SearchOptions<H>) => Promise<T[]>;
  addCustomAttribute: <H extends HeadersType = HeadersType>(
    moduleId: UUID,
    attribute: Omit<ICustomAttribute, 'id'>,
    headers?: H,
  ) => Promise<Nullable<ICustomAttributeAddedDTO>>;
  removeCustomAttribute: <H extends HeadersType = HeadersType>(
    moduleId: UUID,
    attributeId: UUID,
    headers?: H,
  ) => Promise<Nullable<ICustomAttributeRemovedDTO>>;
  updateCustomAttribute: <H extends HeadersType = HeadersType>(
    moduleId: UUID,
    attribute: PartialExceptFor<ICustomAttribute, 'id'>,
    headers?: H,
  ) => Promise<Nullable<ICustomAttributeUpdatedDTO>>;
}

export interface ModuleInternal {
  get: <T extends IEntity = IEntity, H extends HeadersType = HeadersType>(
    domain: Domain,
    module: DomainModule,
    id: UUID,
    headers?: H,
  ) => Promise<Nullable<T>>;

  create: <T extends IEntity = IEntity, H extends HeadersType = HeadersType>(
    domain: Domain,
    module: DomainModule,
    data: InsertData<T>,
    headers?: H,
  ) => Promise<Nullable<T & IModuleLink>>;

  delete: <T extends IEntity = IEntity, U extends ObjectType = ObjectType, H extends HeadersType = HeadersType>(
    domain: Domain,
    module: DomainModule,
    id: UUID,
    data?: U,
    headers?: H,
  ) => Promise<Nullable<T & IModuleLink>>;

  view: <U extends ObjectType, H extends HeadersType = HeadersType>(
    domain: Domain,
    module: DomainModule,
    id: UUID,
    data?: U,
    headers?: H,
  ) => Promise<Nullable<IModuleLink>>;

  /**
   * Create an object with access to external module APIs
   *
   * @param moduleName The name of the external module formatted in UPPER_SNAKE_CASE
   */
  external: <T extends IEntity = any>(moduleName: string) => ExternalModuleEntity<T>;
}

export interface Module<T extends IEntity = IEntity> extends ModuleInternal {
  <G extends T>(domain: Domain, module: DomainModule): ModuleEntity<G>;
}
