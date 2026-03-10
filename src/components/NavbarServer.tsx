import { getPayloadClient } from '@/lib/payload'
import { resolveHeaderData } from '@/lib/navigation'
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

  const { navItems, ctaButton, socialLinks } = resolveHeaderData(headerData)

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
