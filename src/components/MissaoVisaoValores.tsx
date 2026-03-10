'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { Badge, Card, Container } from '@/components/ui'
import { cn } from '@/lib/utils'

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

function arrowIcon(direction: 'left' | 'right') {
  const path = direction === 'left' ? 'M14 6L8 12L14 18' : 'M10 6L16 12L10 18'

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function MissaoVisaoValores({ heading, slides }: MissaoVisaoValoresProps) {
  const safeSlides = useMemo(
    () => slides.filter((slide) => slide.title.trim().length > 0),
    [slides],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  if (safeSlides.length === 0) return null

  const currentSlide = safeSlides[activeIndex]

  function goTo(index: number) {
    const normalized = (index + safeSlides.length) % safeSlides.length
    setActiveIndex(normalized)
  }

  return (
    <section className="relative overflow-hidden bg-bg-dark-section section-space-loose text-text-on-dark">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(8,14,26,0.96) 0%, rgba(12,22,38,0.92) 44%, rgba(8,14,26,0.98) 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 16% 18%, rgba(0,86,166,0.26), transparent 34%), radial-gradient(circle at 80% 14%, rgba(255,255,255,0.08), transparent 22%), radial-gradient(circle at 78% 84%, rgba(40,167,69,0.1), transparent 24%)',
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
          <div className="max-w-xl">
            <Badge className="border border-white/12 bg-white/[0.08] text-white/78">
              Identidade institucional
            </Badge>
            <h2 className="mt-6 font-display text-display-sm font-extrabold tracking-tight text-white sm:text-display-md">
              {heading}
            </h2>
            <p className="mt-5 text-body-lg text-white/72">
              Missao, visao e valores deixam de aparecer como um bloco isolado e passam a operar
              como parte da mesma narrativa premium, consultiva e institucional da pagina.
            </p>

            <div className="mt-8 space-y-3">
              {safeSlides.map((slide, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-pressed={isActive}
                    className={cn(
                      'motion-transition w-full rounded-panel border p-4 text-left shadow-soft',
                      isActive
                        ? 'border-white/16 bg-white/[0.08] shadow-medium'
                        : 'border-white/10 bg-white/[0.04] hover:border-white/18 hover:bg-white/[0.07]',
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/46">
                          Pilar {String(index + 1).padStart(2, '0')}
                        </p>
                        <p className="mt-2 text-base font-semibold text-white">{slide.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-white/68">
                          {slide.description}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-white transition',
                          isActive
                            ? 'border-white/18 bg-white/[0.12]'
                            : 'border-white/10 bg-white/[0.04]',
                        )}
                        aria-hidden
                      >
                        {arrowIcon('right')}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="motion-transition inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]"
                aria-label="Slide anterior"
              >
                {arrowIcon('left')}
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="motion-transition inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]"
                aria-label="Proximo slide"
              >
                {arrowIcon('right')}
              </button>
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/42">
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(safeSlides.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          <Card
            tone="dark"
            padding="none"
            className="relative overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_32px_80px_rgba(8,14,26,0.28)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={currentSlide.id}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                }
                drag={shouldReduceMotion ? false : 'x'}
                dragElastic={shouldReduceMotion ? 0 : 0.08}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (shouldReduceMotion) return
                  if (info.offset.x < -80) goTo(activeIndex + 1)
                  if (info.offset.x > 80) goTo(activeIndex - 1)
                }}
                className="relative min-h-[28rem] cursor-grab active:cursor-grabbing"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${currentSlide.backgroundImageUrl || '/images/sobre-slide-placeholder.jpg'})`,
                  }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(8,14,26,0.24) 0%, rgba(8,14,26,0.48) 36%, rgba(8,14,26,0.9) 100%)',
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 78% 16%, rgba(255,255,255,0.08), transparent 26%), radial-gradient(circle at 18% 12%, rgba(0,86,166,0.24), transparent 34%)',
                  }}
                  aria-hidden
                />

                <div className="relative flex min-h-[28rem] flex-col justify-between p-6 sm:p-8 lg:p-10">
                  <div className="flex items-center justify-between gap-3">
                    <Badge className="border border-white/12 bg-white/[0.08] text-white/78">
                      Pilar Apollo
                    </Badge>
                    <span className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/42">
                      {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="max-w-2xl">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/52">
                      Fundamento em foco
                    </p>
                    <h3 className="mt-4 font-display text-display-sm font-semibold tracking-tight text-white sm:text-display-md">
                      {currentSlide.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-body-md leading-7 text-white/78">
                      {currentSlide.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </Card>
        </div>
      </Container>
    </section>
  )
}
