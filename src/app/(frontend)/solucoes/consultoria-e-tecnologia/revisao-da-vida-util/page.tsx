import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'consultoria-e-tecnologia',
  solutionSlug: 'revisao-da-vida-util',
  fallbackData: {
    title: 'Revisão da Vida Útil',
    heroTitle: 'Revisão da Vida Útil',
    categoryTitle: 'Consultoria e Tecnologia',
    description:
      'Atualizamos vidas úteis e taxas de depreciação dos ativos com base em critérios técnicos e aderência ao CPC 27, trazendo mais precisão para a gestão contábil e patrimonial.',
    metaTitle: 'Revisão da Vida Útil | Apollo Gestão',
    metaDescription:
      'Serviço de Revisão da Vida Útil da Apollo Gestão para atualização técnica de depreciação, aderência ao CPC 27 e maior precisão contábil.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              { type: 'text', text: 'Depreciação aderente à realidade operacional e ao CPC 27' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'A Revisão da Vida Útil reavalia o tempo de uso econômico dos bens e as taxas de depreciação aplicadas, considerando condição física, obsolescência e padrão de utilização.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Com metodologia estruturada e documentação técnica, sua empresa reduz distorções contábeis, fortalece compliance e melhora a qualidade das decisões sobre investimentos e reposição de ativos.',
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

export default function RevisaoDaVidaUtilPage() {
  return <SolutionDetailPage config={config} />
}
