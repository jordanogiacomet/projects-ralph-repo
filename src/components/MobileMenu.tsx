'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { CTAButton, NavItem, SocialLink } from '@/lib/navigation'
import { matchesPath, navItemMatchesPath, normalizePathname } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { SocialLinks } from './SocialLinks'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  ctaButton?: CTAButton
  socialLinks?: SocialLink[]
}

export function MobileMenu({ isOpen, onClose, navItems, ctaButton, socialLinks }: MobileMenuProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const menuRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const normalizedPath = normalizePathname(pathname)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setExpandedItems(new Set())
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return
    const menu = menuRef.current
    const focusableEls = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    )
    const firstEl = focusableEls[0]
    const lastEl = focusableEls[focusableEls.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl?.focus()
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleTab)
    firstEl?.focus()
    return () => window.removeEventListener('keydown', handleTab)
  }, [isOpen, onClose])

  const toggleItem = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#07111d]/62 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={menuRef}
            initial={shouldReduceMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-[min(92vw,420px)] flex-col overflow-hidden border-l border-white/10 bg-bg-dark-section text-text-on-dark shadow-[0_28px_70px_rgba(2,12,27,0.48)] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            <div className="border-b border-white/10 bg-white/5 px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Navegação
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    Explore a Apollo
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Acesse soluções, conteúdos e canais de contato com uma navegação mais clara.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/76 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
                  aria-label="Fechar menu"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-5.5 w-5.5"
                  >
                    <path d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {ctaButton?.label && ctaButton?.link ? (
                <Button
                  href={ctaButton.link}
                  variant="success"
                  fullWidth
                  className="mt-5 rounded-pill shadow-[0_18px_36px_rgba(31,138,56,0.26)]"
                  onClick={onClose}
                >
                  {ctaButton.label}
                </Button>
              ) : null}
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-3">
                {navItems.map((item) => {
                  const key = item.id || item.label
                  const hasChildren = item.children && item.children.length > 0
                  const isExpanded = expandedItems.has(key)
                  const isActive = navItemMatchesPath(item, normalizedPath)

                  return (
                    <li
                      key={key}
                      className={cn(
                        'overflow-hidden rounded-[24px] border border-white/10 bg-white/5',
                        isActive && 'border-white/18 bg-white/[0.08]',
                      )}
                    >
                      <div className="flex items-center gap-2 p-2">
                        {item.link ? (
                          <Link
                            href={item.link}
                            onClick={onClose}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                              'flex-1 rounded-[18px] px-4 py-3 text-[15px] font-semibold tracking-[-0.02em] transition',
                              isActive
                                ? 'bg-white text-bg-dark-section shadow-soft'
                                : 'text-white/86 hover:bg-white/8 hover:text-white',
                            )}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span className="flex-1 px-4 py-3 text-[15px] font-semibold tracking-[-0.02em] text-white">
                            {item.label}
                          </span>
                        )}

                        {hasChildren ? (
                          <button
                            type="button"
                            onClick={() => toggleItem(key)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-white/10 bg-white/6 text-white/76 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Fechar' : 'Abrir'} submenu de ${item.label}`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              className={cn(
                                'h-4.5 w-4.5 transition-transform',
                                isExpanded && 'rotate-180',
                              )}
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>
                        ) : null}
                      </div>

                      <AnimatePresence>
                        {hasChildren && isExpanded && (
                          <motion.ul
                            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                            className="overflow-hidden border-t border-white/10 px-2 pb-2"
                          >
                            {item.children!.map((child) => {
                              const childKey = child.id || child.label
                              const hasGrandchildren = child.children && child.children.length > 0
                              const isChildExpanded = expandedItems.has(childKey)
                              const isChildActive = matchesPath(normalizedPath, child.link)

                              return (
                                <li
                                  key={childKey}
                                  className="mt-2 overflow-hidden rounded-[20px] bg-white/[0.04]"
                                >
                                  <div className="flex items-center gap-2 p-2">
                                    {child.link ? (
                                      <Link
                                        href={child.link}
                                        onClick={onClose}
                                        aria-current={isChildActive ? 'page' : undefined}
                                        className={cn(
                                          'flex-1 rounded-[16px] px-3.5 py-3 text-sm font-medium transition',
                                          isChildActive
                                            ? 'bg-white text-bg-dark-section shadow-soft'
                                            : 'text-white/72 hover:bg-white/8 hover:text-white',
                                        )}
                                      >
                                        {child.label}
                                      </Link>
                                    ) : (
                                      <span className="flex-1 px-3.5 py-3 text-sm font-medium text-white/78">
                                        {child.label}
                                      </span>
                                    )}

                                    {hasGrandchildren ? (
                                      <button
                                        type="button"
                                        onClick={() => toggleItem(childKey)}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/8 bg-white/6 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
                                        aria-expanded={isChildExpanded}
                                        aria-label={`${isChildExpanded ? 'Fechar' : 'Abrir'} submenu de ${child.label}`}
                                      >
                                        <svg
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          className={cn(
                                            'h-3.5 w-3.5 transition-transform',
                                            isChildExpanded && 'rotate-180',
                                          )}
                                        >
                                          <path d="m6 9 6 6 6-6" />
                                        </svg>
                                      </button>
                                    ) : null}
                                  </div>

                                  <AnimatePresence>
                                    {hasGrandchildren && isChildExpanded && (
                                      <motion.ul
                                        initial={
                                          shouldReduceMotion ? false : { height: 0, opacity: 0 }
                                        }
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={
                                          shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
                                        }
                                        className="overflow-hidden border-t border-white/8 px-2 pb-2"
                                      >
                                        {child.children!.map((grandchild) => (
                                          <li
                                            key={grandchild.id || grandchild.label}
                                            className="mt-2"
                                          >
                                            {grandchild.link ? (
                                              <Link
                                                href={grandchild.link}
                                                onClick={onClose}
                                                aria-current={
                                                  matchesPath(normalizedPath, grandchild.link)
                                                    ? 'page'
                                                    : undefined
                                                }
                                                className={cn(
                                                  'block rounded-[14px] px-3 py-2 text-[13px] transition',
                                                  matchesPath(normalizedPath, grandchild.link)
                                                    ? 'bg-white text-bg-dark-section shadow-soft'
                                                    : 'text-white/60 hover:bg-white/8 hover:text-white',
                                                )}
                                              >
                                                {grandchild.label}
                                              </Link>
                                            ) : (
                                              <span className="block rounded-[14px] px-3 py-2 text-[13px] text-white/60">
                                                {grandchild.label}
                                              </span>
                                            )}
                                          </li>
                                        ))}
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </li>
                              )
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {socialLinks && socialLinks.length > 0 ? (
              <div className="border-t border-white/10 bg-white/5 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                  Redes
                </p>
                <SocialLinks
                  links={socialLinks}
                  size="sm"
                  className="mt-3 justify-start gap-2"
                  itemClassName="border-white/10 bg-white/6 text-white/76 shadow-none hover:border-white/20 hover:bg-white/10 hover:text-white"
                />
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
