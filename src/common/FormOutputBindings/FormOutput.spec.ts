import { formTemplateToChanges, resolveOutputBindingValue } from './FormOutputBindings';

import { defaultContext } from './test_data/defaultContext';

describe('Form Bindings formTemplateToChanges', () => {
  it('Create with form', () => {
    const changes = formTemplateToChanges(
      {
        COOL_ITEM: 'THING',
        participants: [
          {
            module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
            module_name: 'USER_GROUP',
            roles: [],
            scopes: ['OWNER'],
          },
        ],
        email_addresses: [
          {
            roles: [],
            id: 'f67b3d46-65fc-4f8d-956b-c1ce35761664',
            email_address: 'deviprsd@coulee.tech',
          },
          {
            roles: [],
            id: '5a12806d-c9db-4e58-8d1a-f87c10681d00',
            email_address: 'deviprsd21@coulee.tech',
          },
          {
            roles: [],
            email_address: 'deviprsd21@gmail.tech',
          },
        ],
      },
      { ...defaultContext },
      {
        linked_module_name: 'TASK_MANAGEMENT',
        form_output_bindings: {
          'entity,form_data,TEST_THING': {
            type: 'VALUE',
            value: 10,
          },
          'actor,participants,[module_id;module_name:USER]': {
            type: 'CONTEXT',
            value: {
              data_source: 'form_data',
              data_key: 'participants',
            },
          },
          'actor,email_addresses,~[id;primary:true]': {
            type: 'CONTEXT',
            value: {
              data_source: 'form_data',
              data_key: 'email_addresses',
            },
          },
        },
      },
    );

    const entityModule = changes.find((c) => c.module.module_name === 'TASK_MANAGEMENT');
    const userModule = changes.find((c) => c.module.module_name === 'USER');

    expect(changes.length).toEqual(2);
    expect(entityModule?.changes['form_data.TEST_THING']).toEqual(10);

    expect(
      userModule?.changes['participants._[module_id:cff01d19-2ea7-4e4e-99bd-39be6c6728cc;module_name:USER]'],
    ).toMatchObject({
      module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
      module_name: 'USER_GROUP',
      roles: [],
      scopes: ['OWNER'],
      last_interaction: '2019-12-14T07:09:21.372Z',
      id: 'd99b8b09-bb1d-4506-acdc-380b9c504517',
    });

    expect(
      userModule?.changes['email_addresses._[id:f67b3d46-65fc-4f8d-956b-c1ce35761664;primary:true]'],
    ).toMatchObject({
      email_address: 'deviprsd@coulee.tech',

      roles: [],
      id: 'f67b3d46-65fc-4f8d-956b-c1ce35761664',
    });
  });

  it('has default form', () => {
    const changes = formTemplateToChanges(
      { cool: 'thing' },
      { ...defaultContext },
      { linked_module_name: 'TASK_MANAGEMENT', form_output_bindings: {} },
    );
    expect(changes.length).toEqual(1);
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
