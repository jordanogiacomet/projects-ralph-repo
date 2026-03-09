'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SearchOverlayProps = {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('q') as string
    if (query.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-dark-section/95"
          role="dialog"
          aria-modal="true"
          aria-label="Busca no site"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-text-on-dark hover:text-accent-light transition-colors"
            aria-label="Fechar busca"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full max-w-2xl px-6">
            <form onSubmit={handleSubmit}>
              <label htmlFor="search-input" className="block text-text-on-dark text-lg mb-4 text-center">
                O que você procura?
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="search-input"
                  name="q"
                  type="text"
                  placeholder="Digite sua busca..."
                  className="w-full bg-transparent border-b-2 border-text-on-dark/30 focus:border-accent text-text-on-dark text-2xl py-4 px-2 outline-none placeholder:text-text-on-dark/40 transition-colors"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-on-dark hover:text-accent transition-colors"
                  aria-label="Buscar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
