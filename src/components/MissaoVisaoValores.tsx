'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'

type Slide = {
  id: string
  title: string
  description: string
  backgroundImageUrl?: string
}

type MissaoVisaoValoresProps = {
  heading: string
  slides: Slide[]
}

export function MissaoVisaoValores({ heading, slides }: MissaoVisaoValoresProps) {
  const safeSlides = useMemo(() => slides.filter((slide) => slide.title.trim().length > 0), [slides])
  const [activeIndex, setActiveIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  if (safeSlides.length === 0) return null

  const currentSlide = safeSlides[activeIndex]

  function goTo(index: number) {
    const normalized = (index + safeSlides.length) % safeSlides.length
    setActiveIndex(normalized)
  }

  return (
    <section className="bg-bg-dark-section py-16 text-text-on-dark sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">{heading}</h2>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="rounded-full border border-white/30 p-2 transition hover:border-white/60"
              aria-label="Slide anterior"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path d="M14 6L8 12L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="rounded-full border border-white/30 p-2 transition hover:border-white/60"
              aria-label="Próximo slide"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path d="M10 6L16 12L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={currentSlide.id}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' }}
              drag={shouldReduceMotion ? false : 'x'}
              dragElastic={shouldReduceMotion ? 0 : 0.08}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (shouldReduceMotion) return
                if (info.offset.x < -80) goTo(activeIndex + 1)
                if (info.offset.x > 80) goTo(activeIndex - 1)
              }}
              className="relative min-h-[22rem] cursor-grab active:cursor-grabbing"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${currentSlide.backgroundImageUrl || '/images/sobre-slide-placeholder.jpg'})`,
                }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-black/55" aria-hidden />
              <div className="relative z-10 flex min-h-[22rem] items-end p-6 sm:p-10">
                <div className="max-w-3xl">
                  <h3 className="text-3xl font-bold sm:text-4xl">{currentSlide.title}</h3>
                  <p className="mt-4 text-sm text-white/90 sm:text-base">{currentSlide.description}</p>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {safeSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir para slide ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-2.5 rounded-full transition ${
                  index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold tracking-wide transition hover:border-white/60"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold tracking-wide transition hover:border-white/60"
          >
            Próximo
          </button>
        </div>
      </div>
    </section>
  )
}
