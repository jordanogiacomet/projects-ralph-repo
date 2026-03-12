import type { Block } from 'payload'

export const ServiceCardsBlock: Block = {
  slug: 'serviceCardsBlock',
  labels: {
    singular: 'Cards de Serviço',
    plural: 'Cards de Serviço',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'cards',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
  ],
}
