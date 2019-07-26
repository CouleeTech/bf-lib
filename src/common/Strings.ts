import { ALL_MODULES, Domain, DomainModule, DOMAINS, DOMAIN_MODULES } from 'bf-types';
import { camelCase, capitalize, chain, decapitalize, snakeCase } from 'voca';

/* ~~~ General String Functions ~~~ */

export function formatFloat(value: number, decimalPlaces: number): string {
  return String(Number(Math.round(parseFloat(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces));
}

export function toDisplay(str: string): string {
  const split = str
    .replace(/_/g, ' ')
    .toLocaleLowerCase()
    .split(' ');

  const toUpper = split.map(s => toUpperFirstLetter(s));

  return toUpper.join(' ');
}

export function toLowerCamel<T extends string = string>(str: T): T {
  return (camelCase(str) as any) as T;
}

export function toUpperCamel<T extends string = string>(str: string): T {
  return (chain(str)
    .camelCase()
    .capitalize()
    .value() as any) as T;
}

export function toLowerFirstLetter<T extends string = string>(str: string): T {
  return (decapitalize(str) as any) as T;
}

export function toUpperFirstLetter<T extends string = string>(str: string): T {
  return (capitalize(str) as any) as T;
}

export function toLowerSnakeCase<T extends string = string>(str: string): T {
  return (snakeCase(str) as any) as T;
}

export function toUpperSnakeCase<T extends string = string>(str: string): T {
  return (chain(str)
    .snakeCase()
    .upperCase()
    .value() as any) as T;
}

/* ~~~ String Functions with Application Logic ~~~ */

const domainUriMap: Map<Domain, string> = new Map();
const moduleUriMap: Map<DomainModule, string> = new Map();

for (const domain of Object.values(DOMAINS)) {
  domainUriMap.set(domain, toLowerCamel(domain));
}

for (const module of Object.values(ALL_MODULES)) {
  moduleUriMap.set(module, toLowerCamel(module));
}

export function domainToUri(domain: Domain): string {
  const uri = domainUriMap.get(domain);
  if (!uri) {
    throw new Error(`There is no URI for the ${domain} domain.`);
  }
  return uri;
}

export function moduleToUri(module: DomainModule): string {
  const uri = moduleUriMap.get(module);
  if (!uri) {
    throw new Error(`There is no URI for the ${module} module.`);
  }
  return uri;
}

export function validateDomainAndModule(domain: Domain, module: DomainModule) {
  if (!DOMAINS[domain]) {
    throw new Error(`${domain} is not a valid Entity domain`);
  }

  if (!ALL_MODULES[module]) {
    throw new Error(`${module} is not a valid Entity module`);
  }

  const domainModules: Record<string, string> = DOMAIN_MODULES[domain];
  if (typeof domainModules[module] !== 'string') {
    throw new Error(`${module} is not a module of the ${toDisplay(domain)}`);
  }
}
