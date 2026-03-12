import type { Block } from 'payload'

export const DownloadBlock: Block = {
  slug: 'downloadBlock',
  labels: {
    singular: 'Download',
    plural: 'Downloads',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'requiresEmail',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Exigir e-mail para download',
      },
    },
  ],
}
