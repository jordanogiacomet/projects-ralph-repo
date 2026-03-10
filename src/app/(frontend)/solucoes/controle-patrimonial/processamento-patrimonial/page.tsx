import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'controle-patrimonial',
  solutionSlug: 'processamento-patrimonial',
  fallbackData: {
    title: 'Processamento Patrimonial',
    heroTitle: 'Processamento Patrimonial',
    categoryTitle: 'Controle Patrimonial',
    description:
      'Consolidamos e tratamos dados patrimoniais para transformar informações dispersas em uma base confiável para gestão, contabilidade e auditoria.',
    metaTitle: 'Processamento Patrimonial | Apollo Gestão',
    metaDescription:
      'Serviço de Processamento Patrimonial da Apollo Gestão com saneamento, classificação e integração de dados para decisões confiáveis.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              { type: 'text', text: 'Inteligência de dados para uma base patrimonial estruturada' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Realizamos o saneamento e a padronização das informações patrimoniais, eliminando inconsistências e organizando os ativos com critérios técnicos.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Com dados estruturados e rastreáveis, sua operação ganha agilidade para inventários, compliance contábil e tomada de decisão estratégica.',
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
        id: 'organizacao-patrimonial',
        title: 'Organização Patrimonial',
        href: '/solucoes/controle-patrimonial/organizacao-patrimonial',
      },
      {
        id: 'controle-e-inventario-de-estoques',
        title: 'Controle e Inventário de Estoques',
        href: '/solucoes/controle-patrimonial/controle-e-inventario-de-estoques',
      },
    ],
  },
} satisfies SolutionDetailConfig

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionDetailMetadata(config)
}

export default function ControleInventarioEstoquesPage() {
  return <SolutionDetailPage config={config} />
}
