import { getPayloadClient } from '@/lib/payload'
import {
  FOOTER_DEFAULT_COPYRIGHT,
  FOOTER_DEFAULT_SOCIAL_LINKS,
  FOOTER_DEFAULT_UNIDADES,
  SITE_SETTINGS_DEFAULT_COOKIE_TEXT,
  SITE_SETTINGS_DEFAULT_WHATSAPP_MESSAGE,
  SITE_SETTINGS_DEFAULT_WHATSAPP_NUMBER,
} from '@/lib/constants'
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

const hasString = (value?: string): value is string =>
  typeof value === 'string' && value.trim().length > 0

const hasItems = <T,>(value?: T[]): value is T[] => Array.isArray(value) && value.length > 0

export async function Footer() {
  let footerData: FooterGlobalData = {
    unidades: FOOTER_DEFAULT_UNIDADES,
    socialLinks: FOOTER_DEFAULT_SOCIAL_LINKS,
    copyrightText: FOOTER_DEFAULT_COPYRIGHT,
  }
  let siteSettings: SiteSettingsData = {
    whatsappNumber: SITE_SETTINGS_DEFAULT_WHATSAPP_NUMBER,
    whatsappMessage: SITE_SETTINGS_DEFAULT_WHATSAPP_MESSAGE,
    cookieConsentText: SITE_SETTINGS_DEFAULT_COOKIE_TEXT,
  }

  try {
    const payload = await getPayloadClient()
    const [footerGlobal, siteSettingsGlobal] = await Promise.all([
      payload.findGlobal({ slug: 'footer' }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])

    const footerFromCMS = footerGlobal as unknown as FooterGlobalData
    const siteSettingsFromCMS = siteSettingsGlobal as unknown as SiteSettingsData

    footerData = {
      ...footerData,
      ...footerFromCMS,
      unidades: hasItems(footerFromCMS.unidades) ? footerFromCMS.unidades : footerData.unidades,
      socialLinks: hasItems(footerFromCMS.socialLinks)
        ? footerFromCMS.socialLinks
        : footerData.socialLinks,
      copyrightText: hasString(footerFromCMS.copyrightText)
        ? footerFromCMS.copyrightText
        : footerData.copyrightText,
    }

    siteSettings = {
      ...siteSettings,
      ...siteSettingsFromCMS,
      whatsappNumber: hasString(siteSettingsFromCMS.whatsappNumber)
        ? siteSettingsFromCMS.whatsappNumber
        : siteSettings.whatsappNumber,
      whatsappMessage: hasString(siteSettingsFromCMS.whatsappMessage)
        ? siteSettingsFromCMS.whatsappMessage
        : siteSettings.whatsappMessage,
      cookieConsentText: hasString(siteSettingsFromCMS.cookieConsentText)
        ? siteSettingsFromCMS.cookieConsentText
        : siteSettings.cookieConsentText,
    }
  } catch {
    // Payload may not be available during static builds
  }

  const currentYear = new Date().getFullYear()
  const baseCopyright = footerData.copyrightText || FOOTER_DEFAULT_COPYRIGHT
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
