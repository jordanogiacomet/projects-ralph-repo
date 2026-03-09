'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type NavChild = {
  label: string
  link?: string
  description?: string
  children?: { label: string; link?: string; id?: string }[]
  id?: string
}

type MegaMenuProps = {
  isOpen: boolean
  items: NavChild[]
  onClose: () => void
}

export function MegaMenu({ isOpen, items, onClose }: MegaMenuProps) {
  if (!items || items.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-border z-50"
          onMouseLeave={onClose}
          role="menu"
          aria-label="Mega menu de Soluções"
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {items.map((category) => (
                <div key={category.id || category.label}>
                  {category.link ? (
                    <Link
                      href={category.link}
                      className="text-accent font-semibold text-lg mb-3 block hover:text-accent-hover transition-colors"
                      role="menuitem"
                    >
                      {category.label}
                    </Link>
                  ) : (
                    <span className="text-accent font-semibold text-lg mb-3 block">
                      {category.label}
                    </span>
                  )}
                  {category.description && (
                    <p className="text-text-secondary text-sm mb-3">{category.description}</p>
                  )}
                  {category.children && category.children.length > 0 && (
                    <ul className="space-y-2">
                      {category.children.map((child) => (
                        <li key={child.id || child.label}>
                          {child.link ? (
                            <Link
                              href={child.link}
                              className="text-text-primary hover:text-accent text-sm transition-colors block py-1"
                              role="menuitem"
                            >
                              {child.label}
                            </Link>
                          ) : (
                            <span className="text-text-primary text-sm block py-1">
                              {child.label}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
