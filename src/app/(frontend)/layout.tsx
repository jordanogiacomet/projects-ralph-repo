import React from 'react'
import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { Footer } from '@/components/Footer'
import { NavbarServer } from '@/components/NavbarServer'
import {
  buildMetadata,
  buildOrganizationAndLocalBusinessJsonLd,
} from '@/lib/seo'
import '../globals.css'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: '/',
    fallbackTitle: 'Apollo Gestao - Avaliacoes e Controle Patrimonial',
    fallbackDescription:
      'Empresa especializada em avaliacoes patrimoniais, controle de ativos e consultoria contabil.',
  })
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { organization, locations } = await buildOrganizationAndLocalBusinessJsonLd()

  return (
    <html lang="pt-BR">
      <body className="font-sans text-text-primary bg-bg-primary">
        <JsonLd id="organization-jsonld" data={organization} />
        {locations.map((location, index) => (
          <JsonLd
            key={`local-business-jsonld-${index}`}
            id={`local-business-jsonld-${index}`}
            data={location}
          />
        ))}
        <NavbarServer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
