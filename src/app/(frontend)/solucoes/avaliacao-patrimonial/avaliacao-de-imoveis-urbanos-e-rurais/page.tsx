import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'avaliacao-patrimonial',
  solutionSlug: 'avaliacao-de-imoveis-urbanos-e-rurais',
  fallbackData: {
    title: 'Avaliação de Imóveis Urbanos e Rurais',
    heroTitle: 'Avaliação de Imóveis Urbanos e Rurais',
    categoryTitle: 'Avaliação Patrimonial',
    description:
      'Realizamos avaliações imobiliárias urbanas e rurais com metodologia técnica, aderência normativa e suporte especializado para decisões patrimoniais seguras.',
    metaTitle: 'Avaliação de Imóveis Urbanos e Rurais | Apollo Gestão',
    metaDescription:
      'Serviço de Avaliação de Imóveis Urbanos e Rurais da Apollo Gestão com laudos técnicos, análise de mercado e suporte para compliance e gestão patrimonial.',
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
                text: 'Avaliação imobiliária com segurança técnica e aderência às normas',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Conduzimos avaliações de imóveis urbanos e rurais com inspeção técnica, estudo de mercado e análise das características específicas de cada ativo.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Os laudos entregues apoiam auditorias, operações societárias, garantias e tomadas de decisão com maior confiabilidade patrimonial.',
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
        id: 'avaliacao-de-ativos-biologicos',
        title: 'Avaliação de Ativos Biológicos',
        href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos-biologicos',
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

export default function AvaliacaoDeImoveisUrbanosERuraisPage() {
  return <SolutionDetailPage config={config} />
}
