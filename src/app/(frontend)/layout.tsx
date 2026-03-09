import React from 'react'
import type { Metadata } from 'next'
import { NavbarServer } from '@/components/NavbarServer'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Apollo Gestão — Avaliações e Controle Patrimonial',
  description:
    'Empresa especializada em avaliações patrimoniais, controle de ativos e consultoria contábil.',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans text-text-primary bg-bg-primary">
        <NavbarServer />
        <main>{children}</main>
        {/* Footer will be added in US-005 */}
      </body>
    </html>
  )
}
