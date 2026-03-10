import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'consultoria-e-tecnologia',
  solutionSlug: 'teste-de-impairment',
  fallbackData: {
    title: 'Teste de Impairment',
    heroTitle: 'Teste de Impairment',
    categoryTitle: 'Consultoria e Tecnologia',
    description:
      'Realizamos o teste de impairment para avaliar a recuperabilidade dos ativos, assegurar aderência às normas contábeis e apoiar decisões estratégicas com segurança técnica.',
    metaTitle: 'Teste de Impairment | Apollo Gestão',
    metaDescription:
      'Serviço de Teste de Impairment da Apollo Gestão para avaliação de recuperabilidade de ativos com aderência normativa e suporte à tomada de decisão.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              { type: 'text', text: 'Avaliação técnica de recuperabilidade com base normativa' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Conduzimos análises de impairment para identificar perdas no valor recuperável dos ativos, considerando premissas econômicas, operacionais e contábeis.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Com metodologia estruturada e documentação técnica, sua empresa fortalece compliance, reduz riscos em auditorias e toma decisões mais assertivas sobre seus ativos.',
              },
            ],
          },
        ],
      },
    },
    relatedSolutions: [
      {
        id: 'revisao-da-vida-util',
        title: 'Revisão da Vida Útil',
        href: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
      },
      {
        id: 'ativos-inteligentes-rfid-e-rtls',
        title: 'Ativos Inteligentes RFID/RTLS',
        href: '/solucoes/consultoria-e-tecnologia/ativos-inteligentes-rfid-e-rtls',
      },
      {
        id: 'arrendamento-mercantil-cpc-06-ifrs-16',
        title: 'Arrendamento Mercantil',
        href: '/solucoes/consultoria-e-tecnologia/arrendamento-mercantil-cpc-06-ifrs-16',
      },
    ],
  },
} satisfies SolutionDetailConfig

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionDetailMetadata(config)
}

export default function TesteDeImpairmentPage() {
  return <SolutionDetailPage config={config} />
}
