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

  const handleChoice = (value: 'accepted' | 'hidden' | 'settings') => {
    window.localStorage.setItem(CONSENT_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <Card
      className="fixed inset-x-4 bottom-[5.25rem] z-50 mx-auto max-w-reading rounded-[28px] border border-border/80 bg-white/96 shadow-[0_24px_56px_rgba(15,23,42,0.18)] backdrop-blur sm:inset-x-auto sm:bottom-5 sm:left-5 sm:mx-0 sm:max-w-[28rem]"
      padding="md"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-text-muted">
        Cookies
      </p>
      <p className="text-body-sm text-text-secondary">
        {text ||
          'Utilizamos cookies para melhorar sua experiência de navegação e analisar o tráfego do site.'}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => handleChoice('accepted')}>
          Aceitar
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleChoice('hidden')}>
          Ocultar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleChoice('settings')}>
          Configurações
        </Button>
      </div>
    </Card>
  )
}
