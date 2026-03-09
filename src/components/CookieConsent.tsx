'use client'

import { useEffect, useState } from 'react'

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
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl rounded-xl border border-border bg-white p-4 shadow-2xl">
      <p className="text-sm text-text-secondary">
        {text ||
          'Utilizamos cookies para melhorar sua experiência de navegação e analisar o tráfego do site.'}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleChoice('accepted')}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => handleChoice('hidden')}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary"
        >
          Ocultar
        </button>
        <button
          type="button"
          onClick={() => handleChoice('settings')}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary"
        >
          Configurações
        </button>
      </div>
    </div>
  )
}
