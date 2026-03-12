import type { Block } from 'payload'

export const ClientLogosBlock: Block = {
  slug: 'clientLogosBlock',
  labels: {
    singular: 'Logos de Clientes',
    plural: 'Logos de Clientes',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'maxItems',
      type: 'number',
      admin: {
        description: 'Número máximo de logos a exibir',
      },
    },
    {
      name: 'filterable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Permitir filtro por segmento',
      },
    },
  ],
}
