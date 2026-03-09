import type { Block } from 'payload'

export const AccordionBlock: Block = {
  slug: 'accordionBlock',
  labels: {
    singular: 'Acordeão',
    plural: 'Acordeões',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
      ],
    },
  ],
}
