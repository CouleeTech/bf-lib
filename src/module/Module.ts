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
  ISearchFilter,
  IUpdateCustomAttributeDTO,
  UUID,
} from 'bf-types';
import { Api } from '../api';
import { SearchOptions } from '../api/Types';
import { domainToUri, moduleToUri, Nullable, PartialExceptFor, toLowerCamel, validateDomainAndModule } from '../common';
import System, { LibModule, ObjectType } from '../system';
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

function baseGet<T extends IEntity>(api: Api, domain: Domain, module: DomainModule, id: UUID): Promise<Nullable<T>> {
  const uri = entityUri(domain, module, id);
  return api.get<T>(uri);
}

function baseCreate<T extends IEntity>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  data: InsertData<T>,
): Promise<Nullable<T & IModuleLink>> {
  const uri = entityUri(domain, module, 'create');
  return api.post<T & IModuleLink>(uri, data);
}

function baseDelete<T extends IEntity, U extends ObjectType>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  id: UUID,
  data?: U,
): Promise<Nullable<T & IModuleLink>> {
  const uri = entityUri(domain, module, 'delete');
  return api.post<T & IModuleLink>(uri, { ...data, id });
}

function baseView<U extends ObjectType>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  id: UUID,
  data?: U,
): Promise<Nullable<IModuleLink>> {
  const uri = entityUri(domain, module, 'view');
  return api.post<IModuleLink>(uri, { ...data, id });
}

function entity<T extends IEntity = any>(domain: Domain, module: DomainModule): ModuleEntity<T> {
  const entityDomain = domain;
  const entityModule = module;
  validateDomainAndModule(entityDomain, entityModule);

  const api = System.getLibModule<Api>(LibModule.API);

  function get(id: UUID): Promise<Nullable<T>> {
    return baseGet<T>(api, entityDomain, entityModule, id);
  }

  function create(data: InsertData<T>): Promise<Nullable<T & IModuleLink>> {
    return baseCreate<T>(api, entityDomain, entityModule, data);
  }

  function del<U extends ObjectType>(id: UUID, data?: U): Promise<Nullable<T & IModuleLink>> {
    return baseDelete<T, U>(api, entityDomain, entityModule, id, data);
  }

  function view<U extends ObjectType>(id: UUID, data?: U): Promise<Nullable<IModuleLink>> {
    return baseView<U>(api, entityDomain, entityModule, id, data);
  }

  return Object.freeze({
    get,
    create,
    delete: del,
    view,
  });
}

const addCustomAttributeUri = 'core/entity/external/customAttribute/add';
const removeCustomAttributeUri = 'core/entity/external/customAttribute/remove';
const updateCustomAttributeUri = 'core/entity/external/customAttribute/modify';

function external<T extends IEntity = any>(moduleName: string): ExternalModuleEntity<T> {
  const api = System.getLibModule<Api>(LibModule.API);
  const createUri = externalEntityUri(moduleName, 'create');
  const updateUri = externalEntityUri(moduleName, 'update');
  const searchUri = 'search';

  function get(id: UUID): Promise<Nullable<T>> {
    const uri = externalEntityUri(moduleName, id);
    return api.get<T>(uri);
  }

  function create(data: InsertData<T>): Promise<Nullable<T>> {
    return api.post<T>(createUri, data);
  }

  function update(data: PartialExceptFor<T, 'id'>): Promise<Nullable<T>> {
    return api.post<T>(updateUri, data);
  }

  async function search(filters: ISearchFilter[], options?: SearchOptions): Promise<T[]> {
    const response = await api.put<T[]>(searchUri, { ...options, filters, module_name: moduleName });
    return response ? response : [];
  }

  function addCustomAttribute<A>(
    moduleId: UUID,
    attribute: Omit<ICustomAttribute<A>, 'id'>,
  ): Promise<Nullable<ICustomAttributeAddedDTO>> {
    const payload: IAddCustomAttributeDTO = {
      module: { module_name: moduleName, module_id: moduleId },
      custom_attribute: attribute,
    };
    return api.post(addCustomAttributeUri, payload);
  }

  function removeCustomAttribute(moduleId: UUID, attributeId: UUID): Promise<Nullable<ICustomAttributeRemovedDTO>> {
    const payload: IRemoveCustomAttributeDTO = {
      module: { module_name: moduleName, module_id: moduleId },
      custom_attribute_id: attributeId,
    };
    return api.post(removeCustomAttributeUri, payload);
  }

  function updateCustomAttribute<A>(
    moduleId: UUID,
    attribute: PartialExceptFor<ICustomAttribute<A>, 'id'>,
  ): Promise<Nullable<ICustomAttributeUpdatedDTO>> {
    const payload: IUpdateCustomAttributeDTO = {
      module: { module_name: moduleName, module_id: moduleId },
      custom_attribute: attribute,
    };
    return api.post(updateCustomAttributeUri, payload);
  }

  return Object.freeze({
    get,
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
