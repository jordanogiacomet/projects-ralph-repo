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
}

type SolutionGridProps = {
  items: SolutionItem[]
}

export function SolutionGrid({ items }: SolutionGridProps) {
  const shouldReduceMotion = useReducedMotion()

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
