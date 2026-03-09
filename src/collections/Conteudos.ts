import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'
import { formatSlugHook } from '@/hooks/formatSlug'

export const Conteudos: CollectionConfig = {
  slug: 'conteudos',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlugHook],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'downloadFile',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'requiresEmail',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      type: 'group',
      name: 'meta',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
