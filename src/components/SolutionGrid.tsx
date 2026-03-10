'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type SolutionItem = {
  id: string
  title: string
  description: string
  href: string
  iconUrl?: string
  categoryLabel?: string
}

type SolutionGridProps = {
  items: SolutionItem[]
  variant?: 'default' | 'hub'
}

export function SolutionGrid({ items, variant = 'default' }: SolutionGridProps) {
  const shouldReduceMotion = useReducedMotion()

  if (variant === 'hub') {
    return (
      <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              layout
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.26, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }
              }
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border/80 bg-white p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/18 hover:shadow-[var(--shadow-medium)] sm:p-7"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(0,86,166,0.07) 0%, rgba(255,255,255,0) 42%, rgba(15,23,42,0.06) 100%)',
                }}
                aria-hidden
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent/80">
                      {item.categoryLabel || 'Solucao Apollo'}
                    </p>
                    <h3 className="mt-3 font-display text-heading-lg font-bold tracking-tight text-text-primary">
                      {item.title}
                    </h3>
                  </div>

                  {item.iconUrl ? (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.15rem] border border-accent/10 bg-accent-soft/65 shadow-[0_14px_30px_rgba(0,86,166,0.12)]">
                      <Image
                        src={item.iconUrl}
                        alt={item.title}
                        width={40}
                        height={40}
                        loading="lazy"
                        sizes="40px"
                        className="h-10 w-10 rounded object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.15rem] border border-accent/12 bg-accent-soft/75 text-accent-strong shadow-[0_14px_30px_rgba(0,86,166,0.12)]">
                      <span className="font-display text-xl font-bold">{item.title.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <p className="mt-4 flex-1 text-body-md leading-relaxed text-text-secondary">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-border/80 pt-5">
                  <div className="rounded-pill border border-accent/10 bg-accent-soft/55 px-3 py-1.5 text-label-sm font-semibold text-accent-strong">
                    Frente consultiva
                  </div>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition duration-200 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                  >
                    Explorar solucao
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.article
            key={item.id}
            layout
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22 }}
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            {item.iconUrl ? (
              <Image
                src={item.iconUrl}
                alt={item.title}
                width={56}
                height={56}
                loading="lazy"
                sizes="56px"
                className="h-14 w-14 rounded object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded bg-accent-light text-accent">
                <span className="text-lg font-bold">{item.title.charAt(0)}</span>
              </div>
            )}
            <h3 className="mt-4 text-lg font-semibold text-text-primary">{item.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-text-secondary">{item.description}</p>
            <Link
              href={item.href}
              className="mt-5 inline-flex text-sm font-semibold text-accent transition hover:text-accent-hover"
            >
              Ver solução
            </Link>
          </motion.article>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export type { SolutionItem }
