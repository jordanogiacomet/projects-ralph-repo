import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'consultoria-e-tecnologia',
  solutionSlug: 'ativos-inteligentes-rfid-rtls',
  legacySolutionSlug: 'ativos-inteligentes-rfid-e-rtls',
  fallbackData: {
    title: 'Ativos Inteligentes RFID e RTLS',
    heroTitle: 'Ativos Inteligentes RFID e RTLS',
    categoryTitle: 'Consultoria e Tecnologia',
    description:
      'Aplicamos tecnologias RFID e RTLS para rastrear, localizar e monitorar ativos em tempo real, aumentando controle operacional, acuracidade e produtividade.',
    metaTitle: 'Ativos Inteligentes RFID e RTLS | Apollo Gestão',
    metaDescription:
      'Solução de Ativos Inteligentes RFID e RTLS da Apollo Gestão para rastreabilidade em tempo real, inventário contínuo e eficiência operacional.',
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
                text: 'Rastreabilidade em tempo real para elevar o controle patrimonial',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Com RFID e RTLS, sua empresa passa a identificar e localizar ativos com rapidez, reduzindo perdas, retrabalho e tempo de inventário em operações distribuídas.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'A Apollo integra tecnologia, processo e inteligência de dados para apoiar decisões com base em movimentação real dos ativos, fortalecendo governança e eficiência operacional.',
              },
            ],
          },
        ],
      },
    },
    relatedSolutions: [
      {
        id: 'teste-de-impairment',
        title: 'Teste de Impairment',
        href: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
      },
      {
        id: 'revisao-da-vida-util',
        title: 'Revisão da Vida Útil',
        href: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
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

export default function AtivosInteligentesRfidRtlsPage() {
  return <SolutionDetailPage config={config} />
}
