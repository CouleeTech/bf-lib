import { EntityFormDataContextDTO } from 'bf-types';

export const defaultContext: EntityFormDataContextDTO = {
  actor: {
    id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
    module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
    module_name: 'USER',
    title: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    created_date: '2019-12-14T07:09:21.372Z',
    updated_date: '2021-05-05T16:04:19.886Z',
    status: 'READY',
    created_by: {
      module_name: 'USER',
      module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
    },
    updated_by: {
      module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
      module_name: 'USER',
    },
    organization: {
      module_name: 'ORGANIZATION',
      module_id: 'f09308b3-306f-4641-9A8D-215d7d14e4a7',
    },
    addresses: [],
    custom_attributes: [],
    tags: [],
    phone_numbers: [],
    primary_email: 'john.doe@example.net',
    email_addresses: [
      {
        email_address: 'john.doe@example.net',
        name: 'email',
        primary: true,
        roles: [],
        id: 'f67b3d46-65fc-4f8d-956b-c1ce35761664',
      },
      {
        email_address: 'john.doe@example.net',
        name: 'email',
        primary: true,
        roles: [],
        id: 'e08c6f2b-c6fc-4932-b26c-a5eeb53b20b6',
      },
    ],
    settings: {
      WORKFLOW: {
        TASK_MANAGEMENT: {
          ROWS_PER_PAGE_HOME: 500,
          FILTER_HOME: [
            {
              field_name: 'status',
              title: 'Status',
              field_value: {
                type: 'IN_LIST',
                values: ['READY'],
              },
              id: 'a182c938-1fcb-40b0-9c01-a06a77c49ae4',
            },
          ],
          SORTING_HOME: {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
        },
        SEARCH_SCREEN: {
          'SORTING_B1B0C76D-2C7E-48FD-AF7D-A29207710EF7_AAE19A39-22B9-45FE-A2BE-79BECECBC844': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          'SORTING_8F31CF1E-7F58-4C39-A7DF-555E8D487452_A0B2CDBA-BF01-4540-BE9F-7CD9D663A688': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          'FILTER_WORKFLOW::SEARCH_SCREEN_SEARCH': [
            {
              field_name: 'status',
              field_value: {
                type: 'IN_LIST',
                values: ['READY'],
              },
              title: 'Status',
              id: '873e00c5-3fe0-4215-877d-54b2e9a6b68a',
            },
            {
              field_name: 'title',
              field_value: {
                type: 'LIKE_TEXT',
                value: 'Josh',
              },
              title: 'Title',
              id: 'e4a282f8-7a93-4201-a8f0-fda6744113f0',
            },
          ],
          'SORTING_WORKFLOW::SEARCH_SCREEN_SEARCH': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          'SORTING_934E152F-468C-47A0-90BF-A18FB0371E67_AE61B200-B06C-4B6C-BDBC-EBFD09845827': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
        },
      },
      JOHNE_AND_ATTENDANCE: {
        JOHNE_PUNCH: {
          FILTER_JOHNE_SEARCH: [
            {
              field_name: 'actual_punch_in',
              field_value: {
                type: 'TEMPORAL_DATE_RANGE',
                start: '',
                end: '',
                temporal_constraint: {
                  type: 'META',
                  key: 'yesterday at 12am',
                  value: 'at 12am',
                },
              },
              title: 'Actual Punch In',
              id: '326ab31e-9d6a-4748-a2a6-9ae073d18e42',
            },
            {
              field_name: 'assignee.module_id',
              field_value: {
                value: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
                type: 'EXACT_MATCH',
              },
              title: 'Assignee',
              id: 'dce49519-8585-4fd2-b5cb-75d11b9fc807',
            },
          ],
          SORTING_JOHNE_SEARCH: {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          STACKER_JOHNE_SEARCH: null,
        },
      },
      CORE: {
        USER: {
          'FILTER_CORE::USER_SEARCH': [
            {
              field_name: 'status',
              field_value: {
                type: 'IN_LIST',
                values: ['READY'],
              },
              id: 'bd93439b-ed0d-4b3a-b240-73e9deec60e3',
              title: 'Status',
            },
            {
              title: 'Tags',
              field_name: 'tags',
              field_value: {
                type: 'CONTAINS_IN_LIST',
                values: ['Test'],
                constraint: {
                  type: 'NESTED_FIELD',
                  key: 'name',
                },
              },
              id: '17f52562-6bbe-4c57-b6c3-599633097beb',
            },
          ],
          'SORTING_CORE::USER_SEARCH': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          'WEEKDAY_MASK_AE61B200-B06C-4B6C-BDBC-EBFD09845827': {
            SUNDAY: false,
            MONDAY: false,
            TUESDAY: false,
            WEDNESDAY: false,
            THURSDAY: false,
            FRIDAY: false,
            SATURDAY: false,
          },
        },
      },
    },
    participants: [
      {
        module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
        module_name: 'USER',
        roles: [],
        scopes: ['OWNER'],
        last_interaction: '2019-12-14T07:09:21.372Z',
        id: 'd99b8b09-bb1d-4506-acdc-380b9c504517',
      },
      {
        module_id: 'f09308b3-306f-4641-9A8D-215d7d14e4a7',
        module_name: 'ORGANIZATION',
        roles: [],
        scopes: ['READWRITE'],
        last_interaction: '2019-12-14T07:09:21.372Z',
        id: '2cb94d47-3f53-48ca-b887-bb78014d404e',
      },
    ],
    form_data: {},
    form_fields_metadata: {},
  },
  creator: {
    id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
    module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
    module_name: 'USER',
    title: 'Bill Smith',
    first_name: 'Bill',
    last_name: 'Smith',
    created_date: '2019-12-14T07:09:21.372Z',
    updated_date: '2021-05-05T16:04:19.886Z',
    status: 'READY',
    created_by: {
      module_name: 'USER',
      module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
    },
    updated_by: {
      module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
      module_name: 'USER',
    },
    organization: {
      module_name: 'ORGANIZATION',
      module_id: 'f09308b3-306f-4641-9A8D-215d7d14e4a7',
    },
    addresses: [],
    custom_attributes: [],
    tags: [],
    phone_numbers: [],
    primary_email: 'john.doe@example.net',
    email_addresses: [
      {
        email_address: 'john.doe@example.net',
        name: 'email',
        primary: true,
        roles: [],
        id: 'f67b3d46-65fc-4f8d-956b-c1ce35761664',
      },
    ],
    settings: {
      WORKFLOW: {
        TASK_MANAGEMENT: {
          ROWS_PER_PAGE_HOME: 500,
          FILTER_HOME: [
            {
              field_name: 'status',
              title: 'Status',
              field_value: {
                type: 'IN_LIST',
                values: ['READY'],
              },
              id: 'a182c938-1fcb-40b0-9c01-a06a77c49ae4',
            },
          ],
          SORTING_HOME: {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
        },
        SEARCH_SCREEN: {
          'SORTING_B1B0C76D-2C7E-48FD-AF7D-A29207710EF7_AAE19A39-22B9-45FE-A2BE-79BECECBC844': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          'SORTING_8F31CF1E-7F58-4C39-A7DF-555E8D487452_A0B2CDBA-BF01-4540-BE9F-7CD9D663A688': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          'FILTER_WORKFLOW::SEARCH_SCREEN_SEARCH': [
            {
              field_name: 'status',
              field_value: {
                type: 'IN_LIST',
                values: ['READY'],
              },
              title: 'Status',
              id: '873e00c5-3fe0-4215-877d-54b2e9a6b68a',
            },
            {
              field_name: 'title',
              field_value: {
                type: 'LIKE_TEXT',
                value: 'Josh',
              },
              title: 'Title',
              id: 'e4a282f8-7a93-4201-a8f0-fda6744113f0',
            },
          ],
          'SORTING_WORKFLOW::SEARCH_SCREEN_SEARCH': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          'SORTING_934E152F-468C-47A0-90BF-A18FB0371E67_AE61B200-B06C-4B6C-BDBC-EBFD09845827': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
        },
      },
      JOHNE_AND_ATTENDANCE: {
        JOHNE_PUNCH: {
          FILTER_JOHNE_SEARCH: [
            {
              field_name: 'actual_punch_in',
              field_value: {
                type: 'TEMPORAL_DATE_RANGE',
                start: '',
                end: '',
                temporal_constraint: {
                  type: 'META',
                  key: 'yesterday at 12am',
                  value: 'at 12am',
                },
              },
              title: 'Actual Punch In',
              id: '326ab31e-9d6a-4748-a2a6-9ae073d18e42',
            },
            {
              field_name: 'assignee.module_id',
              field_value: {
                value: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
                type: 'EXACT_MATCH',
              },
              title: 'Assignee',
              id: 'dce49519-8585-4fd2-b5cb-75d11b9fc807',
            },
          ],
          SORTING_JOHNE_SEARCH: {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          STACKER_JOHNE_SEARCH: null,
        },
      },
      CORE: {
        USER: {
          'FILTER_CORE::USER_SEARCH': [
            {
              field_name: 'status',
              field_value: {
                type: 'IN_LIST',
                values: ['READY'],
              },
              id: 'bd93439b-ed0d-4b3a-b240-73e9deec60e3',
              title: 'Status',
            },
            {
              title: 'Tags',
              field_name: 'tags',
              field_value: {
                type: 'CONTAINS_IN_LIST',
                values: ['Test'],
                constraint: {
                  type: 'NESTED_FIELD',
                  key: 'name',
                },
              },
              id: '17f52562-6bbe-4c57-b6c3-599633097beb',
            },
          ],
          'SORTING_CORE::USER_SEARCH': {
            field: 'created_date',
            direction: 'desc',
            type: 'field',
          },
          'WEEKDAY_MASK_AE61B200-B06C-4B6C-BDBC-EBFD09845827': {
            SUNDAY: false,
            MONDAY: false,
            TUESDAY: false,
            WEDNESDAY: false,
            THURSDAY: false,
            FRIDAY: false,
            SATURDAY: false,
          },
        },
      },
    },
    participants: [
      {
        module_id: 'cff01d19-2ea7-4e4e-99bd-39be6c6728cc',
        module_name: 'USER',
        roles: [],
        scopes: ['OWNER'],
        last_interaction: '2019-12-14T07:09:21.372Z',
        id: 'd99b8b09-bb1d-4506-acdc-380b9c504517',
      },
      {
        module_id: 'f09308b3-306f-4641-9A8D-215d7d14e4a7',
        module_name: 'ORGANIZATION',
        roles: [],
        scopes: ['READWRITE'],
        last_interaction: '2019-12-14T07:09:21.372Z',
        id: '2cb94d47-3f53-48ca-b887-bb78014d404e',
      },
    ],
    form_data: {},
    form_fields_metadata: {},
  },
} as any;
