'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import type { NavChild } from '@/lib/navigation'
import { matchesPath, normalizePathname } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Badge, Button } from '@/components/ui'

type MegaMenuProps = {
  isOpen: boolean
  title?: string
  href?: string
  items: NavChild[]
  onClose: () => void
}

export function MegaMenu({ isOpen, title, href, items, onClose }: MegaMenuProps) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const normalizedPath = normalizePathname(pathname)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!items || items.length === 0) return null

  const sectionCount = items.length
  const routeCount = items.reduce((total, item) => total + (item.children?.length ?? 0), 0)
  const quickLinks = items.filter((item) => item.link).slice(0, 3)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
          className="absolute left-0 right-0 top-full z-50 pt-4"
          onMouseLeave={onClose}
          role="menu"
          aria-label={`Mega menu de ${title || 'navegação'}`}
        >
          <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.98)_100%)] shadow-[0_40px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,86,166,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_28%)]"
            />

            <div className="relative grid border-b border-border/70 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.72fr)]">
              <div className="p-6 sm:p-7 lg:p-8">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge tone="accent">Explorar</Badge>
                  <span className="inline-flex rounded-pill border border-border bg-white/75 px-3 py-1 text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                    {sectionCount} frentes
                  </span>
                  <span className="inline-flex rounded-pill border border-border bg-white/75 px-3 py-1 text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                    {routeCount} rotas
                  </span>
                </div>

                <h2 className="mt-5 max-w-2xl font-display text-heading-2xl font-semibold tracking-tight text-text-primary">
                  {title || 'Navegação principal'}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                  Organize sua navegação entre frentes, especialidades e páginas de aprofundamento
                  com uma leitura mais clara e mais editorial.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {href ? (
                    <Button href={href} variant="outline" className="bg-white/80" onClick={onClose}>
                      Ver visão geral
                    </Button>
                  ) : null}

                  {quickLinks.map((item) => (
                    <Link
                      key={item.id || item.label}
                      href={item.link!}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-pill border border-border bg-white/72 px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/20 hover:bg-white hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                      role="menuitem"
                    >
                      <span>{item.label}</span>
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/70 bg-[linear-gradient(160deg,rgba(234,242,251,0.72)_0%,rgba(255,255,255,0.92)_100%)] p-6 lg:border-l lg:border-t-0 lg:p-8">
                <p className="text-label-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
                  Mapa desta área
                </p>
                <div className="mt-4 grid gap-3">
                  {items.slice(0, 3).map((item, index) => {
                    const isItemActive =
                      matchesPath(normalizedPath, item.link) ||
                      (item.children?.some((child) => matchesPath(normalizedPath, child.link)) ??
                        false)

                    return (
                      <Link
                        key={item.id || item.label}
                        href={item.link || href || '#'}
                        onClick={onClose}
                        className={cn(
                          'rounded-[22px] border px-4 py-4 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15',
                          isItemActive
                            ? 'border-accent/20 bg-white text-text-primary shadow-soft'
                            : 'border-border/80 bg-white/68 text-text-secondary hover:border-accent/20 hover:bg-white hover:text-text-primary',
                        )}
                        role="menuitem"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                              Categoria {index + 1}
                            </p>
                            <p className="mt-2 text-base font-semibold tracking-[-0.03em]">
                              {item.label}
                            </p>
                          </div>
                          <span className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-pill bg-accent-light px-2.5 text-label-sm font-semibold text-accent-strong">
                            {item.children?.length ?? 0}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="relative p-5 sm:p-6 lg:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-label-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
                    Categorias e subitens
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Cada grupo organiza a página principal e seus acessos de aprofundamento.
                  </p>
                </div>
                <p className="text-sm font-medium text-text-muted">Painel de navegação expandido</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((category, index) => {
                  const isCategoryActive =
                    matchesPath(normalizedPath, category.link) ||
                    (category.children?.some((child) => matchesPath(normalizedPath, child.link)) ??
                      false)

                  return (
                    <article
                      key={category.id || category.label}
                      className={cn(
                        'group rounded-[28px] border p-5 transition duration-200',
                        isCategoryActive
                          ? 'border-accent/20 bg-[linear-gradient(180deg,rgba(234,242,251,0.96)_0%,rgba(255,255,255,0.98)_100%)] shadow-[0_18px_40px_rgba(0,86,166,0.12)]'
                          : 'border-border bg-[linear-gradient(180deg,rgba(248,250,252,0.92)_0%,rgba(255,255,255,0.98)_100%)] hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-soft',
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={cn(
                            'inline-flex h-11 w-11 items-center justify-center rounded-[18px] border text-sm font-semibold',
                            isCategoryActive
                              ? 'border-accent/15 bg-white text-accent'
                              : 'border-border/80 bg-white/84 text-text-muted',
                          )}
                        >
                          {(index + 1).toString().padStart(2, '0')}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              {category.link ? (
                                <Link
                                  href={category.link}
                                  onClick={onClose}
                                  className="text-lg font-semibold tracking-[-0.03em] text-text-primary transition-colors hover:text-accent"
                                  role="menuitem"
                                >
                                  {category.label}
                                </Link>
                              ) : (
                                <h3 className="text-lg font-semibold tracking-[-0.03em] text-text-primary">
                                  {category.label}
                                </h3>
                              )}
                              <p className="mt-2 text-sm leading-6 text-text-secondary">
                                {category.description ||
                                  'Acesse a visão geral da categoria e seus caminhos de aprofundamento.'}
                              </p>
                            </div>
                            <span className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-pill bg-white px-2.5 text-label-sm font-semibold text-text-muted shadow-sm">
                              {category.children?.length ?? 0}
                            </span>
                          </div>

                          {category.link ? (
                            <Link
                              href={category.link}
                              onClick={onClose}
                              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                              role="menuitem"
                            >
                              <span>Ver categoria</span>
                              <span aria-hidden>&rarr;</span>
                            </Link>
                          ) : null}
                        </div>
                      </div>

                      {category.children && category.children.length > 0 ? (
                        <ul className="mt-5 space-y-2.5 border-t border-border/70 pt-4">
                          {category.children.map((child) => {
                            const isChildActive = matchesPath(normalizedPath, child.link)

                            return (
                              <li key={child.id || child.label}>
                                {child.link ? (
                                  <Link
                                    href={child.link}
                                    onClick={onClose}
                                    className={cn(
                                      'flex items-center justify-between gap-3 rounded-[18px] border px-3.5 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15',
                                      isChildActive
                                        ? 'border-accent/20 bg-white text-accent shadow-soft'
                                        : 'border-transparent text-text-secondary hover:border-accent/10 hover:bg-white hover:text-accent',
                                    )}
                                    role="menuitem"
                                  >
                                    <span>{child.label}</span>
                                    <span
                                      className={cn(
                                        'transition',
                                        isChildActive ? 'text-accent' : 'text-text-muted',
                                      )}
                                    >
                                      &rarr;
                                    </span>
                                  </Link>
                                ) : (
                                  <span className="block rounded-[18px] px-3.5 py-3 text-sm font-medium text-text-secondary">
                                    {child.label}
                                  </span>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
