import { ALL_MODULES, Domain, DomainModule, DOMAINS, DOMAIN_MODULES } from 'bf-types';
import { Nullable } from './types';
import { toDisplay, toLowerCamel } from './utils';

const domainUriMap: Map<Domain, string> = new Map();
const moduleUriMap: Map<DomainModule, string> = new Map();

for (const domain of Object.values(DOMAINS)) {
  domainUriMap.set(domain, toLowerCamel(domain));
}

for (const module of Object.values(ALL_MODULES)) {
  moduleUriMap.set(module, toLowerCamel(module));
}

const moduleToDomainMap: Map<DomainModule, Domain> = new Map();

for (const domainName of Object.keys(DOMAIN_MODULES)) {
  for (const moduleName of Object.keys(DOMAIN_MODULES[domainName as keyof typeof DOMAIN_MODULES])) {
    moduleToDomainMap.set(moduleName as DomainModule, domainName as Domain);
  }
}

/**
 * Convert a block-5 domain name into a URI formatted string
 *
 * @param domainName The name of a block-5 domain
 */
export function domainToUri(domainName: Domain): string {
  const uri = domainUriMap.get(domainName);
  if (!uri) {
    throw new Error(`there is no URI for the ${domainName} domain`);
  }
  return uri;
}

/**
 * Convert a block-5 module name into a URI formatted string
 *
 * @param moduleName The name of a block-5 module
 */
export function moduleToUri(moduleName: DomainModule): string {
  const uri = moduleUriMap.get(moduleName);
  if (!uri) {
    throw new Error(`there is no URI for the ${moduleName} module`);
  }
  return uri;
}

/**
 * Get the domain name associated with a particular module name
 *
 * @param moduleName The name of a block-5 module
 */
export function getModuleDomain(moduleName: DomainModule): Nullable<Domain> {
  return moduleToDomainMap.get(moduleName) || null;
}

/**
 * Get the base URI associated with a particular block-5 module name
 *
 * @param moduleName The name of a block-5 module
 */
export function getModuleBaseUri(moduleName: string, uri?: string): string {
  const domainName = getModuleDomain(moduleName as DomainModule) as Domain;
  return `${domainToUri(domainName)}/${moduleToUri(moduleName as DomainModule)}${uri ? `/${uri}` : ''}`;
}

/**
 * Ensure that both a domain name and module name are valid
 *
 * @param domainName The name of a block-5 domain
 * @param moduleName The name of a block-5 module
 */
export function validateDomainAndModule(domainName: Domain, moduleName: DomainModule): void {
  if (!DOMAINS[domainName]) {
    throw new Error(`${domainName} is not a valid entity domain`);
  }

  if (!ALL_MODULES[moduleName]) {
    throw new Error(`${moduleName} is not a valid entity module`);
  }

  const domainModules: Record<string, string> = DOMAIN_MODULES[domainName];
  if (typeof domainModules[moduleName] !== 'string') {
    throw new Error(`${module} is not a module of the ${toDisplay(domainName)}`);
  }
}
