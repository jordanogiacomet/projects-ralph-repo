'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { CTAButton, NavItem, SocialLink } from '@/lib/navigation'
import { navItemMatchesPath, normalizePathname } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Button, Container } from '@/components/ui'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { SearchOverlay } from './SearchOverlay'
import { SocialLinks } from './SocialLinks'

type MediaField = {
  url?: string
  alt?: string
  width?: number
  height?: number
} | null

type NavbarProps = {
  logo?: MediaField
  logoNegativo?: MediaField
  navItems?: NavItem[]
  ctaButton?: CTAButton
  socialLinks?: SocialLink[]
  isHeroPage?: boolean
}

const HERO_TRANSPARENT_ROUTES = new Set([
  '/',
  '/sobre',
  '/solucoes',
  '/solucoes/controle-patrimonial',
  '/solucoes/consultoria-e-tecnologia',
  '/solucoes/avaliacao-patrimonial',
])

export function Navbar({
  logo,
  logoNegativo,
  navItems = [],
  ctaButton,
  socialLinks,
  isHeroPage = false,
}: NavbarProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMegaMenu = useCallback(() => {
    setMegaMenuOpen(false)
    setActiveDropdown(null)
  }, [])

  const normalizedPath = normalizePathname(pathname)
  const isHeroRoute = HERO_TRANSPARENT_ROUTES.has(normalizedPath)
  const usesTransparentNavbar = isHeroPage || isHeroRoute
  const isTransparent = usesTransparentNavbar && !scrolled && !megaMenuOpen
  const currentLogo = isTransparent ? logoNegativo || logo : logo

  useEffect(() => {
    closeMegaMenu()
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [closeMegaMenu, normalizedPath])

  const navSurfaceClass = cn(
    'relative overflow-hidden rounded-[34px] border backdrop-blur-2xl transition-all duration-300',
    isTransparent
      ? 'border-white/12 bg-[linear-gradient(135deg,rgba(10,18,32,0.78)_0%,rgba(22,32,51,0.56)_100%)] shadow-[0_24px_60px_rgba(2,12,27,0.22)]'
      : 'border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(246,248,251,0.94)_100%)] shadow-[0_24px_60px_rgba(15,23,42,0.14)]',
  )
  const desktopUtilityClass = cn(
    'hidden items-center gap-2 rounded-pill border px-2 py-2 lg:flex',
    isTransparent
      ? 'border-white/10 bg-white/[0.06] text-white/62'
      : 'border-border/70 bg-white/72 text-text-muted shadow-soft',
  )
  const desktopGroupClass = cn(
    'hidden items-center gap-1 rounded-pill border px-2.5 py-2 lg:inline-flex',
    isTransparent
      ? 'border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
      : 'border-border/70 bg-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]',
  )
  const desktopLinkClass = (active: boolean) =>
    cn(
      'rounded-pill px-4 py-2.5 text-body-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15',
      isTransparent
        ? 'text-white/80 hover:bg-white/10 hover:text-white'
        : 'text-text-secondary hover:bg-white hover:text-text-primary',
      active &&
        (isTransparent
          ? 'bg-white text-bg-dark-section shadow-soft'
          : 'bg-white text-accent shadow-soft'),
    )
  const iconButtonClass = cn(
    'inline-flex items-center justify-center rounded-pill border transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15',
    isTransparent
      ? 'border-white/10 bg-white/[0.06] text-white/82 hover:bg-white/12 hover:text-white'
      : 'border-border/70 bg-surface-secondary/80 text-text-secondary hover:border-accent/20 hover:bg-white hover:text-text-primary',
  )
  const brandTagClass = cn(
    'hidden xl:inline-flex items-center rounded-pill border px-3 py-1 text-label-sm font-semibold uppercase tracking-[0.22em]',
    isTransparent
      ? 'border-white/10 bg-white/[0.05] text-white/62'
      : 'border-border/70 bg-white/76 text-text-muted',
  )
  const utilityDividerClass = cn(
    'hidden h-6 w-px 2xl:block',
    isTransparent ? 'bg-white/10' : 'bg-border',
  )
  const ctaClass = cn(
    'rounded-pill border px-5 shadow-[0_20px_40px_rgba(31,138,56,0.22)]',
    isTransparent ? 'border-white/10' : 'border-cta-green/20',
  )

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <Container
          size="wide"
          className={cn(
            'transition-all duration-300',
            isTransparent ? 'pt-3.5 lg:pt-5' : 'pt-3.5 lg:pt-4',
          )}
        >
          <div className="relative">
            <div className={navSurfaceClass}>
              <div
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-x-0 top-0 h-px',
                  isTransparent ? 'bg-white/20' : 'bg-white/90',
                )}
              />
              <nav
                className="flex h-[70px] items-center justify-between gap-3 px-4 sm:px-5 lg:h-[88px] lg:px-7 xl:px-8"
                aria-label="Navegação principal"
              >
                <Link
                  href="/"
                  className="flex min-w-0 items-center gap-3 xl:gap-4"
                  aria-label="Apollo Gestão - Página inicial"
                >
                  {currentLogo?.url ? (
                    <Image
                      src={currentLogo.url}
                      alt={currentLogo.alt || 'Apollo Gestão'}
                      width={currentLogo.width || 190}
                      height={currentLogo.height || 44}
                      sizes="(min-width: 1280px) 190px, (min-width: 1024px) 168px, 144px"
                      className="h-8 w-auto sm:h-9 lg:h-10 xl:h-11"
                      priority
                    />
                  ) : (
                    <span
                      className={cn(
                        'font-display text-lg font-bold tracking-[-0.03em] transition-colors sm:text-xl',
                        isTransparent ? 'text-text-on-dark' : 'text-accent',
                      )}
                    >
                      Apollo Gestão
                    </span>
                  )}
                  <span className={brandTagClass}>Avaliações e Controle Patrimonial</span>
                </Link>

                <div className="hidden flex-1 justify-center px-4 lg:flex">
                  <div className={desktopGroupClass}>
                    {navItems.map((item) => {
                      const key = item.id || item.label
                      const hasChildren = (item.children?.length ?? 0) > 0
                      const isActive = navItemMatchesPath(item, normalizedPath)

                      return (
                        <div
                          key={key}
                          className="relative"
                          onMouseEnter={() => {
                            if (!hasChildren) return
                            setMegaMenuOpen(true)
                            setActiveDropdown(key)
                          }}
                        >
                          {item.link && !hasChildren ? (
                            <Link
                              href={item.link}
                              aria-current={isActive ? 'page' : undefined}
                              className={desktopLinkClass(isActive)}
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className={desktopLinkClass(isActive || activeDropdown === key)}
                              aria-expanded={activeDropdown === key}
                              aria-haspopup="true"
                              onClick={() => {
                                if (!hasChildren) return

                                if (activeDropdown === key) {
                                  closeMegaMenu()
                                  return
                                }

                                setMegaMenuOpen(true)
                                setActiveDropdown(key)
                              }}
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <span>{item.label}</span>
                                {hasChildren ? (
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className={cn(
                                      'h-3.5 w-3.5 transition-transform',
                                      activeDropdown === key && 'rotate-180',
                                    )}
                                  >
                                    <path d="m6 9 6 6 6-6" />
                                  </svg>
                                ) : null}
                              </span>
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="hidden items-center gap-3 lg:flex">
                  <div className={desktopUtilityClass}>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(true)}
                      className={cn(iconButtonClass, 'h-10 gap-2 px-3.5')}
                      aria-label="Abrir busca"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-[1.125rem] w-[1.125rem]"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      <span className="hidden text-sm font-semibold xl:inline">Buscar</span>
                    </button>

                    {socialLinks && socialLinks.length > 0 ? (
                      <>
                        <span aria-hidden="true" className={utilityDividerClass} />
                        <SocialLinks
                          links={socialLinks}
                          size="sm"
                          className="hidden 2xl:flex gap-1.5"
                          itemClassName={cn(
                            'h-8 w-8 shadow-none',
                            isTransparent
                              ? 'border-white/10 bg-white/[0.03] text-white/68 hover:border-white/20 hover:bg-white/[0.1] hover:text-white'
                              : 'border-border/70 bg-white text-text-muted hover:border-accent/20 hover:text-accent',
                          )}
                        />
                      </>
                    ) : null}
                  </div>

                  {ctaButton?.label && ctaButton?.link ? (
                    <Button
                      href={ctaButton.link}
                      variant="success"
                      trailingIcon={
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="h-4 w-4"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 5 7 7-7 7" />
                        </svg>
                      }
                      className={cn('min-h-12', ctaClass)}
                    >
                      {ctaButton.label}
                    </Button>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                  {ctaButton?.label && ctaButton?.link ? (
                    <Button
                      href={ctaButton.link}
                      variant="success"
                      size="sm"
                      className="hidden rounded-pill px-4 shadow-[0_16px_30px_rgba(31,138,56,0.2)] sm:inline-flex"
                    >
                      {ctaButton.label}
                    </Button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className={cn(iconButtonClass, 'h-11 w-11')}
                    aria-label="Abrir busca"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-5 w-5"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className={cn(iconButtonClass, 'h-11 w-11')}
                    aria-label="Abrir menu de navegação"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-5.5 w-5.5"
                    >
                      <path d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                  </button>
                </div>
              </nav>
            </div>

            {navItems.map((item) => {
              const key = item.id || item.label

              if (!item.children || item.children.length === 0) return null

              return (
                <MegaMenu
                  key={key}
                  isOpen={megaMenuOpen && activeDropdown === key}
                  title={item.label}
                  href={item.link}
                  items={item.children}
                  onClose={closeMegaMenu}
                />
              )
            })}
          </div>
        </Container>
      </header>

      {!usesTransparentNavbar ? (
        <div className={cn('h-[96px]', 'lg:h-[120px]')} aria-hidden="true" />
      ) : null}

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSearchOpen={() => setSearchOpen(true)}
        navItems={navItems}
        ctaButton={ctaButton}
        socialLinks={socialLinks}
      />

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
