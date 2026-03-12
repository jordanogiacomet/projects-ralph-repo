'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { Button, Card } from '@/components/ui'

import { SolutionCard, type SolutionItem } from './SolutionCard'

type SolutionGridProps = {
  items: SolutionItem[]
  variant?: 'default' | 'hub'
}

export function SolutionGrid({ items, variant = 'default' }: SolutionGridProps) {
  const shouldReduceMotion = useReducedMotion()
  const isHubVariant = variant === 'hub'

  if (items.length === 0) {
    return (
      <Card
        as="section"
        padding="lg"
        className="relative overflow-hidden border-border/90 bg-white/96 shadow-soft"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 48%, rgba(15,23,42,0.04) 100%)',
          }}
          aria-hidden
        />
        <div className="relative">
          <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Nenhum resultado no recorte atual
          </p>
          <h3 className="mt-4 font-display text-heading-xl font-semibold text-text-primary">
            Ajuste o filtro ou avance para uma conversa consultiva.
          </h3>
          <p className="mt-4 max-w-2xl text-body-md text-text-secondary">
            Este estado foi harmonizado para evitar lacunas visuais quando um recorte nao retornar
            solucoes publicadas. O portfolio completo e os caminhos de contato continuam acessiveis.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/solucoes" size="lg" className="rounded-pill">
              Ver portfolio completo
            </Button>
            <Button href="/contato/cotacao" variant="outline" size="lg" className="rounded-pill">
              Solicitar diagnostico
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      layout
      className={
        isHubVariant
          ? 'grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'
          : 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'
      }
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            className="h-full"
            initial={shouldReduceMotion ? false : { opacity: 0, y: isHubVariant ? 18 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: isHubVariant ? -10 : -8 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: isHubVariant ? 0.26 : 0.22,
                    delay: isHubVariant ? index * 0.03 : index * 0.02,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
          >
            <SolutionCard
              item={item}
              index={isHubVariant ? index : undefined}
              variant={isHubVariant ? 'feature' : 'compact'}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export type { SolutionItem }
