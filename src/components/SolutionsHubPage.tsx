'use client'

import Link from 'next/link'
import { useMemo, useState, type ReactNode } from 'react'
import { ContatoForm } from './ContatoForm'
import { SolutionFilterTabs, type SolutionFilter } from './SolutionFilterTabs'
import { SolutionGrid, type SolutionItem } from './SolutionGrid'

type SolutionWithFilters = SolutionItem & {
  filterKeys: string[]
}

type SolutionsHubPageProps = {
  heroTitle: string
  heroDescription: string
  filters: SolutionFilter[]
  solutions: SolutionWithFilters[]
}

const highlightedHeroPhrase = 'solução completa'

function renderHeroTitle(title: string): ReactNode {
  const lowerTitle = title.toLocaleLowerCase('pt-BR')
  const startIndex = lowerTitle.indexOf(highlightedHeroPhrase)

  if (startIndex === -1) {
    return title
  }

  const endIndex = startIndex + highlightedHeroPhrase.length

  return (
    <>
      {title.slice(0, startIndex)}
      <strong>{title.slice(startIndex, endIndex)}</strong>
      {title.slice(endIndex)}
    </>
  )
}

export function SolutionsHubPage({ heroTitle, heroDescription, filters, solutions }: SolutionsHubPageProps) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredSolutions = useMemo(() => {
    if (activeFilter === 'all') return solutions
    return solutions.filter((solution) => solution.filterKeys.includes(activeFilter))
  }, [activeFilter, solutions])

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-bg-dark-section">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 15%, rgba(0, 86, 166, 0.3), transparent 45%), radial-gradient(circle at 85% 10%, rgba(255, 255, 255, 0.1), transparent 35%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center text-text-on-dark sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{renderHeroTitle(heroTitle)}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-white/85 sm:text-lg">{heroDescription}</p>
        </div>
      </section>

      <section className="bg-bg-secondary py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SolutionFilterTabs filters={filters} activeFilter={activeFilter} onChange={setActiveFilter} />
          <div className="mt-8">
            <SolutionGrid items={filteredSolutions} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ContatoForm title="Fale com a Apollo Gestão" />
        </div>
      </section>

      <section className="bg-bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Fique em contato</h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Nossa equipe está pronta para mapear o seu cenário e recomendar a estratégia ideal para os ativos da
            sua empresa.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-flex rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
          >
            Ir para contato
          </Link>
        </div>
      </section>
    </div>
  )
}

export type { SolutionFilter, SolutionItem }
