'use client'

import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { NavChild } from '@/lib/navigation'
import { Badge, Button } from '@/components/ui'

type MegaMenuProps = {
  isOpen: boolean
  title?: string
  href?: string
  items: NavChild[]
  onClose: () => void
}

export function MegaMenu({ isOpen, title, href, items, onClose }: MegaMenuProps) {
  const shouldReduceMotion = useReducedMotion()

  if (!items || items.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
          className="absolute left-0 right-0 top-full z-50 pt-3"
          onMouseLeave={onClose}
          role="menu"
          aria-label={`Mega menu de ${title || 'navegação'}`}
        >
          <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/96 shadow-[0_35px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="grid lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.72fr)]">
              <div className="border-b border-border/70 bg-[linear-gradient(160deg,rgba(234,242,251,0.9)_0%,rgba(255,255,255,0.95)_58%,rgba(217,232,248,0.68)_100%)] p-6 lg:border-b-0 lg:border-r lg:p-8">
                <Badge tone="accent">Explorar</Badge>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-text-primary">
                  {title || 'Navegação principal'}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-text-secondary">
                  Navegue pelas frentes de atuação da Apollo com uma visão mais clara entre
                  categorias, especialidades e rotas de aprofundamento.
                </p>
                {href ? (
                  <Button
                    href={href}
                    variant="outline"
                    className="mt-6 bg-white/75"
                    onClick={onClose}
                  >
                    Ver visão geral
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 lg:p-5">
                {items.map((category) => (
                  <article
                    key={category.id || category.label}
                    className="group rounded-[24px] border border-border bg-surface-secondary/70 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent/20 hover:bg-white hover:shadow-soft"
                  >
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
                        {category.description ? (
                          <p className="mt-2 text-sm leading-6 text-text-secondary">
                            {category.description}
                          </p>
                        ) : null}
                      </div>
                      <span className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-pill bg-white px-2.5 text-[11px] font-semibold text-text-muted shadow-sm">
                        {category.children?.length ?? 0}
                      </span>
                    </div>

                    {category.children && category.children.length > 0 ? (
                      <ul className="mt-5 space-y-2.5 border-t border-border/70 pt-4">
                        {category.children.map((child) => (
                          <li key={child.id || child.label}>
                            {child.link ? (
                              <Link
                                href={child.link}
                                onClick={onClose}
                                className="flex items-center justify-between gap-3 rounded-[18px] px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-accent-light hover:text-accent"
                                role="menuitem"
                              >
                                <span>{child.label}</span>
                                <span className="text-text-muted transition group-hover:text-accent">
                                  &rarr;
                                </span>
                              </Link>
                            ) : (
                              <span className="block rounded-[18px] px-3 py-2.5 text-sm font-medium text-text-secondary">
                                {child.label}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
