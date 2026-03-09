import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'heroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'title',
      type: 'richText',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ctaLabel',
      type: 'text',
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 55,
      admin: {
        description: 'Opacidade do overlay em porcentagem (0-100)',
      },
    },
  ],
}
