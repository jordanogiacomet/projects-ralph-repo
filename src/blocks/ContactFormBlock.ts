import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactFormBlock',
  labels: {
    singular: 'Formulário de Contato',
    plural: 'Formulários de Contato',
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
      name: 'formType',
      type: 'select',
      required: true,
      defaultValue: 'contato',
      options: [
        { label: 'Contato', value: 'contato' },
        { label: 'Cotação', value: 'cotacao' },
      ],
    },
  ],
}
