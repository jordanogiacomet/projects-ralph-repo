'use client'

type WhatsAppFloatProps = {
  number?: string
  message?: string
}

export function WhatsAppFloat({ number, message }: WhatsAppFloatProps) {
  if (!number) return null

  const encodedMessage = encodeURIComponent(
    message || 'Olá! Gostaria de falar com a Apollo Gestão.',
  )
  const cleanNumber = number.replace(/\D/g, '')
  const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Apollo via WhatsApp"
      className="group fixed bottom-4 right-4 z-40 inline-flex items-center gap-3 rounded-[22px] border border-white/12 bg-[#0e1a2d]/92 px-3 py-3 text-white shadow-[0_24px_48px_rgba(7,12,23,0.28)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-white/18 hover:bg-[#12213a]/96 sm:bottom-5 sm:right-5"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-[15px] bg-cta-green shadow-[0_12px_28px_rgba(31,138,56,0.34)]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5.5 w-5.5" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
        </svg>
      </span>
      <span className="hidden min-w-0 flex-col sm:flex">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
          WhatsApp
        </span>
        <span className="pr-0.5 text-sm font-semibold text-white">Fale com a Apollo</span>
      </span>
    </a>
  )
}
