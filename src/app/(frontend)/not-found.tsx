import { Badge, Button, Container } from '@/components/ui'

const recoveryLinks = [
  {
    href: '/news',
    label: 'Explorar News',
    description: 'Volte para o acervo editorial e encontre outras publicacoes recentes.',
  },
  {
    href: '/conteudos',
    label: 'Ver conteudos',
    description: 'Acesse e-books, planilhas e materiais tecnicos organizados pela Apollo.',
  },
  {
    href: '/contato',
    label: 'Falar com especialistas',
    description: 'Se voce precisava de uma rota especifica, a equipe pode direcionar o melhor caminho.',
  },
]

export default function FrontendNotFound() {
  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(8,14,26,0.94) 0%, rgba(12,22,38,0.86) 42%, rgba(8,14,26,0.98) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 14% 18%, rgba(0,86,166,0.36), transparent 34%), radial-gradient(circle at 82% 14%, rgba(255,255,255,0.12), transparent 26%), radial-gradient(circle at 48% 92%, rgba(40,167,69,0.12), transparent 28%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: 'linear-gradient(180deg, rgba(8,14,26,0.5) 0%, transparent 100%)',
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end">
            <div className="max-w-3xl text-text-on-dark">
              <Badge className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                Erro 404
              </Badge>
              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white sm:mt-8">
                Nao encontramos esta pagina publica da Apollo.
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/74 sm:mt-6">
                O endereco pode ter mudado, ter sido removido ou ter chegado por um link antigo.
                A recuperacao abaixo mantem a navegacao no contexto institucional, sem cair na
                tela padrao do framework.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="/"
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                >
                  Voltar para Home
                </Button>
                <Button
                  href="/news"
                  variant="inverted"
                  size="lg"
                  className="rounded-pill"
                >
                  Explorar News
                </Button>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_24px_65px_rgba(8,14,26,0.26)] backdrop-blur-sm sm:p-7">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 38%, rgba(0,86,166,0.16) 100%)',
                }}
                aria-hidden
              />
              <div className="relative">
                <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/58">
                  Recuperacao rapida
                </p>
                <p className="mt-4 text-body-md text-white/74">
                  Use um dos caminhos abaixo para retomar a jornada editorial ou voltar para um
                  ponto de entrada seguro do site.
                </p>

                <div className="mt-6 grid gap-3">
                  {recoveryLinks.map((link) => (
                    <div
                      key={link.href}
                      className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]"
                    >
                      <p className="font-display text-heading-lg font-bold text-white">{link.label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/62">{link.description}</p>
                      <Button
                        href={link.href}
                        variant="inverted"
                        size="sm"
                        className="mt-4 rounded-pill border-white/10"
                      >
                        Acessar rota
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </div>
  )
}
