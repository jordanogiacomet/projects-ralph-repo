import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'
import { formatSlugHook } from '@/hooks/formatSlug'

export const SolucaoCategories: CollectionConfig = {
  slug: 'solucao-categories',
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
      name: 'heroTitle',
      type: 'text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
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
