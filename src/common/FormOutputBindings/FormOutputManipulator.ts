import {
  EntityFormDataContextDTO,
  FormContextBinding,
  formContextManipulate,
  FormDataDoc,
  FormOutputBinding,
} from 'bf-types';
import { resolveUnmanipulatedOutputValue } from './FormOutputBindings';
export const isFormContextBinding = (input: any): input is FormContextBinding => {
  if (
    typeof input === 'object' &&
    input &&
    typeof input.data_source === 'string' &&
    typeof input.data_key === 'string'
  ) {
    return true;
  }

  return false;
};

export const getManipulatedValue = (bindings: FormOutputBinding, context: EntityFormDataContextDTO & FormDataDoc) => {
  const uro = resolveUnmanipulatedOutputValue(bindings, context);
  let { value } = uro;
  const { manipulators } = uro;

  for (const manipulator of manipulators || []) {
    const rv = isFormContextBinding(manipulator.value)
      ? getManipulatedValue({ value: manipulator.value, type: 'VALUE' }, context)
      : manipulator.value;
    value = formContextManipulate(value, manipulator.manipulator_type, manipulator.config, rv);
  }

  return value;
};
