import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'statsBlock',
  labels: {
    singular: 'Estatísticas',
    plural: 'Estatísticas',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
