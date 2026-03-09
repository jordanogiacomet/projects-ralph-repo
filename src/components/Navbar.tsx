'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { SocialLinks } from './SocialLinks'
import { SearchOverlay } from './SearchOverlay'

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
  ctaButton?: { label?: string; link?: string }
  socialLinks?: SocialLink[]
  isHeroPage?: boolean
}

export function Navbar({
  logo,
  logoNegativo,
  navItems = [],
  ctaButton,
  socialLinks,
  isHeroPage = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMegaMenu = useCallback(() => {
    setMegaMenuOpen(false)
    setActiveDropdown(null)
  }, [])

  const isTransparent = isHeroPage && !scrolled && !megaMenuOpen

  const currentLogo = isTransparent ? logoNegativo || logo : logo
  const textColor = isTransparent ? 'text-text-on-dark' : 'text-text-primary'
  const textHoverColor = isTransparent
    ? 'hover:text-accent-light'
    : 'hover:text-accent'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-md shadow-sm',
        )}
      >
        {/* Social links bar */}
        {socialLinks && socialLinks.length > 0 && (
          <div
            className={cn(
              'hidden lg:block border-b transition-colors duration-300',
              isTransparent ? 'border-white/10' : 'border-border',
            )}
          >
            <div className="max-w-7xl mx-auto px-6 py-1.5 flex justify-end">
              <SocialLinks
                links={socialLinks}
                iconClassName={cn(
                  isTransparent
                    ? 'text-text-on-dark/70 hover:text-text-on-dark'
                    : undefined,
                )}
              />
            </div>
          </div>
        )}

        {/* Main nav */}
        <nav
          className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 lg:h-20"
          aria-label="Navegação principal"
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Apollo Gestão - Página inicial">
            {currentLogo?.url ? (
              <Image
                src={currentLogo.url}
                alt={currentLogo.alt || 'Apollo Gestão'}
                width={currentLogo.width || 180}
                height={currentLogo.height || 40}
                className="h-8 lg:h-10 w-auto"
                priority
              />
            ) : (
              <span
                className={cn(
                  'text-xl font-bold transition-colors',
                  isTransparent ? 'text-text-on-dark' : 'text-accent',
                )}
              >
                Apollo Gestão
              </span>
            )}
          </Link>

          {/* Desktop nav items */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const key = item.id || item.label
              const hasChildren = item.children && item.children.length > 0

              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasChildren) {
                      setMegaMenuOpen(true)
                      setActiveDropdown(key)
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasChildren && !megaMenuOpen) {
                      setActiveDropdown(null)
                    }
                  }}
                >
                  {item.link && !hasChildren ? (
                    <Link
                      href={item.link}
                      className={cn(
                        'px-3 py-2 text-sm font-medium transition-colors rounded',
                        textColor,
                        textHoverColor,
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        'px-3 py-2 text-sm font-medium transition-colors rounded flex items-center gap-1',
                        textColor,
                        textHoverColor,
                        activeDropdown === key && 'text-accent',
                      )}
                      aria-expanded={activeDropdown === key}
                      aria-haspopup="true"
                      onClick={() => {
                        if (hasChildren) {
                          if (activeDropdown === key) {
                            closeMegaMenu()
                          } else {
                            setMegaMenuOpen(true)
                            setActiveDropdown(key)
                          }
                        }
                      }}
                    >
                      {item.label}
                      {hasChildren && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className={cn(
                            'w-3.5 h-3.5 transition-transform',
                            activeDropdown === key && 'rotate-180',
                          )}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              )
            })}

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                'p-2 transition-colors rounded',
                textColor,
                textHoverColor,
              )}
              aria-label="Abrir busca"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* CTA button */}
            {ctaButton?.label && ctaButton?.link && (
              <Link
                href={ctaButton.link}
                className="ml-2 bg-cta-green hover:bg-cta-green-hover text-white font-semibold py-2 px-5 rounded transition-colors text-sm"
              >
                {ctaButton.label}
              </Link>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                'p-2 transition-colors',
                textColor,
                textHoverColor,
              )}
              aria-label="Abrir busca"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                'p-2 transition-colors',
                textColor,
                textHoverColor,
              )}
              aria-label="Abrir menu de navegação"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-6 h-6"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mega menu for active dropdown with children */}
        {navItems.map((item) => {
          const key = item.id || item.label
          if (!item.children || item.children.length === 0) return null
          return (
            <MegaMenu
              key={key}
              isOpen={megaMenuOpen && activeDropdown === key}
              items={item.children}
              onClose={closeMegaMenu}
            />
          )
        })}
      </header>

      {/* Spacer to prevent content from going under fixed navbar */}
      {!isHeroPage && (
        <div className="h-16 lg:h-20" aria-hidden="true">
          {socialLinks && socialLinks.length > 0 && (
            <div className="hidden lg:block h-[33px]" />
          )}
        </div>
      )}

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
