import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'avaliacao-patrimonial',
  solutionSlug: 'avaliacao-de-maquinas',
  fallbackData: {
    title: 'Avaliação de Máquinas',
    heroTitle: 'Avaliação de Máquinas',
    categoryTitle: 'Avaliação Patrimonial',
    description:
      'Executamos avaliação de máquinas e equipamentos com abordagem técnica, rastreável e aderente às normas para apoiar decisões contábeis, operacionais e estratégicas.',
    metaTitle: 'Avaliação de Máquinas | Apollo Gestão',
    metaDescription:
      'Serviço de Avaliação de Máquinas da Apollo Gestão com laudos técnicos, análise de mercado e suporte para compliance e gestão patrimonial.',
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
                text: 'Avaliação de máquinas com precisão técnica e aderência normativa',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Conduzimos inspeções e análises de máquinas e equipamentos considerando estado de conservação, vida útil remanescente, reposição e parâmetros de mercado.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Os laudos resultantes suportam auditorias, garantias, operações societárias e planejamento patrimonial com maior segurança e confiabilidade.',
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
        id: 'avaliacao-de-imoveis-urbanos-e-rurais',
        title: 'Avaliação de Imóveis Urbanos e Rurais',
        href: '/solucoes/avaliacao-patrimonial/avaliacao-de-imoveis-urbanos-e-rurais',
      },
    ],
  },
} satisfies SolutionDetailConfig

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionDetailMetadata(config)
}

export default function AvaliacaoDeMaquinasPage() {
  return <SolutionDetailPage config={config} />
}
