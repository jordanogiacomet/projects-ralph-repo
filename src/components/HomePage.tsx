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
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : backgroundY,
            backgroundImage: `url(${hero.backgroundImageUrl || '/images/home-hero-placeholder.jpg'})`,
          }}
          className="absolute inset-0 bg-cover bg-center"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: Math.min(Math.max(hero.overlayOpacity / 100, 0), 1) }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center text-text-on-dark sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">{hero.title}</h1>
          <p className="mt-4 max-w-3xl text-base text-white/90 sm:text-xl">{hero.subtitle}</p>
          <Link
            href={hero.ctaLink}
            className="mt-8 inline-flex rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
          >
            {hero.ctaLabel}
          </Link>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white"
          animate={shouldReduceMotion ? { y: 0 } : { y: [0, 8, 0] }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Role para baixo"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
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
