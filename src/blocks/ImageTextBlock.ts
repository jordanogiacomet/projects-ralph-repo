import type { Block } from 'payload'

export const ImageTextBlock: Block = {
  slug: 'imageTextBlock',
  labels: {
    singular: 'Imagem + Texto',
    plural: 'Imagem + Texto',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Direita', value: 'right' },
      ],
    },
  ],
}
