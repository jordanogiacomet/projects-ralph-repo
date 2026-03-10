'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import type { CTAButton, NavItem, SocialLink } from '@/lib/navigation'
import { matchesPath, navItemMatchesPath, normalizePathname } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { SocialLinks } from './SocialLinks'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  onSearchOpen?: () => void
  navItems: NavItem[]
  ctaButton?: CTAButton
  socialLinks?: SocialLink[]
}

export function MobileMenu({
  isOpen,
  onClose,
  onSearchOpen,
  navItems,
  ctaButton,
  socialLinks,
}: MobileMenuProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const menuRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const normalizedPath = normalizePathname(pathname)
  const sectionCount = navItems.length
  const routeCount = navItems.reduce((total, item) => total + (item.children?.length ?? 0), 0)

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

  useEffect(() => {
    if (!isOpen) return

    const nextExpanded = new Set<string>()

    for (const item of navItems) {
      const itemKey = item.id || item.label

      if (!navItemMatchesPath(item, normalizedPath)) {
        continue
      }

      nextExpanded.add(itemKey)

      for (const child of item.children ?? []) {
        const childKey = child.id || child.label
        const childMatches =
          matchesPath(normalizedPath, child.link) ||
          (child.children?.some((grandchild) => matchesPath(normalizedPath, grandchild.link)) ??
            false)

        if (childMatches) {
          nextExpanded.add(childKey)
        }
      }
    }

    if (nextExpanded.size > 0) {
      setExpandedItems(nextExpanded)
    }
  }, [isOpen, navItems, normalizedPath])

  useEffect(() => {
    if (!isOpen || !menuRef.current) return

    const menu = menuRef.current
    const focusableEls = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    )
    const firstEl = focusableEls[0]
    const lastEl = focusableEls[focusableEls.length - 1]

    const handleTab = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstEl) {
          event.preventDefault()
          lastEl?.focus()
        }
      } else if (document.activeElement === lastEl) {
        event.preventDefault()
        firstEl?.focus()
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
            className="fixed inset-0 z-40 bg-[#07111d]/68 backdrop-blur-md lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={menuRef}
            initial={shouldReduceMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-[min(92vw,430px)] flex-col overflow-hidden border-l border-white/10 bg-[linear-gradient(180deg,#0b1421_0%,#0f1724_54%,#132033_100%)] text-text-on-dark shadow-[0_32px_90px_rgba(2,12,27,0.52)] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            <div className="relative border-b border-white/10 px-5 pb-5 pt-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_top_left,rgba(0,86,166,0.28),transparent_36%)]"
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="max-w-[16rem]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Navegação
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    Explore a Apollo
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Um mapa mais editorial para acessar soluções, páginas e conteúdos no mobile.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-white/12 bg-white/[0.06] text-white/76 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
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

              <div className="relative mt-5 rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">
                      Estrutura
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/78">
                      {sectionCount} seções e {routeCount} grupos navegáveis
                    </p>
                  </div>
                  <span className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-pill border border-white/10 bg-white/10 px-3 text-sm font-semibold text-white">
                    Menu
                  </span>
                </div>
              </div>

              {(onSearchOpen || (ctaButton?.label && ctaButton.link)) && (
                <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
                  {onSearchOpen ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        onSearchOpen()
                      }}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-white/12 bg-white/[0.08] px-5 text-sm font-semibold text-white transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
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
                      <span>Abrir busca</span>
                    </button>
                  ) : null}

                  {ctaButton?.label && ctaButton.link ? (
                    <Button
                      href={ctaButton.link}
                      variant="success"
                      fullWidth
                      className="rounded-pill shadow-[0_18px_36px_rgba(31,138,56,0.26)]"
                      onClick={onClose}
                    >
                      {ctaButton.label}
                    </Button>
                  ) : null}
                </div>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <ul className="space-y-3.5">
                {navItems.map((item) => {
                  const key = item.id || item.label
                  const hasChildren = (item.children?.length ?? 0) > 0
                  const isExpanded = expandedItems.has(key)
                  const isActive = navItemMatchesPath(item, normalizedPath)

                  return (
                    <li
                      key={key}
                      className={cn(
                        'overflow-hidden rounded-[28px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)]',
                        isActive ? 'border-white/18' : 'border-white/10',
                      )}
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                              {hasChildren ? 'Seção expansível' : 'Acesso direto'}
                            </p>

                            {item.link ? (
                              <Link
                                href={item.link}
                                onClick={onClose}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                  'mt-2 block rounded-[18px] px-4 py-3 text-[1rem] font-semibold tracking-[-0.03em] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15',
                                  isActive
                                    ? 'bg-white text-bg-dark-section shadow-soft'
                                    : 'bg-white/[0.02] text-white/86 hover:bg-white/[0.08] hover:text-white',
                                )}
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <span className="mt-2 block px-4 py-3 text-[1rem] font-semibold tracking-[-0.03em] text-white">
                                {item.label}
                              </span>
                            )}

                            <p className="mt-2 px-4 text-sm leading-6 text-white/60">
                              {hasChildren
                                ? `${item.children?.length ?? 0} grupos organizados nesta seção.`
                                : 'Página disponível com acesso direto.'}
                            </p>
                          </div>

                          {hasChildren ? (
                            <span className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-[16px] border border-white/10 bg-white/10 px-3 text-sm font-semibold text-white">
                              {item.children?.length ?? 0}
                            </span>
                          ) : null}
                        </div>

                        {hasChildren ? (
                          <button
                            type="button"
                            onClick={() => toggleItem(key)}
                            className="mt-3 inline-flex w-full items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/82 transition hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Fechar' : 'Abrir'} submenu de ${item.label}`}
                          >
                            <span>{isExpanded ? 'Recolher mapa' : 'Abrir mapa da seção'}</span>
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
                            className="overflow-hidden border-t border-white/10 px-3 pb-3"
                          >
                            {item.children!.map((child) => {
                              const childKey = child.id || child.label
                              const hasGrandchildren = (child.children?.length ?? 0) > 0
                              const isChildExpanded = expandedItems.has(childKey)
                              const isChildActive =
                                matchesPath(normalizedPath, child.link) ||
                                (child.children?.some((grandchild) =>
                                  matchesPath(normalizedPath, grandchild.link),
                                ) ??
                                  false)

                              return (
                                <li
                                  key={childKey}
                                  className={cn(
                                    'mt-3 overflow-hidden rounded-[24px] border bg-white/[0.04]',
                                    isChildActive ? 'border-white/18' : 'border-white/8',
                                  )}
                                >
                                  <div className="p-3.5">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/38">
                                          Categoria
                                        </p>

                                        {child.link ? (
                                          <Link
                                            href={child.link}
                                            onClick={onClose}
                                            aria-current={isChildActive ? 'page' : undefined}
                                            className={cn(
                                              'mt-2 block text-base font-semibold tracking-[-0.03em] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15',
                                              isChildActive
                                                ? 'text-white'
                                                : 'text-white/82 hover:text-white',
                                            )}
                                          >
                                            {child.label}
                                          </Link>
                                        ) : (
                                          <span className="mt-2 block text-base font-semibold tracking-[-0.03em] text-white">
                                            {child.label}
                                          </span>
                                        )}

                                        <p className="mt-2 text-sm leading-6 text-white/58">
                                          {child.description ||
                                            'Aprofunde a navegação desta categoria e abra suas rotas relacionadas.'}
                                        </p>
                                      </div>

                                      <span className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.08]px-2.5 text-[11px] font-semibold text-white/82">
                                        {child.children?.length ?? 0}
                                      </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2.5">
                                      {child.link ? (
                                        <Link
                                          href={child.link}
                                          onClick={onClose}
                                          className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/[0.08]px-4 py-2 text-sm font-semibold text-white/82 transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
                                        >
                                          <span>Ver categoria</span>
                                          <span aria-hidden>&rarr;</span>
                                        </Link>
                                      ) : null}

                                      {hasGrandchildren ? (
                                        <button
                                          type="button"
                                          onClick={() => toggleItem(childKey)}
                                          className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white/72 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
                                          aria-expanded={isChildExpanded}
                                          aria-label={`${isChildExpanded ? 'Fechar' : 'Abrir'} submenu de ${child.label}`}
                                        >
                                          <span>
                                            {isChildExpanded ? 'Ocultar rotas' : 'Abrir rotas'}
                                          </span>
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
                                        className="grid gap-2 border-t border-white/8 px-3.5 pb-3.5 pt-3"
                                      >
                                        {child.children!.map((grandchild) => {
                                          const isGrandchildActive = matchesPath(
                                            normalizedPath,
                                            grandchild.link,
                                          )

                                          return (
                                            <li key={grandchild.id || grandchild.label}>
                                              {grandchild.link ? (
                                                <Link
                                                  href={grandchild.link}
                                                  onClick={onClose}
                                                  aria-current={
                                                    isGrandchildActive ? 'page' : undefined
                                                  }
                                                  className={cn(
                                                    'flex items-center justify-between gap-3 rounded-[16px] border px-3.5 py-3 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15',
                                                    isGrandchildActive
                                                      ? 'border-white/18 bg-white text-bg-dark-section shadow-soft'
                                                      : 'border-white/8 bg-white/[0.04] text-white/68 hover:bg-white/10 hover:text-white',
                                                  )}
                                                >
                                                  <span>{grandchild.label}</span>
                                                  <span aria-hidden>&rarr;</span>
                                                </Link>
                                              ) : (
                                                <span className="block rounded-[16px] border border-white/8 bg-white/[0.04] px-3.5 py-3 text-[13px] font-medium text-white/60">
                                                  {grandchild.label}
                                                </span>
                                              )}
                                            </li>
                                          )
                                        })}
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
              <div className="border-t border-white/10 bg-white/[0.04] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                      Redes
                    </p>
                    <p className="mt-2 text-sm text-white/62">
                      Canais institucionais e atendimento.
                    </p>
                  </div>
                </div>
                <SocialLinks
                  links={socialLinks}
                  size="sm"
                  className="mt-4 justify-start gap-2"
                  itemClassName="border-white/10 bg-white/[0.06] text-white/76 shadow-none hover:border-white/20 hover:bg-white/10 hover:text-white"
                />
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
