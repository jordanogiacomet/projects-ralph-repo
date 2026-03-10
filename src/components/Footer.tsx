import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { resolveHeaderData, type NavItem } from '@/lib/navigation'
import {
  FOOTER_DEFAULT_COPYRIGHT,
  FOOTER_DEFAULT_SOCIAL_LINKS,
  FOOTER_DEFAULT_UNIDADES,
  SITE_SETTINGS_DEFAULT_COOKIE_TEXT,
  SITE_SETTINGS_DEFAULT_WHATSAPP_MESSAGE,
  SITE_SETTINGS_DEFAULT_WHATSAPP_NUMBER,
} from '@/lib/constants'
import { Badge, Container } from '@/components/ui'
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

function buildFooterNavigation(navItems: NavItem[]) {
  return navItems.filter((item) => item.label.trim().toLowerCase() !== 'home')
}

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
  let headerNavItems: NavItem[] = buildFooterNavigation(resolveHeaderData(null).navItems)

  try {
    const payload = await getPayloadClient()
    const [footerGlobal, siteSettingsGlobal, headerGlobal] = await Promise.all([
      payload.findGlobal({ slug: 'footer' }),
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'header' }),
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

    headerNavItems = buildFooterNavigation(resolveHeaderData(headerGlobal).navItems)
  } catch {
    // Payload may not be available during static builds
  }

  const currentYear = new Date().getFullYear()
  const baseCopyright = footerData.copyrightText || FOOTER_DEFAULT_COPYRIGHT
  const copyrightText = `${baseCopyright} - ${currentYear}`

  return (
    <>
      <footer className="relative overflow-hidden bg-[#08111e] text-text-on-dark">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,86,166,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(217,232,248,0.1),transparent_28%)]" />

        <Container size="wide" className="relative py-16 sm:py-20">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:items-start">
            <div>
              <div className="max-w-2xl">
                <Badge tone="accent" className="bg-white/10 text-white">
                  Fale com especialistas
                </Badge>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-[2.65rem]">
                  Estruture ativos, avaliações e projetos com mais clareza, ritmo e governança.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/68 sm:text-base">
                  A Apollo combina profundidade técnica, visão consultiva e experiência operacional
                  para apoiar decisões patrimoniais mais seguras.
                </p>
              </div>

              <div className="mt-6">
                <FooterContactForm title="Solicite um retorno da equipe Apollo" />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_18px_50px_rgba(2,12,27,0.18)] backdrop-blur-sm sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                Presença nacional
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                Nossas unidades
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/68">
                Atendemos com unidades físicas no Rio Grande do Sul, Santa Catarina e São Paulo,
                apoiando operações em todo o Brasil.
              </p>
              <div className="mt-6">
                <FooterUnidades unidades={footerData.unidades || []} />
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="max-w-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                Apollo Gestão
              </p>
              <p className="mt-4 text-lg leading-8 text-white/74">
                Soluções em avaliação patrimonial, controle de ativos e consultoria técnica com foco
                em confiança institucional e execução precisa.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-sm text-white/48">Acompanhe a Apollo</span>
                <SocialLinks
                  links={footerData.socialLinks || []}
                  size="sm"
                  className="gap-2"
                  itemClassName="border-white/10 bg-white/6 text-white/76 shadow-none hover:border-white/20 hover:bg-white/10 hover:text-white"
                />
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {headerNavItems.map((item) => (
                <div key={item.id || item.label}>
                  {item.link ? (
                    <Link
                      href={item.link}
                      className="text-base font-semibold tracking-[-0.02em] text-white transition hover:text-white/78"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <h4 className="text-base font-semibold tracking-[-0.02em] text-white">
                      {item.label}
                    </h4>
                  )}

                  {item.children && item.children.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {item.children.map((child) => (
                        <li key={child.id || child.label}>
                          {child.link ? (
                            <Link
                              href={child.link}
                              className="text-sm leading-6 text-white/62 transition hover:text-white"
                            >
                              {child.label}
                            </Link>
                          ) : (
                            <span className="text-sm leading-6 text-white/52">{child.label}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-white/52">
                      Navegação institucional principal da Apollo Gestão.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/60">{copyrightText}</p>
            <p className="text-sm text-white/46">
              Atendimento consultivo com cobertura nacional e operação multissetorial.
            </p>
          </div>
        </Container>
      </footer>

      <WhatsAppFloat number={siteSettings.whatsappNumber} message={siteSettings.whatsappMessage} />
      <ScrollToTop />
      <CookieConsent text={siteSettings.cookieConsentText} />
    </>
  )
}
