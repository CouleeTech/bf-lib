import { Domain, DomainModule, IEntity, IModuleLink, UUID } from 'bf-types';
import { Api } from '../api';
import { domainToUri, moduleToUri, Nullable, validateDomainAndModule } from '../common';
import { makeCallable } from '../common/Utils';
import System, { LibModule } from '../system';
import { InsertData, Module, ModuleEntity } from './Types';

function entityUri(domain: Domain, module: DomainModule, text?: string) {
  const domainUri = domainToUri(domain);
  const moduleUri = moduleToUri(module);

  if (text) {
    return `${domainUri}/${moduleUri}/entity/${text}`;
  }
  return `${domainUri}/${moduleUri}/entity`;
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

function baseDelete<T extends IEntity, U extends object>(
  api: Api,
  domain: Domain,
  module: DomainModule,
  id: UUID,
  data?: U,
): Promise<Nullable<T & IModuleLink>> {
  const uri = entityUri(domain, module, 'delete');
  return api.post<T & IModuleLink>(uri, { ...data, id });
}

function baseView<U extends object>(
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

  function del<U extends object>(id: UUID, data?: U): Promise<Nullable<T & IModuleLink>> {
    return baseDelete<T, U>(api, entityDomain, entityModule, id, data);
  }

  function view<U extends object>(id: UUID, data?: U): Promise<Nullable<IModuleLink>> {
    return baseView<U>(api, entityDomain, entityModule, id, data);
  }

  return Object.freeze({
    get,
    create,
    delete: del,
    view,
  });
}

function externalGet<T extends IEntity = IEntity>(
  domain: Domain,
  module: DomainModule,
  id: UUID,
): Promise<Nullable<T>> {
  validateDomainAndModule(domain, module);
  return baseGet<T>(System.getLibModule<Api>(LibModule.API), domain, module, id);
}

function externalCreate<T extends IEntity = IEntity>(
  domain: Domain,
  module: DomainModule,
  data: InsertData<T>,
): Promise<Nullable<T & IModuleLink>> {
  validateDomainAndModule(domain, module);
  return baseCreate<T>(System.getLibModule<Api>(LibModule.API), domain, module, data);
}

function externalDelete<T extends IEntity = IEntity, U extends object = object>(
  domain: Domain,
  module: DomainModule,
  id: UUID,
  data?: U,
): Promise<Nullable<T & IModuleLink>> {
  validateDomainAndModule(domain, module);
  return baseDelete<T, U>(System.getLibModule<Api>(LibModule.API), domain, module, id, data);
}

function externalView<U extends object>(
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
    get: externalGet,
    create: externalCreate,
    delete: externalDelete,
    view: externalView,
  }),
);

export default System.sealModule(moduleInstance);
