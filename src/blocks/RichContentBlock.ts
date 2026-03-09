import type { Block } from 'payload'

export const RichContentBlock: Block = {
  slug: 'richContentBlock',
  labels: {
    singular: 'Conteúdo Rico',
    plural: 'Conteúdos Ricos',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
