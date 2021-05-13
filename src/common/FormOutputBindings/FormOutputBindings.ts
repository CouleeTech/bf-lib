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

export const deepResolve = (fullkey: string, object: Record<string, any>) => {
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

export const resolveOutputBindingValue = (
  binding: FormOutputBinding,
  fullContext: EntityFormDataContextDTO & FormDataDoc,
) => {
  switch (binding.type) {
    case 'CONTEXT':
      return deepResolve(`${binding.value.data_source}.${binding.value.data_key}`, fullContext);
    case 'CONTEXT_TEMPLATE':
      return handlebars.compile(binding.value)(fullContext);
    case 'VALUE':
      return binding.value;
  }
};
export const convertFormTemplateBindingFromDb = (formTemplate: FormOutputBindings) => {
  const clean: FormOutputBindings = {};
  for (const key of Object.keys(formTemplate)) {
    clean[key.replace(/,/g, '.')] = formTemplate[key];
  }
  return clean;
};
export const convertToTemplateBidningFromDb = (formTemplate: FormOutputBindings) => {
  const clean: FormOutputBindings = {};
  for (const key of Object.keys(formTemplate)) {
    clean[key.replace(/\./g, ',')] = formTemplate[key];
  }
  return clean;
};

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
  for (const option of Object.keys(form_output_bindings)) {
    const binding = form_output_bindings[option];
    const value = resolveOutputBindingValue(binding, fullContext);
    const keys = option.split('.');
    const target = keys.shift();
    const subkey = keys.join('.');
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
  if (Object.keys(entity.changes).length !== 0) {
    changes.push(entity);
  }
  if (Object.keys(actor.changes).length !== 0) {
    changes.push(actor);
  }
  if (Object.keys(creator.changes).length !== 0) {
    changes.push(creator);
  }
  return changes;
};
