export type Example = {
  id: string;
  label: string;
  description: string;
  value: string;
};

export const examples: Example[] = [
  {
    description: 'Nested user payload with nullable metadata.',
    id: 'api-response',
    label: 'API response',
    value: JSON.stringify(
      {
        active: true,
        createdAt: '2026-05-14T09:30:00.000Z',
        email: 'ada@example.com',
        id: 'usr_123',
        name: 'Ada Lovelace',
        profile: {
          avatarUrl: null,
          tags: ['admin', 'beta'],
          timezone: 'Europe/London'
        }
      },
      null,
      2
    )
  },
  {
    description: 'Feature flags and environment-specific settings.',
    id: 'config',
    label: 'Config object',
    value: JSON.stringify(
      {
        appName: 'json-to-something',
        environments: {
          preview: { apiBaseUrl: 'https://preview.example.com', debug: true },
          production: { apiBaseUrl: 'https://api.example.com', debug: false }
        },
        features: {
          localHistory: true,
          shareLinks: true
        },
        port: 5173
      },
      null,
      2
    )
  },
  {
    description: 'Matrix-like data with objects inside rows.',
    id: 'nested-arrays',
    label: 'Nested arrays',
    value: JSON.stringify(
      {
        rows: [
          [
            { label: 'Latency', value: 42 },
            { label: 'Errors', value: 3 }
          ],
          [
            { label: 'Latency', value: 37 },
            { label: 'Errors', value: 1 }
          ]
        ]
      },
      null,
      2
    )
  },
  {
    description: 'Common API shape with nullable timestamps.',
    id: 'nullable-fields',
    label: 'Nullable fields',
    value: JSON.stringify(
      {
        assignee: {
          deletedAt: null,
          id: 'user_7',
          name: 'Grace Hopper'
        },
        completedAt: null,
        taskId: 'task_001',
        title: 'Ship v1'
      },
      null,
      2
    )
  },
  {
    description: 'Array items with merged optional object fields.',
    id: 'mixed-array',
    label: 'Mixed array',
    value: JSON.stringify(
      [
        { type: 'text', value: 'hello' },
        { height: 800, type: 'image', url: 'https://example.com/image.png', width: 1200 },
        { type: 'divider' }
      ],
      null,
      2
    )
  }
];
