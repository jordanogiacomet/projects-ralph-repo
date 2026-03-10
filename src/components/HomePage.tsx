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

  return (
    <div className="bg-bg-primary text-text-primary">
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        {/* Background image with parallax */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : backgroundY,
            backgroundImage: `url(${hero.backgroundImageUrl || '/images/home-hero-placeholder.jpg'})`,
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
            background:
              'linear-gradient(180deg, rgba(8,14,26,0.5) 0%, transparent 100%)',
          }}
          aria-hidden
        />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-32 text-center text-text-on-dark sm:px-8 sm:pb-20 sm:pt-36 lg:px-12">
          {/* Institutional badge */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-medium tracking-wide text-white/80 backdrop-blur-sm sm:px-5 sm:text-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cta-green" aria-hidden />
              Especialistas em Gestão Patrimonial
            </span>
          </motion.div>

          <motion.h1
            className="mt-8 font-display text-display-lg font-extrabold tracking-[-0.03em] text-white sm:mt-10"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.title}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:mt-8 sm:text-lg md:text-xl md:leading-relaxed"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.subtitle}
          </motion.p>

          {/* Dual CTA group */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row sm:gap-5"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={hero.ctaLink}
              className="inline-flex items-center gap-2.5 rounded-full bg-cta-green px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(40,167,69,0.25)] transition-all duration-200 hover:bg-cta-green-hover hover:shadow-[0_12px_40px_rgba(40,167,69,0.35)] sm:px-10 sm:py-4 sm:text-base"
            >
              {hero.ctaLabel}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 py-3.5 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/[0.1] sm:px-9 sm:py-4 sm:text-base"
            >
              Conheça a Apollo
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator — refined */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 sm:bottom-10"
          animate={shouldReduceMotion ? { y: 0 } : { y: [0, 6, 0] }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Role para baixo"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">Explorar</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="text-white/40">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
      </section>

      <section className="bg-bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{servicesHeading}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((card, index) => (
              <motion.article
                key={card.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, delay: index * 0.12 }}
                className="rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                {card.iconUrl ? (
                  <Image
                    src={card.iconUrl}
                    alt={card.title}
                    width={48}
                    height={48}
                    loading="lazy"
                    sizes="48px"
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-accent-light text-accent">
                    <span className="text-xl font-bold">{card.title.charAt(0)}</span>
                  </div>
                )}
                <h3 className="mt-5 text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm text-text-secondary">{card.description}</p>
                <Link
                  href={card.link}
                  className="mt-5 inline-flex text-sm font-semibold text-accent transition hover:text-accent-hover"
                >
                  Detalhes
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">{partnerSection.heading}</h2>
          <p className="mt-4 text-text-secondary">{partnerSection.description}</p>
          <Link
            href={partnerSection.buttonLink}
            className="mt-8 inline-flex rounded-md bg-cta-green px-6 py-3 font-semibold text-white transition hover:bg-cta-green-hover"
          >
            {partnerSection.buttonLabel}
          </Link>
        </div>
      </section>

      <section className="bg-bg-secondary py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-bold sm:text-3xl">{aboutSection.heading}</h2>
            <p className="mt-4 text-text-secondary">{aboutSection.description}</p>
            <Link
              href={aboutSection.buttonLink}
              className="mt-8 inline-flex rounded-md border border-accent px-6 py-3 font-semibold text-accent transition hover:bg-accent-light"
            >
              {aboutSection.buttonLabel}
            </Link>
          </div>
          <div className="order-1 md:order-2">
            {aboutSection.videoUrl ? (
              <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black shadow-sm">
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
                className="h-full min-h-64 w-full rounded-xl border border-border object-cover shadow-sm"
              />
            ) : (
              <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
                <span className="px-6 text-center text-sm text-text-secondary">
                  Conteúdo visual da Apollo Gestão
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
