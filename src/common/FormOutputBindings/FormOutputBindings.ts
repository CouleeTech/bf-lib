import {
  EntityFormDataContextDTO,
  EntityFormTemplate,
  FormDataDoc,
  FormOutputBinding,
  IModuleLink,
  MODULES,
} from 'bf-types';

import handlebars from '@timwoods/handlebars';

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

    case 'CONTEXT_TEMPLATE':
      return handlebars.compile(binding.value)(fullContext);
    case 'VALUE':
      return binding.value;
  }
};

export const formTemplateToChanges = (
  form_data: FormData,
  context: EntityFormDataContextDTO,
  formTemplate: EntityFormTemplate,
): Changes[] => {
  const fullContext = { ...context, form_data };
  const changes: Changes[] = [];
  const { form_output_bindings } = formTemplate;

  for (const option of Object.keys(form_output_bindings)) {
    const binding = form_output_bindings[option];
    const value = resolveOutputBindingValue(binding, fullContext);
    changes.push({
      module: {
        module_name: formTemplate.linked_module_name,
        module_id: 'create',
      },
      changes: {
        [option]: value,
      },
    });
  }
  form_output_bindings;

  return changes;
};
