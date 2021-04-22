import { ALL_MODULES, DomainModuleLink, IModuleAssociation, IModuleLink, IRelatedModule, UUID } from 'bf-types';
import { ValidModuleName } from '../types';
import { toUpperSnakeCase } from '../utils';

const EXTRA_MODULE_NAMES = Object.freeze(['PLACEHOLDER']);
const VALID_MODULE_NAMES = Object.freeze([...EXTRA_MODULE_NAMES, ...Object.values(ALL_MODULES)]);

/**
 * Create a new module link object
 *
 * This function provides type safety for the moduleName parameter. It ensures that
 * the module name is one the allowed module names. Because of that, it should be used whenever
 * a new module link is needed.
 *
 * @param moduleName The name of the module this link references
 * @param moduleId The ID of the Entity in the module this link references
 */
export function moduleLink(moduleName: ValidModuleName, moduleId: UUID): DomainModuleLink<ValidModuleName> {
  return {
    module_name: ensureValidModuleName(moduleName),
    module_id: moduleId,
  };
}

/**
 * Create a new module association object
 *
 * This function provides type safety for the moduleName parameter. Because of that, it should
 * be used whenever a new module association is needed.
 *
 * @param moduleName The name of the module this association references
 * @param moduleId The ID of the Entity in the module this association references
 * @param id An optional ID to specify for this module association
 */
export function moduleAssociation(moduleName: ValidModuleName, moduleId: UUID, id: UUID = ''): IModuleAssociation {
  return {
    id,
    module_name: ensureValidModuleName(moduleName),
    module_id: moduleId,
  };
}

/**
 * Create a new related module object
 *
 * This function provides type safety for the moduleName parameter. Because of that, it should
 * be used whenever a new related module is needed.
 *
 * @param moduleName The name of the module this related module object references
 * @param moduleId The ID of the Entity in the module this module object references
 * @param moduleTitle The title of the Entity in the module this module object references
 */
export function relatedModule(moduleName: ValidModuleName, moduleId: UUID, moduleTitle: string): IRelatedModule {
  return {
    module_name: ensureValidModuleName(moduleName),
    module_id: moduleId,
    module_title: moduleTitle,
  };
}

/**
 * Creates a new module link with an empty string for each field
 */
export function emptyModuleLink(): IModuleLink {
  return { module_name: '', module_id: '' };
}

/**
 * Creates a new module link that is meant to be used as a placeholder
 */
export function placeholderModuleLink(moduleId = ''): IModuleLink {
  return { module_name: 'PLACEHOLDER', module_id: moduleId };
}

/**
 * Creates a new related module with an empty string for each field
 */
export function emptyRelatedModule(): IRelatedModule {
  return { module_name: '', module_id: '', module_title: '' };
}

function ensureValidModuleName(moduleName: string): ValidModuleName {
  const sanitizedModuleName = toUpperSnakeCase<ValidModuleName>(moduleName);
  if (!VALID_MODULE_NAMES.includes(sanitizedModuleName)) {
    throw new Error(`${sanitizedModuleName} is not allowed to be used as a module name.`);
  }
  return sanitizedModuleName;
}
