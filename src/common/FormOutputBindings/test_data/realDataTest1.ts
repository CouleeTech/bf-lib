import { EntityFormDataContextDTO, EntityFormTemplate } from 'bf-types';

const formData: any = {
  title: '',
  tags: [
    {
      id: '5be0f1af-d00e-4c0f-a139-befa5788fa0a',
      tag_type: 'LOCAL',
      name: 'AutoSchedule',
      color: '#FFE700',
    },
    {
      id: '5be0f1af-d00e-4c0f-a139-befa5788fa0a',
      tag_type: 'LOCAL',
      name: 'new-orders',
      color: '#FFE700',
    },
  ],
  expected_start_date: '2022-09-27T13:00:00.000-05:00',
  expected_end_date: '2022-09-27T14:00:00.000-05:00',
  user1_link: null,
  user2_link: null,
  company_link: {
    module_name: 'COMPANY',
    module_id: 'a665f5e5-a062-4264-af4a-d1bc1c9a7e91',
  },
  Name: '9/27/2022 01:00 PM',
  'Order Name': '9/27/2022 01:00 PM',
  date_PrimaryPhone: '1111111111',
  address_ServiceLocaiton: {
    address_1: '711 N Bridge St RM 122',
    address_2: '',
    lat: 44.9369,
    lng: -91.3929,
    state: 'WI',
    city: 'Chippewa falls',
    zip: '54729',
  },
  dest_company_link: {
    module_name: 'COMPANY',
    module_id: 'a665f5e5-a062-4264-af4a-d1bc1c9a7e91',
  },
  address_Destination: {
    address_1: '711 N Bridge St RM 122',
    address_2: '',
    lat: 44.9369,
    lng: -91.3929,
    state: 'WI',
    city: 'Chippewa falls',
    zip: '54729',
  },
  datetime_PickupTime: '2022-09-27T13:00:00.000-05:00',
  TransportType: 'Chapter51/55',
  JobDescription: '',
  NotesForEmployee: '',
  document: '',
  bg_color: '#FFFFFF',
};

const context: any = {
  entity: {
    id: '6284ca21-1343-4235-ba82-adfc362a6ddb',
  },
  actor: {
    id: '01d0c20a-4b14-4a9e-b2d3-cb1be5fa5c99',
    external_id: '',
    title: 'Main Admin',
    first_name: '',
    last_name: '',
    created_date: '2022-03-28T14:35:39.457Z',
    updated_date: '2022-08-24T18:17:24.782Z',
    module_associations: [
      {
        module_name: 'SCHEDULED_ITEM',
        module_id: '568efe7b-5d18-43c6-a20d-6d410c614cc8',
        roles: ['availble_schedule'],
        id: '9f23e25e-7517-4e43-a13c-3261c381f7d5',
      },
    ],
    created_by: {
      module_name: 'USER',
      module_id: '2ba5f3e8-9ac8-42b6-9d42-4b9f7b4c9d90',
    },
    status: 'CANCELLED',
    organization: {
      module_id: '63d584f6-6a56-415a-9005-1f0acf8b3d46',
      module_name: 'ORGANIZATION',
    },
    primary_email: 'admin@talon-pa.com',
    settings: {},
    tags: [
      {
        id: 'be5b0f54-c22d-40fd-9841-6a39925930d0',
        tag_type: 'LOCAL',
        name: 'Part-Time',
        color: '#F6E87F',
        created_date: '2022-07-18T17:07:39.317Z',
        updated_date: '2022-07-18T17:07:39.317Z',
      },
    ],
    email_addresses: [
      {
        email_address: 'admin@talon-pa.com',
        name: 'email',
        primary: true,
        roles: [],
        id: '244f6e7e-6020-45a1-aadc-b4729f2f9341',
      },
    ],
    addresses: [],
    custom_attributes: [],
    phone_numbers: [],
    participants: [
      {
        module_id: '01d0c20a-4b14-4a9e-b2d3-cb1be5fa5c99',
        module_name: 'USER',
        roles: [],
        scopes: ['OWNER'],
        last_interaction: '2022-03-28T14:35:39.078Z',
        id: 'c550bbec-a050-4472-9ee7-56bada373e6c',
      },
      {
        module_name: 'ORGANIZATION',
        module_id: '63d584f6-6a56-415a-9005-1f0acf8b3d46',
        roles: [],
        scopes: ['READWRITE'],
        last_interaction: '2022-03-28T14:35:39.479Z',
        id: '23e5e346-e0f3-43e6-bdc3-00ebe984a61e',
      },
    ],
    updated_by: {
      module_name: 'USER',
      module_id: '01d0c20a-4b14-4a9e-b2d3-cb1be5fa5c99',
    },
    form_data: {},
    form_fields_metadata: {},
  },
  creator: {
    id: '01d0c20a-4b14-4a9e-b2d3-cb1be5fa5c99',
    external_id: '',
    title: 'Main Admin',
    first_name: '',
    last_name: '',
    created_date: '2022-03-28T14:35:39.457Z',
    updated_date: '2022-08-24T18:17:24.782Z',
    module_associations: [
      {
        module_name: 'SCHEDULED_ITEM',
        module_id: '568efe7b-5d18-43c6-a20d-6d410c614cc8',
        roles: ['availble_schedule'],
        id: '9f23e25e-7517-4e43-a13c-3261c381f7d5',
      },
    ],
    created_by: {
      module_name: 'USER',
      module_id: '2ba5f3e8-9ac8-42b6-9d42-4b9f7b4c9d90',
    },
    status: 'CANCELLED',
    organization: {
      module_id: '63d584f6-6a56-415a-9005-1f0acf8b3d46',
      module_name: 'ORGANIZATION',
    },
    primary_email: 'admin@talon-pa.com',
    settings: {},
    tags: [
      {
        id: 'be5b0f54-c22d-40fd-9841-6a39925930d0',
        tag_type: 'LOCAL',
        name: 'Part-Time',
        color: '#F6E87F',
        created_date: '2022-07-18T17:07:39.317Z',
        updated_date: '2022-07-18T17:07:39.317Z',
      },
    ],
    email_addresses: [
      {
        email_address: 'admin@talon-pa.com',
        name: 'email',
        primary: true,
        roles: [],
        id: '244f6e7e-6020-45a1-aadc-b4729f2f9341',
      },
    ],
    addresses: [],
    custom_attributes: [],
    phone_numbers: [],
    participants: [
      {
        module_id: '01d0c20a-4b14-4a9e-b2d3-cb1be5fa5c99',
        module_name: 'USER',
        roles: [],
        scopes: ['OWNER'],
        last_interaction: '2022-03-28T14:35:39.078Z',
        id: 'c550bbec-a050-4472-9ee7-56bada373e6c',
      },
      {
        module_name: 'ORGANIZATION',
        module_id: '63d584f6-6a56-415a-9005-1f0acf8b3d46',
        roles: [],
        scopes: ['READWRITE'],
        last_interaction: '2022-03-28T14:35:39.479Z',
        id: '23e5e346-e0f3-43e6-bdc3-00ebe984a61e',
      },
    ],
    updated_by: {
      module_name: 'USER',
      module_id: '01d0c20a-4b14-4a9e-b2d3-cb1be5fa5c99',
    },
    form_data: {},
    form_fields_metadata: {},
  },
};

const template = {
  title: 'Talon Form Demo',
  id: 'fb8125ad-57db-4f10-91e9-5b7111a7b880',
  created_by: {
    module_name: 'USER',
    module_id: '01d0c20a-4b14-4a9e-b2d3-cb1be5fa5c99',
  },
  custom_attributes: [],
  organization: {
    module_name: 'ORGANIZATION',
    module_id: '63d584f6-6a56-415a-9005-1f0acf8b3d46',
  },
  settings: {},
  status: 'READY',
  sub_module: false,
  external_id: '4273971c-3e68-47fb-8dcb-22d182b5c705',
  form_fields: [
    {
      id: '7860b60d-f59d-46b4-a08a-5800e3b4db41',
      name: 'title',
      label: 'Title',
      defaultString: ' ',
      required: false,
      viewonly: false,
      type: 'TEXT',
      config: {},
    },
    {
      id: '7c9253f7-bbac-4237-aa81-28ab6ae97417',
      name: 'tags',
      label: 'Tags',
      required: false,
      viewonly: false,
      type: 'MODULE_COMPONENT',
      config: {
        moduleProperty: 'tags',
        defaultValue: [
          {
            id: '5be0f1af-d00e-4c0f-a139-befa5788fa0a',
            tag_type: 'LOCAL',
            name: 'AutoSchedule',
            color: '#FFE700',
          },
          {
            id: '5be0f1af-d00e-4c0f-a139-befa5788fa0a',
            tag_type: 'LOCAL',
            name: 'new-orders',
            color: '#FFE700',
          },
        ],
      },
    },
    {
      id: 'c561df7d-7dcb-40f4-b360-daf32fff5954',
      name: 'expected_start_date',
      label: 'Start Time',
      type: 'DATETIME',
      config: {
        type: ' ',
      },
      settings: {
        actions: {},
      },
    },
    {
      id: '14f78431-0175-4836-819d-74fd610b3b08',
      name: 'expected_end_date',
      label: 'End Time',
      type: 'DATETIME',
      config: {
        type: ' ',
      },
      settings: {
        actions: {},
      },
    },
    {
      id: '07aa1fe2-f544-4daf-8c57-a587b6169bef',
      name: 'user1_link',
      label: 'Assign 1',
      required: false,
      type: 'MODULE_LINK',
      config: {
        modules: ['USER'],
      },
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: 'aa56959d-2a86-4d32-8a0f-e6c73f1f8054',
      name: 'user2_link',
      label: 'Assign 2',
      required: false,
      type: 'MODULE_LINK',
      config: {
        modules: ['USER'],
      },
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: 'd5b07348-9bae-48e5-8364-a674cbc260b3',
      name: 'company_link',
      label: 'Customer',
      required: true,
      type: 'MODULE_LINK',
      config: {
        modules: ['COMPANY'],
      },
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: '5df5163f-81a8-446b-ae9e-6b5ffe21ec6e',
      name: 'Name',
      label: 'Primary Contact',
      required: true,
      type: 'TEXT',
      config: {},
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: '98b1f031-9984-4153-b551-119edb48b903',
      name: 'Order Name',
      label: 'Order Contact',
      required: true,
      type: 'TEXT',
      config: {},
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: 'e69cc3ce-34de-4a70-8c25-15033c631e16',
      name: 'date_PrimaryPhone',
      label: 'Primary Phone',
      required: true,
      type: 'PHONE_NUMBER',
      config: {},
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: 'b3822b3e-cfa4-49be-b34c-19bba04ca503',
      name: 'address_ServiceLocaiton',
      label: 'Service Location',
      required: true,
      type: 'ADDRESS',
      config: {
        autocompleteModuleLinkField: 'company_link',
      },
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: 'f2952ee1-c8bb-4763-8663-7f6e5f712039',
      name: 'dest_company_link',
      label: 'Destination Company',
      required: true,
      type: 'MODULE_LINK',
      config: {
        modules: ['COMPANY'],
      },
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: '8dc41afc-7185-45f6-840c-6b54cc60257a',
      name: 'address_Destination',
      label: 'Destination',
      required: true,
      type: 'ADDRESS',
      config: {
        autocompleteModuleLinkField: 'dest_company_link',
      },
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: 'c6a2d3ff-09f9-4d52-bd5f-f90d5f32b0a0',
      name: 'datetime_PickupTime',
      label: 'Pickup Date & Time',
      required: false,
      type: 'DATETIME',
      config: {},
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: '20adc981-5140-45a5-9881-5359a4821fb9',
      name: 'TransportType',
      label: 'Transport Type',
      required: false,
      type: 'SELECT',
      config: {
        options: [
          {
            value: 'Chapter51/55',
            label: 'Chapter 51/55',
          },
          {
            value: 'Voluntary',
            label: 'Voluntary',
          },
          {
            value: 'Prisoner',
            label: 'Prisoner',
          },
          {
            value: 'Extradition',
            label: 'Extradition',
          },
          {
            value: 'Instate',
            label: 'Instate',
          },
          {
            value: 'Court Hearing',
            label: 'Court Hearing',
          },
          {
            value: 'Restrictive Placement',
            label: 'Restrictive Placement',
          },
        ],
      },
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: '57a5d699-ff4c-4a6b-9c0a-b45ea0170914',
      name: 'JobDescription',
      label: 'Job Description',
      required: false,
      type: 'TEXT_AREA',
      config: {},
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: '5b20c69c-806c-4ce4-ac84-67eb04dfbbaa',
      name: 'NotesForEmployee',
      label: 'Notes For Employee',
      required: false,
      type: 'TEXT_AREA',
      config: {},
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: '2d49484d-1d9d-4f3d-b37c-926f04d64e9f',
      name: 'document',
      label: 'Document',
      required: false,
      type: 'FILE',
      config: {},
      settings: {
        actions: {
          approveDeny: true,
        },
      },
    },
    {
      id: '8396615f-5856-42d7-bcdb-6f25e28aef12',
      name: 'bg_color',
      label: 'Background Color',
      required: false,
      type: 'TEXT',
      config: {},
      autopopulate: {
        trigger: 'FIELD_UPDATE',
        trigger_value: 'company_link',
        processor: {
          type: 'PIPELINE',
          config: {
            steps: [
              {
                type: 'MANIPULATOR',
                target: 'watched_field',
                plugin_id: 'timwoods_module_link_to_entity',
                name: 'fetch_stuff',
                config: {},
              },
              {
                type: 'OUTPUT',
                plugin_id: 'return_string',
                name: 'return_string',
                target: 'watched_field',
                config: {},
                stringer: {
                  plugin_id: 'handlebars_stringer',
                  config: {
                    template: '{{#each current}}{{background_color}}{{/each}}',
                  },
                },
              },
            ],
          },
        },
      },
      settings: {
        actions: {},
      },
    },
  ],
  form_input_bindings: {
    title: {
      type: 'CONTEXT',
      value: {
        data_source: 'entity',
        data_key: 'title',
      },
    },
    tags: {
      type: 'CONTEXT',
      value: {
        data_source: 'entity',
        data_key: 'tags',
      },
    },
    expected_start_date: {
      type: 'CONTEXT',
      value: {
        data_source: 'entity',
        data_key: 'expected_start_date',
      },
    },
    expected_end_date: {
      type: 'CONTEXT',
      value: {
        data_source: 'entity',
        data_key: 'expected_end_date',
      },
    },
    bg_color: {
      type: 'CONTEXT',
      value: {
        data_source: 'entity',
        data_key: 'background_color',
      },
    },
  },
  form_output_bindings: {
    'entity,title': {
      type: 'CONTEXT',
      value: {
        data_source: 'form_data',
        data_key: 'title',
      },
      default: {
        data_source: 'entity',
        data_key: 'id',
        manipulators: [
          {
            manipulator_type: 'SUBSTR',
            value: '',
            config: {
              start: 0,
              length: 7,
            },
          },
          {
            manipulator_type: 'PREPEND',
            value: 'Transport ',
            config: {},
          },
        ],
      },
    },
    'entity,tags': {
      type: 'CONTEXT',
      value: {
        data_source: 'form_data',
        data_key: 'tags',
      },
    },
    'entity,expected_start_date': {
      type: 'CONTEXT',
      value: {
        data_source: 'form_data',
        data_key: 'expected_start_date',
      },
    },
    'entity,expected_end_date': {
      type: 'CONTEXT',
      value: {
        data_source: 'form_data',
        data_key: 'expected_end_date',
      },
    },
    'entity,background_color': {
      type: 'CONTEXT',
      value: {
        data_source: 'form_data',
        data_key: 'bg_color',
      },
    },
  },
  linked_module_name: 'TASK_MANAGEMENT',
  form_layout_config: {},
  form_layout: 'SIMPLE',
  form_view_style: 'SIMPLE_LABEL',
  module_associations: [],
  updated_date: '2022-09-26T19:02:57.526Z',
  created_date: '2022-03-28T15:17:53.762Z',
  updated_by: {
    module_name: 'USER',
    module_id: '01d0c20a-4b14-4a9e-b2d3-cb1be5fa5c99',
  },
  participants: [
    {
      id: '16f78b84-1ba5-4fab-af5e-5788d25b9587',
      module_name: 'USER',
      module_id: '01d0c20a-4b14-4a9e-b2d3-cb1be5fa5c99',
      roles: ['MEMBER'],
      scopes: ['OWNER'],
      last_interaction: '2022-03-28T15:17:53.762Z',
    },
    {
      id: '69f73c76-45cc-4098-ae36-6cfcc2ad52ad',
      module_name: 'ORGANIZATION',
      module_id: '63d584f6-6a56-415a-9005-1f0acf8b3d46',
      roles: ['MEMBER'],
      scopes: ['READWRITE'],
      last_interaction: '2022-03-28T15:17:53.762Z',
    },
  ],
};

export const formTemplateToChangesRealTest1 = {
  formData,
  context,
  template,
} as {
  formData: FormData;
  context: EntityFormDataContextDTO;
  template: Partial<EntityFormTemplate> & Pick<EntityFormTemplate, 'form_output_bindings' | 'linked_module_name'>;
};
