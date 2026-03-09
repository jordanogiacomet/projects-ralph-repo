import { getPayloadClient } from '@/lib/payload'
import { FooterContactForm } from './FooterContactForm'
import { FooterUnidades } from './FooterUnidades'
import { SocialLinks } from './SocialLinks'
import { ScrollToTop } from './ScrollToTop'
import { CookieConsent } from './CookieConsent'
import { WhatsAppFloat } from './WhatsAppFloat'

type SocialLink = {
  platform?: string
  url?: string
  id?: string
}

type Unidade = {
  id?: string
  name?: string
  state?: string
  address?: string
  phone?: string
  email?: string
}

type FooterGlobalData = {
  unidades?: Unidade[]
  socialLinks?: SocialLink[]
  copyrightText?: string
}

type SiteSettingsData = {
  whatsappNumber?: string
  whatsappMessage?: string
  cookieConsentText?: string
}

export async function Footer() {
  let footerData: FooterGlobalData = {}
  let siteSettings: SiteSettingsData = {}

  try {
    const payload = await getPayloadClient()
    const [footerGlobal, siteSettingsGlobal] = await Promise.all([
      payload.findGlobal({ slug: 'footer' }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])

    footerData = footerGlobal as unknown as FooterGlobalData
    siteSettings = siteSettingsGlobal as unknown as SiteSettingsData
  } catch {
    // Payload may not be available during static builds
  }

  const currentYear = new Date().getFullYear()
  const baseCopyright = footerData.copyrightText || '© Copyright - Apollo Gestão Empreendedora'
  const copyrightText = `${baseCopyright} - ${currentYear}`

  return (
    <>
      <footer className="bg-bg-dark-section text-text-on-dark">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <FooterContactForm />
            <div>
              <h3 className="text-2xl font-semibold text-text-on-dark">Nossas unidades</h3>
              <p className="mt-2 text-sm text-white/75">
                Atendemos com unidades físicas no Rio Grande do Sul, Santa Catarina e São Paulo.
              </p>
              <div className="mt-5">
                <FooterUnidades unidades={footerData.unidades || []} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p className="text-sm text-white/80">{copyrightText}</p>
            <SocialLinks
              links={footerData.socialLinks || []}
              className="gap-4"
              iconClassName="text-white/80 hover:text-white"
            />
          </div>
        </div>
      </footer>

      <WhatsAppFloat
        number={siteSettings.whatsappNumber}
        message={siteSettings.whatsappMessage}
      />
      <ScrollToTop />
      <CookieConsent text={siteSettings.cookieConsentText} />
    </>
  )
}
