import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { Navbar } from './Navbar'

type NavbarServerProps = {
  isHeroPage?: boolean
}

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

  return (
    <Navbar
      logo={logo as { url?: string; alt?: string; width?: number; height?: number } | null}
      logoNegativo={
        logoNegativo as { url?: string; alt?: string; width?: number; height?: number } | null
      }
      navItems={(headerData?.navItems as NavItem[]) || []}
      ctaButton={
        headerData?.ctaButton as { label?: string; link?: string } | undefined
      }
      socialLinks={
        (headerData?.socialLinks as SocialLink[]) || []
      }
      isHeroPage={isHeroPage}
    />
  )
}

type NavItem = {
  label: string
  link?: string
  children?: {
    label: string
    link?: string
    description?: string
    children?: { label: string; link?: string; id?: string }[]
    id?: string
  }[]
  id?: string
}

type SocialLink = {
  platform?: string
  url?: string
  id?: string
}
