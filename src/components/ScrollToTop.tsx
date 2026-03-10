'use client'

import { useEffect, useState } from 'react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        })
      }}
      aria-label="Voltar ao topo"
      className="fixed bottom-24 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/70 bg-white/92 text-text-primary shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-accent/20 hover:text-accent"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </svg>
    </button>
  )
}
