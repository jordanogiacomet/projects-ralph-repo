import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'consultoria-e-tecnologia',
  solutionSlug: 'softwares',
  fallbackData: {
    title: 'Softwares',
    heroTitle: 'Softwares',
    categoryTitle: 'Consultoria e Tecnologia',
    description:
      'Disponibilizamos soluções de software para inventário, rastreabilidade e gestão integrada de ativos, conectando operação e contabilidade com dados confiáveis.',
    metaTitle: 'Softwares | Apollo Gestão',
    metaDescription:
      'Soluções de software da Apollo Gestão para inventário, rastreamento e gestão patrimonial com inteligência de dados e maior controle operacional.',
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
                text: 'Plataformas para controle patrimonial com rastreabilidade e visão gerencial',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Nossos softwares apoiam todo o ciclo de gestão dos ativos, desde inventário e etiquetagem até consolidação de dados para auditoria, compliance e tomada de decisão.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Com integrações, painéis e trilhas de rastreabilidade, sua empresa ganha produtividade, reduz retrabalho e aumenta a confiabilidade das informações patrimoniais.',
              },
            ],
          },
        ],
      },
    },
    relatedSolutions: [
      {
        id: 'ativos-inteligentes-rfid-rtls',
        title: 'Ativos Inteligentes RFID/RTLS',
        href: '/solucoes/consultoria-e-tecnologia/ativos-inteligentes-rfid-rtls',
      },
      {
        id: 'revisao-da-vida-util',
        title: 'Revisão da Vida Útil',
        href: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
      },
      {
        id: 'teste-de-impairment',
        title: 'Teste de Impairment',
        href: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
      },
    ],
  },
} satisfies SolutionDetailConfig

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionDetailMetadata(config)
}

export default function SoftwaresPage() {
  return <SolutionDetailPage config={config} />
}
