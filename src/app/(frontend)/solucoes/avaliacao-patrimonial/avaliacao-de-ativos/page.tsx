import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'avaliacao-patrimonial',
  solutionSlug: 'avaliacao-de-ativos',
  fallbackData: {
    title: 'Avaliação de Ativos',
    heroTitle: 'Avaliação de Ativos',
    categoryTitle: 'Avaliação Patrimonial',
    description:
      'Realizamos avaliação técnica de ativos para apoiar decisões estratégicas, atender exigências contábeis e aumentar a confiabilidade das informações patrimoniais.',
    metaTitle: 'Avaliação de Ativos | Apollo Gestão',
    metaDescription:
      'Serviço de Avaliação de Ativos da Apollo Gestão com metodologia técnica, rastreabilidade e suporte para compliance contábil e gerencial.',
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
                text: 'Avaliação de ativos com critério técnico e foco em decisão',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Nossa equipe realiza levantamentos e análises para determinar valores de ativos com base em normas técnicas, premissas econômicas e evidências de mercado.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'O resultado é um laudo consistente para apoiar auditorias, processos de compliance e tomadas de decisão com mais segurança.',
              },
            ],
          },
        ],
      },
    },
    relatedSolutions: [
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

export default function AvaliacaoDeAtivosPage() {
  return <SolutionDetailPage config={config} />
}
