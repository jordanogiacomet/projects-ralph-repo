import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'controle-patrimonial',
  solutionSlug: 'controle-e-inventario-de-estoques',
  fallbackData: {
    title: 'Controle e Inventário de Estoques',
    heroTitle: 'Controle e Inventário de Estoques',
    categoryTitle: 'Controle Patrimonial',
    description:
      'Executamos o controle e inventário de estoques com metodologia técnica para aumentar acuracidade, rastreabilidade e eficiência operacional.',
    metaTitle: 'Controle e Inventário de Estoques | Apollo Gestão',
    metaDescription:
      'Serviço de Controle e Inventário de Estoques da Apollo Gestão com diagnóstico, contagem e reconciliação para decisões confiáveis.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              { type: 'text', text: 'Inventário técnico para controle confiável de estoques' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Realizamos diagnóstico, planejamento e execução de inventários para mapear divergências, atualizar saldos e fortalecer o controle interno.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Nossa abordagem integra campo e análise para apoiar auditorias, conformidade contábil e ações práticas de melhoria na gestão de estoques.',
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

export default function ControleInventarioEstoquesPage() {
  return <SolutionDetailPage config={config} />
}
