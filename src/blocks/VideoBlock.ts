import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'videoBlock',
  labels: {
    singular: 'Vídeo',
    plural: 'Vídeos',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'URL do vídeo (YouTube, Vimeo, etc.)',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
