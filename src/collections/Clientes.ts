import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'

export const Clientes: CollectionConfig = {
  slug: 'clientes',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'segmento',
      type: 'relationship',
      relationTo: 'cliente-segmentos',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
