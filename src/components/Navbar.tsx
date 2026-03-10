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
    'rounded-[30px] border backdrop-blur-xl transition-all duration-300',
    isTransparent
      ? 'border-white/12 bg-white/[0.08] shadow-[0_18px_48px_rgba(2,12,27,0.18)]'
      : 'border-white/70 bg-white/92 shadow-[0_18px_52px_rgba(15,23,42,0.14)]',
  )
  const utilitySurfaceClass = cn(
    'inline-flex items-center gap-3 rounded-pill border px-3 py-1.5 backdrop-blur-xl transition-all duration-300',
    isTransparent
      ? 'border-white/12 bg-white/[0.08] text-white/58'
      : 'border-white/70 bg-white/78 text-text-muted shadow-soft',
  )
  const desktopGroupClass = cn(
    'hidden lg:flex items-center gap-1 rounded-pill border px-2 py-1.5',
    isTransparent ? 'border-white/10 bg-white/[0.04]' : 'border-border/70 bg-surface-secondary/80',
  )
  const desktopLinkClass = (active: boolean) =>
    cn(
      'rounded-pill px-4 py-2.5 text-[0.95rem] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15',
      isTransparent
        ? 'text-white/82 hover:bg-white/10 hover:text-white'
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

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <Container
          size="wide"
          className={cn('transition-all duration-300', isTransparent ? 'pt-3 lg:pt-4' : 'pt-3')}
        >
          {socialLinks && socialLinks.length > 0 ? (
            <div className="hidden justify-end pb-2 lg:flex">
              <div className={utilitySurfaceClass}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">
                  Acompanhe
                </span>
                <SocialLinks
                  links={socialLinks}
                  size="sm"
                  className="gap-2"
                  itemClassName={cn(
                    'shadow-none',
                    isTransparent
                      ? 'border-white/10 bg-white/[0.03] text-white/72 hover:border-white/20 hover:bg-white/[0.1] hover:text-white'
                      : 'border-border/70 bg-white text-text-muted hover:border-accent/20 hover:text-accent',
                  )}
                />
              </div>
            </div>
          ) : null}

          <div className="relative">
            <div className={navSurfaceClass}>
              <nav
                className="flex h-[66px] items-center justify-between gap-3 px-4 sm:px-5 lg:h-[80px] lg:px-7"
                aria-label="Navegação principal"
              >
                <Link
                  href="/"
                  className="flex min-w-0 items-center gap-3"
                  aria-label="Apollo Gestão - Página inicial"
                >
                  {currentLogo?.url ? (
                    <Image
                      src={currentLogo.url}
                      alt={currentLogo.alt || 'Apollo Gestão'}
                      width={currentLogo.width || 190}
                      height={currentLogo.height || 44}
                      sizes="(min-width: 1280px) 190px, (min-width: 1024px) 168px, 144px"
                      className="h-8 w-auto sm:h-9 lg:h-10"
                      priority
                    />
                  ) : (
                    <span
                      className={cn(
                        'text-lg font-bold tracking-[-0.03em] transition-colors sm:text-xl',
                        isTransparent ? 'text-text-on-dark' : 'text-accent',
                      )}
                    >
                      Apollo Gestão
                    </span>
                  )}
                  <span
                    className={cn(
                      'hidden min-[1180px]:block text-[11px] font-semibold uppercase tracking-[0.22em]',
                      isTransparent ? 'text-white/42' : 'text-text-muted',
                    )}
                  >
                    Avaliações e Controle Patrimonial
                  </span>
                </Link>

                <div className="hidden flex-1 justify-center lg:flex">
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

                <div className="hidden items-center gap-2 lg:flex">
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className={cn(iconButtonClass, 'h-11 gap-2 px-3.5')}
                    aria-label="Abrir busca"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-4.5 w-4.5"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <span className="hidden text-sm font-semibold xl:inline">Buscar</span>
                  </button>

                  {ctaButton?.label && ctaButton?.link ? (
                    <Button
                      href={ctaButton.link}
                      variant="success"
                      className="min-h-11 rounded-pill px-5 shadow-[0_18px_36px_rgba(31,138,56,0.24)]"
                    >
                      {ctaButton.label}
                    </Button>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 lg:hidden">
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
        <div
          className={cn(
            'h-[86px]',
            socialLinks && socialLinks.length > 0 ? 'lg:h-[132px]' : 'lg:h-[106px]',
          )}
          aria-hidden="true"
        />
      ) : null}

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        ctaButton={ctaButton}
        socialLinks={socialLinks}
      />

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
