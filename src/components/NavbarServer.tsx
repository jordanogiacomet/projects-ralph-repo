import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { Navbar } from './Navbar'

type NavbarServerProps = {
  isHeroPage?: boolean
}

type NavChildItem = {
  label: string
  link?: string
  id?: string
}

type NavChild = {
  label: string
  link?: string
  description?: string
  children?: NavChildItem[]
  id?: string
}

type NavItem = {
  label: string
  link?: string
  children?: NavChild[]
  id?: string
}

type SocialLink = {
  platform?: string
  url?: string
  id?: string
}

const fallbackNavItems: NavItem[] = [
  {
    id: 'solucoes',
    label: 'Soluções',
    link: '/solucoes',
    children: [
      {
        id: 'controle-patrimonial',
        label: 'Controle Patrimonial',
        link: '/solucoes/controle-patrimonial',
        children: [
          {
            id: 'identificacao-patrimonial',
            label: 'Identificação Patrimonial',
            link: '/solucoes/controle-patrimonial/etiquetas-patrimoniais-inteligentes',
          },
          {
            id: 'inventario-estoques',
            label: 'Inventário de Estoques',
            link: '/solucoes/controle-patrimonial/controle-e-inventario-de-estoques',
          },
          {
            id: 'organizacao-patrimonial',
            label: 'Organização Patrimonial',
            link: '/solucoes/controle-patrimonial/organizacao-patrimonial',
          },
          {
            id: 'processamento-patrimonial',
            label: 'Processamento Patrimonial',
            link: '/solucoes/controle-patrimonial/processamento-patrimonial',
          },
        ],
      },
      {
        id: 'consultoria-tecnologia',
        label: 'Consultoria e Tecnologia',
        link: '/solucoes/consultoria-e-tecnologia',
        children: [
          {
            id: 'teste-impairment',
            label: 'Teste de Impairment',
            link: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
          },
          {
            id: 'revisao-vida-util',
            label: 'Revisão da Vida Útil',
            link: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
          },
          {
            id: 'ativos-inteligentes',
            label: 'Ativos Inteligentes RFID/RTLS',
            link: '/solucoes/consultoria-e-tecnologia/ativos-inteligentes-rfid-rtls',
          },
          {
            id: 'arrendamento-mercantil',
            label: 'Arrendamento Mercantil',
            link: '/solucoes/consultoria-e-tecnologia/arrendamento-mercantil',
          },
          {
            id: 'combinacao-negocios',
            label: 'Combinação de Negócios',
            link: '/solucoes/consultoria-e-tecnologia/combinacao-de-negocios-ppa-cpc-15',
          },
          {
            id: 'softwares',
            label: 'Softwares',
            link: '/solucoes/consultoria-e-tecnologia/softwares',
          },
        ],
      },
      {
        id: 'avaliacao-patrimonial',
        label: 'Avaliação Patrimonial',
        link: '/solucoes/avaliacao-patrimonial',
        children: [
          {
            id: 'avaliacao-ativos',
            label: 'Avaliação de Ativos',
            link: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos',
          },
          {
            id: 'avaliacao-biologicos',
            label: 'Avaliação de Ativos Biológicos',
            link: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos-biologicos',
          },
          {
            id: 'avaliacao-imoveis',
            label: 'Avaliação de Imóveis',
            link: '/solucoes/avaliacao-patrimonial/avaliacao-de-imoveis-urbanos-e-rurais',
          },
          {
            id: 'avaliacao-maquinas',
            label: 'Avaliação de Máquinas',
            link: '/solucoes/avaliacao-patrimonial/avaliacao-de-maquinas',
          },
        ],
      },
    ],
  },
  {
    id: 'clientes',
    label: 'Clientes',
    link: '/clientes',
  },
  {
    id: 'contato',
    label: 'Contato',
    children: [
      {
        id: 'cotacao',
        label: 'Cotação',
        link: '/contato/cotacao',
      },
      {
        id: 'representante',
        label: 'Representante',
        link: '/contato/representante',
      },
    ],
  },
  {
    id: 'sobre',
    label: 'Sobre',
    link: '/sobre',
  },
  {
    id: 'conteudos',
    label: 'Conteúdos',
    link: '/conteudos',
  },
  {
    id: 'news',
    label: 'News',
    link: '/news',
  },
  {
    id: 'home',
    label: 'Home',
    link: '/',
  },
]

const fallbackCTAButton = {
  label: 'Cotação',
  link: '/contato/cotacao',
}

const fallbackSocialLinks: SocialLink[] = [
  {
    id: 'instagram',
    platform: 'instagram',
    url: 'https://www.instagram.com',
  },
  {
    id: 'facebook',
    platform: 'facebook',
    url: 'https://www.facebook.com',
  },
  {
    id: 'youtube',
    platform: 'youtube',
    url: 'https://www.youtube.com',
  },
  {
    id: 'whatsapp',
    platform: 'whatsapp',
    url: 'https://wa.me/5500000000000',
  },
  {
    id: 'linkedin',
    platform: 'linkedin',
    url: 'https://www.linkedin.com',
  },
  {
    id: 'x',
    platform: 'x',
    url: 'https://x.com',
  },
]

export async function NavbarServer({ isHeroPage = false }: NavbarServerProps) {
  let headerData = null

  try {
    const payload = await getPayloadClient()
    headerData = await payload.findGlobal({ slug: 'header' })
  } catch {
    // Payload not available (e.g., during build without DB)
  }

  const logo = headerData?.logo && typeof headerData.logo === 'object' ? headerData.logo : null
  const logoNegativo =
    headerData?.logoNegativo && typeof headerData.logoNegativo === 'object'
      ? headerData.logoNegativo
      : null

  const navItems =
    Array.isArray(headerData?.navItems) && headerData.navItems.length > 0
      ? (headerData.navItems as NavItem[])
      : fallbackNavItems

  const ctaButton =
    headerData?.ctaButton?.label && headerData?.ctaButton?.link
      ? (headerData.ctaButton as { label?: string; link?: string })
      : fallbackCTAButton

  const socialLinks =
    Array.isArray(headerData?.socialLinks) && headerData.socialLinks.length > 0
      ? (headerData.socialLinks as SocialLink[])
      : fallbackSocialLinks

  return (
    <Navbar
      logo={logo as { url?: string; alt?: string; width?: number; height?: number } | null}
      logoNegativo={
        logoNegativo as { url?: string; alt?: string; width?: number; height?: number } | null
      }
      navItems={navItems}
      ctaButton={ctaButton}
      socialLinks={socialLinks}
      isHeroPage={isHeroPage}
    />
  )
}
