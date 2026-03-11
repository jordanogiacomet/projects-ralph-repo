'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type ServiceCardData = {
  id: string
  title: string
  description: string
  link: string
  iconUrl?: string
}

type HomePageProps = {
  hero: {
    title: string
    subtitle: string
    ctaLabel: string
    ctaLink: string
    backgroundImageUrl?: string
    overlayOpacity: number
  }
  servicesHeading: string
  services: ServiceCardData[]
  partnerSection: {
    heading: string
    description: string
    buttonLabel: string
    buttonLink: string
  }
  aboutSection: {
    heading: string
    description: string
    buttonLabel: string
    buttonLink: string
    mediaUrl?: string
    videoUrl?: string
  }
}

const homepageHeroFallbackMediaStyle = {
  backgroundImage: [
    'linear-gradient(126deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 34%)',
    'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.14), transparent 20%)',
    'radial-gradient(circle at 78% 20%, rgba(0,86,166,0.38), transparent 34%)',
    'radial-gradient(circle at 54% 74%, rgba(40,167,69,0.14), transparent 32%)',
    'linear-gradient(142deg, rgba(8,14,26,0.98) 0%, rgba(10,18,32,0.94) 46%, rgba(8,14,26,1) 100%)',
  ].join(', '),
  backgroundPosition: 'center',
  backgroundSize: 'cover',
}

function getHomepageHeroBackgroundStyle(backgroundImageUrl?: string) {
  if (backgroundImageUrl) {
    return { backgroundImage: `url(${backgroundImageUrl})` }
  }

  return homepageHeroFallbackMediaStyle
}

function toEmbedUrl(url: string): string {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  return url
}

export function HomePage({
  hero,
  servicesHeading,
  services,
  partnerSection,
  aboutSection,
}: HomePageProps) {
  const heroRef = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const primaryServices = services.slice(0, 3)
  const serviceJourney = primaryServices.map((service, index) => ({
    ...service,
    step: `0${index + 1}`,
  }))
  const proofStats = [
    { value: '20+', label: 'Anos de experiência' },
    { value: '500+', label: 'Clientes atendidos' },
    { value: '100%', label: 'Conformidade técnica' },
    { value: '50+', label: 'Especialistas' },
  ]
  const aboutHighlights = [
    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Conformidade CPC/IFRS' },
    {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      text: 'Equipe especializada',
    },
  ]

  return (
    <div className="bg-bg-primary text-text-primary [&>section+section]:relative">
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      >
        {/* Background image with parallax */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : backgroundY,
            ...getHomepageHeroBackgroundStyle(hero.backgroundImageUrl),
          }}
          className="absolute inset-0 scale-[1.08] bg-cover bg-center"
          aria-hidden
        />

        {/* Primary gradient overlay — refined depth layers */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(175deg, rgba(8,14,26,0.82) 0%, rgba(10,18,32,0.58) 40%, rgba(10,18,32,0.52) 65%, rgba(8,14,26,0.88) 100%)',
          }}
          aria-hidden
        />

        {/* Radial brand accent — subtle institutional presence */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(0,86,166,0.12) 0%, transparent 65%)',
          }}
          aria-hidden
        />

        {/* Subtle top-edge gradient for navbar integration */}
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: 'linear-gradient(180deg, rgba(8,14,26,0.5) 0%, transparent 100%)',
          }}
          aria-hidden
        />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-24 text-center text-text-on-dark sm:px-8 sm:pb-32 sm:pt-36 lg:px-12 lg:pb-40 xl:pb-44">
          {/* Institutional badge */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[0.7rem] font-medium tracking-wide text-white/80 backdrop-blur-sm sm:px-5 sm:text-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cta-green" aria-hidden />
              Especialistas em Gestão Patrimonial
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 max-w-4xl font-display text-display-md font-extrabold tracking-[-0.03em] text-white sm:mt-10 sm:text-display-lg"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {hero.title}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-8 sm:text-lg md:text-xl md:leading-relaxed"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {hero.subtitle}
          </motion.p>

          {/* Dual CTA group */}
          <motion.div
            className="mt-10 flex w-full max-w-sm flex-col items-center gap-3 sm:mt-14 sm:max-w-none sm:flex-row sm:gap-5"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <Link
              href={hero.ctaLink}
              className="motion-transition motion-lift-subtle inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-cta-green px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(40,167,69,0.25)] hover:bg-cta-green-hover hover:shadow-[0_12px_40px_rgba(40,167,69,0.35)] sm:w-auto sm:px-10 sm:py-4 sm:text-base"
            >
              {hero.ctaLabel}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/sobre"
              className="motion-transition motion-lift-subtle inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-sm hover:border-white/30 hover:bg-white/[0.1] sm:w-auto sm:px-9 sm:py-4 sm:text-base"
            >
              Conheça a Apollo
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator — refined */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:flex sm:bottom-10"
          animate={shouldReduceMotion ? { y: 0 } : { y: [0, 6, 0] }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }
          aria-label="Role para baixo"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-label-sm font-medium uppercase tracking-[0.2em] text-white/40">
              Explorar
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="text-white/40"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ── Services / 3 Pillars ── */}
      <section className="bg-bg-secondary pb-[var(--space-section-loose)] pt-0">
        {/* Subtle top edge for visual transition from hero */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />
        <div className="mx-auto max-w-content px-6 sm:px-8 lg:px-12">
          <motion.div
            className="relative z-10 mx-auto -mt-10 max-w-[72rem] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/92 p-6 shadow-[var(--shadow-strong)] backdrop-blur-sm sm:-mt-14 sm:p-8 lg:-mt-16 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.3fr)] lg:items-start lg:gap-8 lg:p-9 xl:max-w-[74rem] xl:gap-10"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0,86,166,0.07) 0%, rgba(255,255,255,0) 56%, rgba(15,23,42,0.05) 100%)',
              }}
              aria-hidden
            />

            <div className="relative max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/10 bg-accent-soft/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent-strong">
                Visão integrada
              </span>
              <h2 className="mt-5 font-display text-heading-xl font-extrabold tracking-tight sm:text-heading-2xl">
                Uma operação consultiva que conecta estratégia, campo e governança contínua.
              </h2>
              <p className="mt-4 max-w-lg text-body-sm leading-relaxed text-text-secondary sm:text-base">
                Da avaliação técnica à organização do inventário e à evolução tecnológica, a Apollo
                conduz a jornada patrimonial com método, rastreabilidade e clareza executiva.
              </p>
            </div>

            <div className="relative mt-6 grid gap-3 sm:grid-cols-3 lg:mt-0">
              {serviceJourney.map((service) => (
                <div
                  key={service.id}
                  className="rounded-[1.35rem] border border-border/80 bg-white/80 p-4 shadow-[var(--shadow-soft)]"
                >
                  <span className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent/70">
                    {service.step}
                  </span>
                  <p className="mt-3 font-display text-base font-bold tracking-tight text-text-primary">
                    {service.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section header */}
          <motion.div
            className="mx-auto mt-16 max-w-2xl text-center sm:mt-20"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Soluções
            </span>
            <h2 className="font-display text-display-sm font-extrabold tracking-tight">
              {servicesHeading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
              Metodologia comprovada e soluções especializadas para cada necessidade patrimonial.
            </p>
          </motion.div>

          {/* Cards grid */}
          <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-8">
            {primaryServices.map((card, index) => (
              <motion.article
                key={card.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }
                }
                className="group motion-transition motion-transition-emphasis motion-lift-card relative flex flex-col overflow-hidden rounded-card border border-border bg-white p-8 shadow-[var(--shadow-soft)] hover:border-accent/20 hover:shadow-[var(--shadow-medium)] sm:p-10"
              >
                {/* Accent top bar */}
                <div
                  className="motion-transition motion-transition-emphasis absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent group-hover:scale-x-100 group-focus-within:scale-x-100"
                  aria-hidden
                />

                {/* Icon */}
                <div className="motion-transition motion-transition-emphasis mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft group-hover:bg-accent/10 group-focus-within:bg-accent/10">
                  {card.iconUrl ? (
                    <Image
                      src={card.iconUrl}
                      alt=""
                      width={32}
                      height={32}
                      loading="lazy"
                      sizes="32px"
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-accent"
                      aria-hidden
                    >
                      {index === 0 && (
                        <path
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                      {index === 1 && (
                        <path
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-16 0H3m2 0v-4m14 4v-4M9 7h6M9 11h6M9 15h2"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                      {index === 2 && (
                        <path
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  )}
                </div>

                <h3 className="font-display text-heading-lg font-bold tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-body-sm leading-relaxed text-text-secondary">
                  {card.description}
                </p>

                {/* Link with arrow */}
                <Link
                  href={card.link}
                  className="motion-transition mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                >
                  Saiba mais
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="motion-transition group-hover:translate-x-1 group-focus-within:translate-x-1"
                    aria-hidden
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutional Proof / Value ── */}
      <section className="relative overflow-hidden bg-bg-dark-section section-space-loose">
        {/* Top gradient blend into dark section */}
        <div
          className="absolute inset-x-0 top-0 h-24"
          style={{ background: 'linear-gradient(180deg, rgba(15,23,36,0.6) 0%, transparent 100%)' }}
          aria-hidden
        />
        {/* Subtle radial accent */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,86,166,0.10) 0%, transparent 70%)',
          }}
          aria-hidden
        />
        {/* Bottom gradient blend out of dark section */}
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: 'linear-gradient(0deg, rgba(15,23,36,0.6) 0%, transparent 100%)' }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-content px-6 sm:px-8 lg:px-12">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-accent/70">
              Por que a Apollo
            </span>
            <h2 className="font-display text-display-sm font-extrabold tracking-tight text-text-on-dark">
              {partnerSection.heading}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">
              {partnerSection.description}
            </p>
          </motion.div>

          {/* Stats / credentials row */}
          <motion.div
            className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-4 lg:gap-6"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {proofStats.map((stat) => (
              <div
                key={stat.label}
                className="relative flex min-h-[10rem] flex-col justify-between overflow-hidden rounded-[1.6rem] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.03)_100%)] px-4 py-5 text-left backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-6 sm:py-6"
              >
                <div
                  className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
                  aria-hidden
                />
                <span className="block font-display text-[2.5rem] font-extrabold leading-none tracking-[-0.05em] text-white sm:text-[2.9rem]">
                  {stat.value}
                </span>
                <span className="mt-4 block max-w-[11ch] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/60 sm:text-[0.82rem]">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-12 text-center sm:mt-14"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <Link
              href={partnerSection.buttonLink}
              className="motion-transition motion-lift-subtle inline-flex items-center gap-2.5 rounded-full bg-cta-green px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(40,167,69,0.25)] hover:bg-cta-green-hover hover:shadow-[0_12px_40px_rgba(40,167,69,0.35)] sm:px-10 sm:py-4 sm:text-base"
            >
              {partnerSection.buttonLabel}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── About / Institutional ── */}
      <section className="section-space-loose overflow-hidden bg-bg-primary">
        {/* Subtle top divider */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />
        <div
          className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl"
          aria-hidden
        />
        <div className="mx-auto max-w-content px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
            {/* Text column */}
            <motion.div
              className="order-2 max-w-xl md:order-1"
              initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                Sobre a Apollo
              </span>
              <h2 className="font-display text-display-sm font-extrabold tracking-tight">
                {aboutSection.heading}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
                {aboutSection.description}
              </p>

              {/* Trust signals — lightweight proof below the description */}
              <div className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
                {aboutHighlights.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-start gap-3 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm text-text-secondary shadow-[var(--shadow-soft)]"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="shrink-0 text-accent"
                      aria-hidden
                    >
                      <path
                        d={item.icon}
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href={aboutSection.buttonLink}
                className="motion-transition motion-lift-subtle mt-8 inline-flex items-center gap-2 rounded-full border-2 border-accent px-7 py-3 text-sm font-semibold text-accent hover:bg-accent hover:text-white sm:px-9 sm:py-3.5 sm:text-base"
              >
                {aboutSection.buttonLabel}
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
            </motion.div>

            {/* Media column */}
            <motion.div
              className="order-1 md:order-2"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <div className="relative">
                <div
                  className="absolute inset-x-8 bottom-0 top-10 rounded-full bg-accent/10 blur-3xl"
                  aria-hidden
                />
                <div className="relative rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-accent-soft via-white to-bg-secondary p-3 shadow-[var(--shadow-strong)] sm:p-4">
                  {aboutSection.videoUrl ? (
                    <div className="aspect-video overflow-hidden rounded-[1.15rem] bg-black">
                      <iframe
                        src={toEmbedUrl(aboutSection.videoUrl)}
                        title="Quem é a Apollo"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : aboutSection.mediaUrl ? (
                    <Image
                      src={aboutSection.mediaUrl}
                      alt="Apollo Gestão"
                      width={800}
                      height={520}
                      loading="lazy"
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="h-full min-h-64 w-full rounded-[1.15rem] object-cover"
                    />
                  ) : (
                    <div className="flex min-h-72 items-center justify-center rounded-[1.15rem] bg-white shadow-[var(--shadow-soft)]">
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-accent"
                            aria-hidden
                          >
                            <path
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-text-muted">
                          Conteúdo visual da Apollo Gestão
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-start gap-3 rounded-[1.15rem] border border-white/70 bg-white/80 px-4 py-3 text-sm leading-relaxed text-text-secondary">
                    <span
                      className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-cta-green"
                      aria-hidden
                    />
                    Cada entrega combina visão estratégica, execução em campo e governança contínua
                    para apoiar decisões com mais segurança.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
