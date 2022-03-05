import {
  EntityFormDataContextDTO,
  EntityFormTemplate,
  FormData,
  FormDataDoc,
  FormOutputBinding,
  FormOutputBindings,
  IModuleLink,
  MODULES,
} from 'bf-types';
import handlebars from '@timwoods/handlebars';
import deepmerge from 'deepmerge';
import isEqual from 'lodash.isequal';

export const deepResolve = (fullkey: string, object: Record<string, any>): any => {
  const keys = fullkey.split('.');
  let current: any = { ...object };

  for (const key of keys) {
    if (typeof current === 'object' && current) {
      current = current[key];
    }
  }

  return current;
};

type Changes = {
  module: IModuleLink | { module_name: MODULES; module_id: 'create' };
  changes: Record<string, any>;
};

function combineMerge(target: any[], source: any[], options: any) {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
}

export const resolveOutputBindingValue = (
  binding: FormOutputBinding,
  fullContext: EntityFormDataContextDTO & FormDataDoc,
): any => {
  switch (binding.type) {
    case 'CONTEXT':
      return deepResolve(`${binding.value.data_source}.${binding.value.data_key}`, fullContext);
    case 'CONTEXT_TEMPLATE':
      return handlebars.compile(binding.value)(fullContext);
    case 'VALUE':
      return binding.value;
  }
};

export const convertFormTemplateBindingFromDb = (formTemplate: FormOutputBindings): FormOutputBindings => {
  const clean: FormOutputBindings = {};
  for (const key of Object.keys(formTemplate)) {
    clean[key.replace(/,/g, '.')] = formTemplate[key];
  }
  return clean;
};

export const convertToTemplateBidningFromDb = (formTemplate: FormOutputBindings): FormOutputBindings => {
  const clean: FormOutputBindings = {};
  for (const key of Object.keys(formTemplate)) {
    clean[key.replace(/\./g, ',')] = formTemplate[key];
  }
  return clean;
};

export function castValueFromContext(contextKeyValue: any, matchValue: any): string | number | boolean {
  switch (typeof contextKeyValue) {
    case 'number':
      return parseInt(matchValue, 10);
    case 'boolean': {
      if (matchValue === 'true') {
        return true;
      } else if (matchValue === 'false') {
        return false;
      }
    }
    default:
      return matchValue;
  }
}

export function resolveBracketSyntax(
  target: string | undefined,
  keys: string[],
  bindingValues: any[],
  fullContext: EntityFormDataContextDTO & FormDataDoc,
): Array<{
  [x: string]: any;
}> {
  const preKey = keys.slice(0, -1).join('.');
  const postKey = keys[keys.length - 1].replace(/[\[\]]/g, '');
  const matchers = postKey.split(';').map((subMatcher) => subMatcher.split(':'));

  let contextValues = (deepResolve(`${target}.${preKey}`, fullContext) as any[]) || [];
  bindingValues = Array.isArray(bindingValues) ? bindingValues : [];

  if (!Array.isArray(contextValues)) {
    contextValues = [];
  }

  return bindingValues.flatMap((bindingValue) => {
    return contextValues
      .filter((contextValue) =>
        matchers.reduce<boolean>((pv, cv) => {
          if (cv.length === 1) {
            const key = cv[0];
            const resolvedBindingValue = deepResolve(key, bindingValue);
            const resolvedContextValue = deepResolve(key, contextValue);

            return pv && isEqual(resolvedBindingValue, resolvedContextValue);
          } else if (cv.length === 2) {
            const contextKeyValue = deepResolve(cv[0], contextValue);
            return pv && isEqual(contextKeyValue, castValueFromContext(contextKeyValue, cv[1]));
          }

          return pv && false;
        }, true),
      )
      .map((filterValue) => {
        const key = matchers
          .map((matcher) => {
            if (matcher.length === 1) {
              const resolvedFilterValue = deepResolve(matcher[0], filterValue);
              return [
                ...matcher,
                typeof resolvedFilterValue === 'object' ? JSON.stringify(resolvedFilterValue) : resolvedFilterValue,
              ].join(':');
            }

            return matcher.join(':');
          })
          .join(';');

        return {
          [`${preKey}.[${key}]`]: deepmerge(filterValue, bindingValue, {
            arrayMerge: combineMerge,
          }),
        };
      });
  });
}

export const formTemplateToChanges = (
  form_data: FormData,
  context: EntityFormDataContextDTO,
  formTemplate: Partial<EntityFormTemplate> & Pick<EntityFormTemplate, 'form_output_bindings' | 'linked_module_name'>,
): Changes[] => {
  const fullContext = { ...context, form_data };
  const changes: Changes[] = [];
  const form_output_bindings = convertFormTemplateBindingFromDb(formTemplate.form_output_bindings);
  const entity: Changes = {
    module: {
      module_name: context.entity?.module_name || formTemplate.linked_module_name,
      module_id: context.entity?.id || 'create',
    },
    changes: {},
  };
  const creator: Changes = {
    module: {
      module_name: context.creator.module_name,
      module_id: context.creator.id,
    },
    changes: {},
  };
  const actor: Changes = {
    module: {
      module_name: context.actor.module_name,
      module_id: context.actor.id,
    },
    changes: {},
  };

  function updateChanges(target: string | undefined, subkey: string, value: any) {
    switch (target) {
      case 'creator':
        creator.changes[subkey] = value;
        break;
      case 'entity':
        entity.changes[subkey] = value;
        break;
      case 'actor':
        actor.changes[subkey] = value;
        break;
    }
  }

  for (let option of Object.keys(form_output_bindings)) {
    option = option.trim();
    const binding = form_output_bindings[option];
    const value = resolveOutputBindingValue(binding, fullContext);
    const keys = option.split(/\.(?![^[]*])/gi);
    const target = keys.shift();
    const subkey = keys.join('.');

    if (/.*\[.+\]$/.test(option)) {
      const bracketSyntaxChanges = resolveBracketSyntax(target, keys, value, fullContext);

      for (const change of bracketSyntaxChanges) {
        for (const [key, value] of Object.entries(change)) {
          updateChanges(target, key, value);
        }
      }
    } else {
      updateChanges(target, subkey, value);
    }
  }

  changes.push(entity);
  if (Object.keys(actor.changes).length !== 0) {
    changes.push(actor);
  }
  if (Object.keys(creator.changes).length !== 0) {
    changes.push(creator);
  }
  return changes;
};
