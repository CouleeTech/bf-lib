import {
  Domain,
  DomainModule,
  IAddCustomAttributeDTO,
  ICustomAttribute,
  ICustomAttributeAddedDTO,
  ICustomAttributeRemovedDTO,
  ICustomAttributeUpdatedDTO,
  IEntity,
  IModuleLink,
  IRemoveCustomAttributeDTO,
  IUpdateCustomAttributeDTO,
  SearchFilter,
  UUID,
} from 'bf-types';
import { Api } from '../api';
import type { SearchOptions } from '../api/Types';
import { domainToUri, moduleToUri, Nullable, PartialExceptFor, toLowerCamel, validateDomainAndModule } from '../common';
import System, { HeadersType, LibModule, ObjectType } from '../system';
import { makeCallable } from '../system/Utils';
import { ExternalModuleEntity, InsertData, Module, ModuleEntity } from './Types';

function entityUri(domain: Domain, module: DomainModule, text?: string) {
  const domainUri = domainToUri(domain);
  const moduleUri = moduleToUri(module);

  if (text) {
    return `${domainUri}/${moduleUri}/entity/${text}`;
  }
  return `${domainUri}/${moduleUri}/entity`;
}

function externalEntityUri(moduleName: string, text?: string) {
  const moduleNameUri = toLowerCamel(moduleName);
  if (text) {
    return `core/entity/external/${moduleNameUri}/${text}`;
  }
  return `core/entity/external/${moduleNameUri}`;
}

function baseGet<T extends IEntity, H extends HeadersType = HeadersType>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  id: UUID,
  headers?: H,
): Promise<Nullable<T>> {
  const uri = entityUri(domain, module, id);
  return api.get<T, undefined, H>(uri, undefined, headers);
}

async function baseBulkCreate<T extends IEntity, H extends HeadersType = HeadersType>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  data: Array<InsertData<T>>,
  headers?: H,
): Promise<Array<T & IModuleLink>> {
  const bulkCreateUri = entityUri(domain, module, 'bulkCreate');
  const response = await api.post<Array<T & IModuleLink>, Array<InsertData<T>>, H>(bulkCreateUri, data, headers);
  return response ? response : [];
}

function baseCreate<T extends IEntity, H extends HeadersType = HeadersType>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  data: InsertData<T>,
  headers?: H,
): Promise<Nullable<T & IModuleLink>> {
  const uri = entityUri(domain, module, 'create');
  return api.post<T & IModuleLink, InsertData<T>, H>(uri, data, headers);
}

function baseDelete<T extends IEntity, U extends ObjectType, H extends HeadersType = HeadersType>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  id: UUID,
  data?: U,
  headers?: H,
): Promise<Nullable<T & IModuleLink>> {
  const uri = entityUri(domain, module, 'delete');
  return api.post<T & IModuleLink>(uri, { ...data, id }, headers);
}

function baseSearch<T extends IEntity, H extends HeadersType = HeadersType>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  filters: SearchFilter[],
  options?: SearchOptions<H>,
): Promise<T[]> {
  return api.search<T, H>(domain, module, filters, options);
}

function baseView<U extends ObjectType, H extends HeadersType = HeadersType>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  id: UUID,
  data?: U,
  headers?: H,
): Promise<Nullable<IModuleLink>> {
  const uri = entityUri(domain, module, 'view');
  return api.post<IModuleLink>(uri, { ...data, id }, headers);
}

function entity<T extends IEntity = any>(domain: Domain, module: DomainModule): ModuleEntity<T> {
  const entityDomain = domain;
  const entityModule = module;
  validateDomainAndModule(entityDomain, entityModule);

  const api = System.getLibModule<Api>(LibModule.API);

  function get<H extends HeadersType = HeadersType>(id: UUID, headers?: H): Promise<Nullable<T>> {
    return baseGet<T, H>(api, entityDomain, entityModule, id, headers);
  }

  function bulkCreate<H extends HeadersType = HeadersType>(
    data: Array<InsertData<T>>,
    headers?: H,
  ): Promise<Array<T & IModuleLink>> {
    return baseBulkCreate<T, H>(api, entityDomain, entityModule, data, headers);
  }

  function create<H extends HeadersType = HeadersType>(
    data: InsertData<T>,
    headers?: H,
  ): Promise<Nullable<T & IModuleLink>> {
    return baseCreate<T, H>(api, entityDomain, entityModule, data, headers);
  }

  function del<U extends ObjectType, H extends HeadersType = HeadersType>(
    id: UUID,
    data?: U,
    headers?: H,
  ): Promise<Nullable<T & IModuleLink>> {
    return baseDelete<T, U>(api, entityDomain, entityModule, id, data, headers);
  }

  function search<H extends HeadersType = HeadersType>(
    filters: SearchFilter[],
    options?: SearchOptions<H>,
  ): Promise<T[]> {
    return baseSearch<T, H>(api, entityDomain, entityModule, filters, options);
  }

  function view<U extends ObjectType, H extends HeadersType = HeadersType>(
    id: UUID,
    data?: U,
    headers?: H,
  ): Promise<Nullable<IModuleLink>> {
    return baseView<U, H>(api, entityDomain, entityModule, id, data, headers);
  }

  return Object.freeze({
    get,
    bulkCreate,
    create,
    delete: del,
    search,
    view,
  });
}

const addCustomAttributeUri = 'core/entity/external/customAttribute/add';
const removeCustomAttributeUri = 'core/entity/external/customAttribute/remove';
const updateCustomAttributeUri = 'core/entity/external/customAttribute/modify';

function external<T extends IEntity = any>(moduleName: string): ExternalModuleEntity<T> {
  const api = System.getLibModule<Api>(LibModule.API);
  const bulkCreateUri = externalEntityUri(moduleName, 'bulkCreate');
  const createUri = externalEntityUri(moduleName, 'create');
  const updateUri = externalEntityUri(moduleName, 'update');
  const searchUri = 'search';

  function get<H extends HeadersType = HeadersType>(id: UUID, headers?: H): Promise<Nullable<T>> {
    const uri = externalEntityUri(moduleName, id);
    return api.get<T>(uri, undefined, headers);
  }

  async function bulkCreate<H extends HeadersType = HeadersType>(
    data: Array<InsertData<T>>,
    headers?: H,
  ): Promise<T[]> {
    const response = await api.post<T[]>(bulkCreateUri, data, headers);
    return response ? response : [];
  }

  function create<H extends HeadersType = HeadersType>(data: InsertData<T>, headers?: H): Promise<Nullable<T>> {
    return api.post<T>(createUri, data, headers);
  }

  function update<H extends HeadersType = HeadersType>(
    data: PartialExceptFor<T, 'id'>,
    headers?: H,
  ): Promise<Nullable<T>> {
    return api.post<T>(updateUri, data, headers);
  }

  async function search<H extends HeadersType = HeadersType>(
    filters: SearchFilter[],
    options?: SearchOptions<H>,
  ): Promise<T[]> {
    const response = await api.put<T[]>(searchUri, { ...options, filters, module_name: moduleName });
    return response ? response : [];
  }

  function addCustomAttribute<H extends HeadersType = HeadersType>(
    moduleId: UUID,
    attribute: Omit<ICustomAttribute, 'id'>,
    headers?: H,
  ): Promise<Nullable<ICustomAttributeAddedDTO>> {
    const payload: IAddCustomAttributeDTO = {
      module: { module_name: moduleName, module_id: moduleId },
      custom_attribute: attribute,
    };
    return api.post(addCustomAttributeUri, payload, headers);
  }

  function removeCustomAttribute<H extends HeadersType = HeadersType>(
    moduleId: UUID,
    attributeId: UUID,
    headers?: H,
  ): Promise<Nullable<ICustomAttributeRemovedDTO>> {
    const payload: IRemoveCustomAttributeDTO = {
      module: { module_name: moduleName, module_id: moduleId },
      custom_attribute_id: attributeId,
    };
    return api.post(removeCustomAttributeUri, payload, headers);
  }

  function updateCustomAttribute<H extends HeadersType = HeadersType>(
    moduleId: UUID,
    attribute: PartialExceptFor<ICustomAttribute, 'id'>,
    headers?: H,
  ): Promise<Nullable<ICustomAttributeUpdatedDTO>> {
    const payload: IUpdateCustomAttributeDTO = {
      module: { module_name: moduleName, module_id: moduleId },
      custom_attribute: attribute,
    };
    return api.post(updateCustomAttributeUri, payload, headers);
  }

  return Object.freeze({
    get,
    bulkCreate,
    create,
    update,
    search,
    addCustomAttribute,
    removeCustomAttribute,
    updateCustomAttribute,
  });
}

function internalGet<T extends IEntity = IEntity>(
  domain: Domain,
  module: DomainModule,
  id: UUID,
): Promise<Nullable<T>> {
  validateDomainAndModule(domain, module);
  return baseGet<T>(System.getLibModule<Api>(LibModule.API), domain, module, id);
}

function internalCreate<T extends IEntity = IEntity>(
  domain: Domain,
  module: DomainModule,
  data: InsertData<T>,
): Promise<Nullable<T & IModuleLink>> {
  validateDomainAndModule(domain, module);
  return baseCreate<T>(System.getLibModule<Api>(LibModule.API), domain, module, data);
}

function internalDelete<T extends IEntity = IEntity, U extends ObjectType = ObjectType>(
  domain: Domain,
  module: DomainModule,
  id: UUID,
  data?: U,
): Promise<Nullable<T & IModuleLink>> {
  validateDomainAndModule(domain, module);
  return baseDelete<T, U>(System.getLibModule<Api>(LibModule.API), domain, module, id, data);
}

function internalView<U extends ObjectType>(
  domain: Domain,
  module: DomainModule,
  id: UUID,
  data?: U,
): Promise<Nullable<IModuleLink>> {
  validateDomainAndModule(domain, module);
  return baseView<U>(System.getLibModule<Api>(LibModule.API), domain, module, id, data);
}

const moduleInstance: Module = Object.freeze(
  makeCallable(entity, {
    get: internalGet,
    create: internalCreate,
    delete: internalDelete,
    view: internalView,
    external,
  }),
);

export default System.sealModule(moduleInstance);
