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
      className="group fixed bottom-[5.25rem] right-4 z-40 inline-flex items-center justify-center gap-2 rounded-[18px] border border-white/12 bg-[#0e1a2d]/88 px-3 py-3 text-white shadow-[0_20px_40px_rgba(7,12,23,0.24)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-white/18 hover:bg-[#12213a]/94 sm:bottom-[5.85rem] sm:right-5"
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
      <span className="hidden text-sm font-semibold lg:inline">Topo</span>
    </button>
  )
}
