import type { CollectionConfig } from 'payload'
import { isAdmin, isLoggedIn } from '@/access'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'formType',
  },
  access: {
    read: isLoggedIn,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Contato', value: 'contato' },
        { label: 'Cotação', value: 'cotacao' },
        { label: 'Representante', value: 'representante' },
      ],
    },
    {
      name: 'data',
      type: 'json',
      required: true,
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Novo', value: 'new' },
        { label: 'Em análise', value: 'in-review' },
        { label: 'Respondido', value: 'responded' },
        { label: 'Arquivado', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
