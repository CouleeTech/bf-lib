import { formTemplateToChanges, resolveOutputBindingValue } from './FormOutputBindings';

import { defaultContext } from './test_data/defaultContext';

describe('Form Bindings formTemplateToChanges', () => {
  it('Create with form', () => {
    const changes = formTemplateToChanges(
      {
        COOL_ITEM: 'THING',
      },
      { ...defaultContext },
      {
        linked_module_name: 'TASK_MANAGEMENT',
        form_output_bindings: {
          'entity,form_data,TEST_THING': {
            type: 'VALUE',
            value: 10,
          },
        },
      },
    );
    const entityModule = changes.find((c) => c.module.module_name === 'TASK_MANAGEMENT');
    expect(changes.length).toEqual(1);
    expect(entityModule?.changes['form_data.TEST_THING']).toEqual(10);
  });
});

describe('Form Bindings resolveOutputBindingValue', () => {
  it('resolveOutputBindingValue type of VALUE', async () => {
    expect(
      resolveOutputBindingValue(
        {
          type: 'VALUE',
          value: 10,
        },
        { ...defaultContext, form_data: {} },
      ),
    ).toEqual(10);
    expect(
      resolveOutputBindingValue(
        {
          type: 'VALUE',
          value: '10',
        },
        { ...defaultContext, form_data: {} },
      ),
    ).not.toEqual(10);
    expect(
      resolveOutputBindingValue(
        {
          type: 'VALUE',
          value: 'testing',
        },
        { ...defaultContext, form_data: {} },
      ),
    ).toEqual('testing');
  });
  it('resolveOutputBindingValue type of CONTEXT_TEMPLATE', async () => {
    expect(
      resolveOutputBindingValue(
        {
          type: 'CONTEXT_TEMPLATE',
          value: '{{actor.title}}',
        },
        { ...defaultContext, form_data: {} },
      ),
    ).toEqual('John Doe');
    expect(
      resolveOutputBindingValue(
        {
          type: 'CONTEXT_TEMPLATE',
          value: '{{creator.title}}',
        },
        { ...defaultContext, form_data: {} },
      ),
    ).toEqual('Bill Smith');
    expect(
      resolveOutputBindingValue(
        {
          type: 'CONTEXT_TEMPLATE',
          value: '{{actor.title}} and {{creator.title}}',
        },
        { ...defaultContext, form_data: {} },
      ),
    ).toEqual('John Doe and Bill Smith');
  });
  it('resolveOutputBindingValue type of CONTEXT', async () => {
    expect(
      resolveOutputBindingValue(
        {
          type: 'CONTEXT',
          value: {
            data_source: 'actor',
            data_key: 'title',
          },
        },
        { ...defaultContext, form_data: {} },
      ),
    ).toEqual('John Doe');
  });
});
