'use client'

import { useEffect, useRef, useState } from 'react'

import { Button, Card } from '@/components/ui'

type CookieConsentProps = {
  text?: string
}

const CONSENT_KEY = 'apollo-cookie-consent'

export function CookieConsent({ text }: CookieConsentProps) {
  const [visible, setVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const value = window.localStorage.getItem(CONSENT_KEY)
    setVisible(!value)
  }, [])

  useEffect(() => {
    if (visible) {
      document.body.dataset.cookieConsentVisible = 'true'
    } else {
      delete document.body.dataset.cookieConsentVisible
    }

    return () => {
      delete document.body.dataset.cookieConsentVisible
    }
  }, [visible])

  useEffect(() => {
    if (!visible || !cardRef.current) {
      document.body.style.removeProperty('--apollo-cookie-consent-height')
      return
    }

    const element = cardRef.current
    const updateHeight = () => {
      document.body.style.setProperty(
        '--apollo-cookie-consent-height',
        `${Math.ceil(element.getBoundingClientRect().height)}px`,
      )
    }

    updateHeight()

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : null
    observer?.observe(element)
    window.addEventListener('resize', updateHeight)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateHeight)
      document.body.style.removeProperty('--apollo-cookie-consent-height')
    }
  }, [visible])

  const handleChoice = (value: 'accepted' | 'hidden' | 'settings') => {
    window.localStorage.setItem(CONSENT_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      ref={cardRef}
      className="apollo-cookie-consent fixed inset-x-3 z-50 mx-auto max-w-[24.5rem] sm:inset-x-auto sm:left-4 sm:mx-0 sm:max-w-[24rem] lg:left-5 lg:max-w-[28rem]"
    >
      <Card
        className="rounded-[24px] border border-white/12 bg-[#0e1a2d]/94 text-white shadow-[0_24px_56px_rgba(7,12,23,0.24)] backdrop-blur"
        padding="none"
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.06] text-white/82 lg:inline-flex">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 3a4 4 0 0 0 4 4 4 4 0 0 1 4 4 5 5 0 0 1-5 5H8a5 5 0 0 1 0-10 3 3 0 0 0 3-3Z" />
                <path d="M8.5 9.5h.01" />
                <path d="M14.5 12.5h.01" />
                <path d="M11.5 15.5h.01" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-label-sm font-semibold uppercase tracking-[0.24em] text-white/45">
                Cookies
              </p>
              <p className="mt-1.5 text-sm leading-6 text-white/76">
                {text ||
                  'Utilizamos cookies para melhorar sua experiência de navegação e analisar o tráfego do site.'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleChoice('accepted')} className="shadow-none">
              Aceitar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleChoice('hidden')}
              className="border-white/12 bg-white/[0.06] text-white hover:border-white/18 hover:bg-white/10 hover:text-white"
            >
              Agora não
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleChoice('settings')}
              className="text-white/72 hover:bg-white/[0.08] hover:text-white"
            >
              Decidir depois
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
