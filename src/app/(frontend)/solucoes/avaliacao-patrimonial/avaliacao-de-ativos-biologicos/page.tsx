import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'avaliacao-patrimonial',
  solutionSlug: 'avaliacao-de-ativos-biologicos',
  fallbackData: {
    title: 'Avaliação de Ativos Biológicos',
    heroTitle: 'Avaliação de Ativos Biológicos',
    categoryTitle: 'Avaliação Patrimonial',
    description:
      'Executamos avaliações de ativos biológicos com base técnica e aderência normativa para suportar mensuração contábil, auditoria e gestão de risco.',
    metaTitle: 'Avaliação de Ativos Biológicos | Apollo Gestão',
    metaDescription:
      'Serviço de Avaliação de Ativos Biológicos da Apollo Gestão com metodologia técnica, premissas econômicas e suporte para compliance contábil.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              {
                type: 'text',
                text: 'Avaliação de ativos biológicos com critério técnico e segurança regulatória',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Nossa equipe estrutura premissas produtivas e econômicas para mensurar ativos biológicos em diferentes estágios, com rastreabilidade dos dados e transparência metodológica.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Entregamos laudos técnicos que apoiam auditorias, fechamento contábil e decisões estratégicas sobre desempenho, rentabilidade e gestão patrimonial.',
              },
            ],
          },
        ],
      },
    },
    relatedSolutions: [
      {
        id: 'avaliacao-de-ativos',
        title: 'Avaliação de Ativos',
        href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos',
      },
      {
        id: 'avaliacao-de-imoveis-urbanos-e-rurais',
        title: 'Avaliação de Imóveis Urbanos e Rurais',
        href: '/solucoes/avaliacao-patrimonial/avaliacao-de-imoveis-urbanos-e-rurais',
      },
      {
        id: 'avaliacao-de-maquinas',
        title: 'Avaliação de Máquinas',
        href: '/solucoes/avaliacao-patrimonial/avaliacao-de-maquinas',
      },
    ],
  },
} satisfies SolutionDetailConfig

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionDetailMetadata(config)
}

export default function AvaliacaoDeAtivosBiologicosPage() {
  return <SolutionDetailPage config={config} />
}
