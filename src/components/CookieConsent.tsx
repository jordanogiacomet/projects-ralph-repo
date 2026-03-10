'use client'

import { useEffect, useState } from 'react'

import { Button, Card } from '@/components/ui'

type CookieConsentProps = {
  text?: string
}

const CONSENT_KEY = 'apollo-cookie-consent'

export function CookieConsent({ text }: CookieConsentProps) {
  const [visible, setVisible] = useState(false)

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

  const handleChoice = (value: 'accepted' | 'hidden' | 'settings') => {
    window.localStorage.setItem(CONSENT_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <Card
      className="fixed inset-x-4 bottom-[5.6rem] z-50 mx-auto max-w-reading rounded-[28px] border border-white/12 bg-[#0e1a2d]/94 text-white shadow-[0_28px_58px_rgba(7,12,23,0.28)] backdrop-blur sm:inset-x-auto sm:bottom-5 sm:left-5 sm:mx-0 sm:max-w-[30rem]"
      padding="md"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.06] text-white/82">
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
          <p className="mt-2 text-sm leading-6 text-white/76">
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
    </Card>
  )
}
