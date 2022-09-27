import {
  EntityFormDataContextDTO,
  EntityFormTemplate,
  FormData,
  FormDataDoc,
  FormManipulator,
  FormOutputBinding,
  FormOutputBindings,
  IModuleLink,
  MODULES,
} from 'bf-types';
import handlebars from '@timwoods/handlebars';
import deepmerge from 'deepmerge';
import isEqual from 'lodash.isequal';
import { v4 } from 'uuid';
import { getManipulatedValue } from './FormOutputManipulator';

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

export type Changes = {
  module: IModuleLink | { module_name: MODULES; module_id: 'create' };
  changes: Record<string, any>;
  create?: boolean;
};

export type ArrayModulePropertyStrategy = {
  stratergy: 'UPDATE' | 'UPSERT' | 'REPLACE';
  postKey: string;
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

export const resolveUnmanipulatedOutputValue = (
  binding: FormOutputBinding,
  fullContext: EntityFormDataContextDTO & FormDataDoc,
): {
  source: 'value' | 'default';
  value: any;
  manipulators?: FormManipulator[];
} => {
  switch (binding.type) {
    case 'CONTEXT':
      const value = deepResolve(`${binding.value.data_source}.${binding.value.data_key}`, fullContext);
      if (value || !binding.default) {
        return { value, source: 'value', manipulators: binding.value.manipulators };
      }
      const defaultValue = deepResolve(`${binding.default.data_source}.${binding.default.data_key}`, fullContext);
      return { value: defaultValue, source: 'default', manipulators: binding.default.manipulators };

    case 'CONTEXT_TEMPLATE': {
      const value = handlebars.compile(binding.value)(fullContext);
      return { value, source: 'value' };
    }
    case 'VALUE':
      return { value: binding.value, source: 'value' };
  }
};

export const resolveOutputBindingValue = (
  binding: FormOutputBinding,
  fullContext: EntityFormDataContextDTO & FormDataDoc,
): any => {
  return getManipulatedValue(binding, fullContext);
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

export function resolveBracketStatergy(postKey: string): ArrayModulePropertyStrategy {
  const regex = /^(.*)?\[(.*)\]/gi;
  const [stg, key] = [postKey.replace(regex, '$1'), postKey.replace(regex, '$2')];
  const validStratergySymbols = ['_', '+', '~'] as const;

  const stratergyValue: ArrayModulePropertyStrategy = {
    stratergy: key.length === 0 ? 'REPLACE' : 'UPDATE',
    postKey: key,
  };

  if (!postKey.startsWith('[') && validStratergySymbols.includes(stg as any) && key.length !== 0) {
    const stratergySymbol = postKey.charAt(0) as typeof validStratergySymbols[number];
    stratergyValue.postKey = postKey.substring(1).replace(/[\[\]]/g, '');

    switch (stratergySymbol) {
      case '+':
        stratergyValue.stratergy = 'UPSERT';
        break;
      case '_':
        stratergyValue.stratergy = 'UPDATE';
        break;
      case '~':
        stratergyValue.stratergy = 'REPLACE';
        break;
    }
  }

  return stratergyValue;
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
  const { postKey, stratergy } = resolveBracketStatergy(keys[keys.length - 1]);
  const matchers = postKey.split(';').map((subMatcher) => subMatcher.split(':'));

  let contextValues = (deepResolve(`${target}.${preKey}`, fullContext) as any[]) || [];
  bindingValues = Array.isArray(bindingValues) ? bindingValues : [bindingValues];

  if (!Array.isArray(contextValues)) {
    contextValues = [];
  }

  const resolveValue = (changeActionSymbol: '_' | '+' | '-', value: unknown, mergeValue: unknown = {}) => {
    const key = (['REPLACE', 'UPSERT'].includes(stratergy) && !postKey ? [['id']] : matchers)
      .map((matcher) => {
        if (matcher.length === 1) {
          const resolvedContextValue = deepResolve(matcher[0], value as any) || v4();

          return [
            ...matcher,
            typeof resolvedContextValue === 'object' && !Array.isArray(resolvedContextValue)
              ? JSON.stringify(resolvedContextValue)
              : resolvedContextValue,
          ].join(':');
        }

        return matcher.join(':');
      })
      .join(';');

    return {
      [`${preKey}.${changeActionSymbol}[${key}]`]: deepmerge(mergeValue as any, value as any, {
        arrayMerge: combineMerge,
      }),
    };
  };

  const isFoundHistoryHistory: boolean[][] = [];

  const _changeActions = bindingValues.flatMap((bindingValue) => {
    const changeActions: Array<{
      [x: string]: unknown;
    }> = [];
    const isFoundHistory = [];

    for (const contextValue of contextValues) {
      const isFound = matchers.reduce<boolean>(
        (pv, cv) => {
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
        },
        !postKey && stratergy === 'REPLACE' ? false : true,
      );

      isFoundHistory.push(isFound);

      if (stratergy === 'UPDATE' && isFound) {
        changeActions.push(resolveValue('_', bindingValue, contextValue));
      } else if (stratergy === 'UPSERT') {
        // Update by merging
        if (isFound) {
          changeActions.push(resolveValue('_', bindingValue, contextValue));
        }
      } else if (stratergy === 'REPLACE') {
        // Update by replacing and all timwood module properties have ids
        if (isFound) {
          changeActions.push(resolveValue('_', bindingValue, { id: contextValue.id }));
        }
      }
    }

    const isSomeFound = isFoundHistory.some((isFound) => isFound);
    isFoundHistoryHistory.push(isFoundHistory);
    if (['REPLACE', 'UPSERT'].includes(stratergy) && !isSomeFound) {
      // Insert if atleast a single value didn't match
      changeActions.push(resolveValue('+', bindingValue));
    }

    return changeActions;
  });

  // Remove all old items that didn't match any binding value
  if (stratergy === 'REPLACE') {
    for (let i = 0; i < contextValues.length; i++) {
      const isSomeFoundHorizontally = isFoundHistoryHistory.some((isFoundHistory) => isFoundHistory[i]);
      if (!isSomeFoundHorizontally) {
        _changeActions.push(resolveValue('-', contextValues[i]));
      }
    }
  }

  return _changeActions;
}

export const formTemplateToChanges = (
  form_data: FormData,
  context: EntityFormDataContextDTO,
  formTemplate: Partial<EntityFormTemplate> & Pick<EntityFormTemplate, 'form_output_bindings' | 'linked_module_name'>,
  create?: boolean,
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
    create,
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

    if (/.*\[.*\]$/.test(option) || Array.isArray(value)) {
      const bracketSyntaxChanges = resolveBracketSyntax(
        target,
        [...keys, ...(/.*\[.*\]$/.test(option) ? [] : ['~[]'])],
        value,
        fullContext,
      );

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
