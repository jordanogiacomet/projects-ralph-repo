import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'controle-patrimonial',
  solutionSlug: 'organizacao-patrimonial',
  fallbackData: {
    title: 'Organização Patrimonial',
    heroTitle: 'Organização Patrimonial',
    categoryTitle: 'Controle Patrimonial',
    description:
      'Estruturamos e saneamos a base patrimonial da sua empresa para elevar governança, rastreabilidade e qualidade das decisões.',
    metaTitle: 'Organização Patrimonial | Apollo Gestão',
    metaDescription:
      'Serviço de Organização Patrimonial da Apollo Gestão: saneamento de base, padronização e inteligência para gestão de ativos.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              { type: 'text', text: 'Estruturação da base patrimonial com metodologia técnica' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Conduzimos o saneamento e a padronização dos dados patrimoniais para garantir consistência entre operação, contabilidade e tomada de decisão.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Com visão consultiva, entregamos uma base organizada para apoiar inventários, auditorias, revisões contábeis e estratégias de longo prazo.',
              },
            ],
          },
        ],
      },
    },
    relatedSolutions: [
      {
        id: 'identificacao-patrimonial',
        title: 'Identificação Patrimonial',
        href: '/solucoes/controle-patrimonial/identificacao-patrimonial',
      },
      {
        id: 'controle-e-inventario-de-estoques',
        title: 'Controle e Inventário de Estoques',
        href: '/solucoes/controle-patrimonial/controle-e-inventario-de-estoques',
      },
      {
        id: 'processamento-patrimonial',
        title: 'Processamento Patrimonial',
        href: '/solucoes/controle-patrimonial/processamento-patrimonial',
      },
    ],
  },
} satisfies SolutionDetailConfig

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionDetailMetadata(config)
}

export default function OrganizacaoPatrimonialPage() {
  return <SolutionDetailPage config={config} />
}
