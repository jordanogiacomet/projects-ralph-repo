'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SocialLinks } from './SocialLinks'

type NavChild = {
  label: string
  link?: string
  description?: string
  children?: { label: string; link?: string; id?: string }[]
  id?: string
}

type NavItem = {
  label: string
  link?: string
  children?: NavChild[]
  id?: string
}

type SocialLink = {
  platform?: string
  url?: string
  id?: string
}

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  ctaButton?: { label?: string; link?: string }
  socialLinks?: SocialLink[]
}

export function MobileMenu({ isOpen, onClose, navItems, ctaButton, socialLinks }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setExpandedItems(new Set())
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return
    const menu = menuRef.current
    const focusableEls = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    )
    const firstEl = focusableEls[0]
    const lastEl = focusableEls[focusableEls.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl?.focus()
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleTab)
    firstEl?.focus()
    return () => window.removeEventListener('keydown', handleTab)
  }, [isOpen, onClose])

  const toggleItem = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 overflow-y-auto shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-lg font-semibold text-text-primary">Menu</span>
              <button
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Fechar menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              {ctaButton?.label && ctaButton?.link && (
                <Link
                  href={ctaButton.link}
                  onClick={onClose}
                  className="block w-full text-center bg-cta-green hover:bg-cta-green-hover text-white font-semibold py-3 px-4 rounded mb-4 transition-colors"
                >
                  {ctaButton.label}
                </Link>
              )}

              <ul className="space-y-1">
                {navItems.map((item) => {
                  const key = item.id || item.label
                  const hasChildren = item.children && item.children.length > 0
                  const isExpanded = expandedItems.has(key)

                  return (
                    <li key={key}>
                      <div className="flex items-center">
                        {item.link && !hasChildren ? (
                          <Link
                            href={item.link}
                            onClick={onClose}
                            className="flex-1 py-3 px-2 text-text-primary hover:text-accent font-medium transition-colors"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <button
                            onClick={() => hasChildren && toggleItem(key)}
                            className="flex-1 flex items-center justify-between py-3 px-2 text-text-primary hover:text-accent font-medium transition-colors text-left"
                            aria-expanded={isExpanded}
                          >
                            {item.label}
                            {hasChildren && (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {hasChildren && isExpanded && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4 border-l-2 border-accent-light ml-2"
                          >
                            {item.children!.map((child) => {
                              const childKey = child.id || child.label
                              const hasGrandchildren = child.children && child.children.length > 0
                              const isChildExpanded = expandedItems.has(childKey)

                              return (
                                <li key={childKey}>
                                  {child.link && !hasGrandchildren ? (
                                    <Link
                                      href={child.link}
                                      onClick={onClose}
                                      className="block py-2 px-2 text-sm text-text-secondary hover:text-accent transition-colors"
                                    >
                                      {child.label}
                                    </Link>
                                  ) : (
                                    <button
                                      onClick={() => hasGrandchildren && toggleItem(childKey)}
                                      className="w-full flex items-center justify-between py-2 px-2 text-sm text-text-secondary hover:text-accent transition-colors text-left"
                                      aria-expanded={isChildExpanded}
                                    >
                                      {child.label}
                                      {hasGrandchildren && (
                                        <svg
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          className={cn('w-3 h-3 transition-transform', isChildExpanded && 'rotate-180')}
                                        >
                                          <path d="m6 9 6 6 6-6" />
                                        </svg>
                                      )}
                                    </button>
                                  )}

                                  <AnimatePresence>
                                    {hasGrandchildren && isChildExpanded && (
                                      <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden pl-4"
                                      >
                                        {child.children!.map((grandchild) => (
                                          <li key={grandchild.id || grandchild.label}>
                                            {grandchild.link ? (
                                              <Link
                                                href={grandchild.link}
                                                onClick={onClose}
                                                className="block py-1.5 px-2 text-xs text-text-secondary hover:text-accent transition-colors"
                                              >
                                                {grandchild.label}
                                              </Link>
                                            ) : (
                                              <span className="block py-1.5 px-2 text-xs text-text-secondary">
                                                {grandchild.label}
                                              </span>
                                            )}
                                          </li>
                                        ))}
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </li>
                              )
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {socialLinks && socialLinks.length > 0 && (
              <div className="p-4 border-t border-border">
                <SocialLinks links={socialLinks} className="justify-center" />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
