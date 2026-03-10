'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { SolutionCard, type SolutionItem } from './SolutionCard'

type SolutionGridProps = {
  items: SolutionItem[]
  variant?: 'default' | 'hub'
}

export function SolutionGrid({ items, variant = 'default' }: SolutionGridProps) {
  const shouldReduceMotion = useReducedMotion()
  const isHubVariant = variant === 'hub'

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
