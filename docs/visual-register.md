# Visual Register

This file is the issue-level source of truth for the screenshot-driven visual-r1 cycle.

The visual direction for this round remains **Payload-inspired**, translated to Apollo’s institutional context:
- contained and viewport-safe shell surfaces
- cleaner hierarchy between navigation, utilities, and CTA
- calmer editorial split layouts
- stronger spacing discipline
- more intentional optical alignment between adjacent panels

## Status legend

- `open`
- `in-progress`
- `fixed`
- `blocked`
- `deferred`
- `rejected`

---

## VP-002 — Shell e Homepage

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-001 | VP-002 | / | desktop | default | high | docs/screenshots/VR-001-home-desktop-current.png | O overlap da seção seguinte está subindo demais e invadindo a área final do hero. Os CTAs ficam visualmente comprimidos entre o bloco de texto e o painel seguinte, e a transição entre seções parece acidental em vez de intencional. | O hero deve terminar com respiro claro abaixo dos CTAs, e o painel seguinte deve sobrepor de forma controlada sem “engolir” os botões nem competir com a área de ação principal. A transição deve parecer deliberada, mais próxima do ritmo limpo e editorial da referência Payload-inspired. | src/components/HomePage.tsx | fixed | src/components/HomePage.tsx | O hero já usa padding inferior mais generoso e uma sobreposição mais contida na surface seguinte, preservando respiro claro abaixo dos CTAs. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-002 | VP-002 | / | desktop | default | high | docs/screenshots/VR-002-home-navbar-desktop-current.png; docs/screenshots/VR-002-home-navbar-desktop-current-2.png | A navbar está densa demais: logo, navegação, busca, ícones sociais e CTA final competem no mesmo nível visual. O conjunto parece apertado, com busca curta, utilitários comprimidos e CTA encostada demais no limite direito. | O header deve ter hierarquia mais clara entre navegação principal, utilitários e CTA. Busca e CTA precisam de mais respiro, e o conjunto deve parecer mais limpo, premium e estável, com menos sensação de amontoado, mais próximo de um shell maduro no estilo Payload-inspired. | src/components/Navbar.tsx | fixed | src/components/Navbar.tsx | A navegação desktop já remove o item redundante de home na rota `/`, amplia a trigger de busca, posterga a brand tag para `2xl` e dá mais respiro entre utilitários e CTA. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-003 | VP-002 | / | desktop | default | medium | docs/screenshots/VR-003-home-metrics-desktop-current.png | A fileira de métricas tem pouca presença institucional e a tipografia interna está mal resolvida. Números e labels parecem opticamente desalinhados, com pouco contraste hierárquico e padding interno fraco. | A seção de métricas deve comunicar autoridade com mais clareza: números com melhor protagonismo, labels melhor alinhadas, cards com padding e ritmo mais refinados e leitura mais equilibrada na fileira inteira. | src/components/HomePage.tsx | fixed | src/components/HomePage.tsx | Os cards de métricas já usam stack vertical consistente, numerais com mais peso e padding interno reforçado para leitura institucional mais estável. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-005 | VP-002 | shared public shell | desktop | mega menu open (Contato) | high | docs/screenshots/VR-005-contato-megamenu-desktop-current.png | O painel expandido de navegação da área de Contato está vazando/estourando a altura útil da viewport em desktop 100%, fazendo o shell parecer grande demais, pesado e pouco contido. O painel perde sensação de controle e acabamento premium. | O mega panel deve caber com segurança dentro da viewport útil em desktop comum, com altura, densidade e distribuição de conteúdo mais controladas. A superfície expandida deve parecer contida e estável, mais próxima do comportamento de mega panels Payload-inspired. | src/components/MegaMenu.tsx; src/components/Navbar.tsx | fixed | src/components/MegaMenu.tsx; src/components/Navbar.tsx | O mega panel já aplica `max-h` viewport-safe com scroll interno, além de paddings mais compactos na abertura e no grid, o que mantém a área de Contato contida em desktop 100%. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-006 | VP-002 | shared public shell | desktop | mega menu open (Soluções) | high | docs/screenshots/VR-006-solucoes-megamenu-desktop-current.png | O painel expandido de Soluções também está vazando/estourando a viewport útil em desktop 100%, confirmando um problema sistêmico no shell expandido. A superfície fica longa demais e perde a contenção visual esperada. | O mega panel de Soluções deve manter contenção vertical e leitura confortável em desktop 100%, com composição mais disciplinada, altura mais segura e melhor distribuição entre mapa da área e cards inferiores. O resultado deve parecer mais controlado e editorial, seguindo a base Payload-inspired. | src/components/MegaMenu.tsx; src/components/Navbar.tsx | fixed | src/components/MegaMenu.tsx; src/components/Navbar.tsx | O mesmo ajuste sistêmico do mega menu já resolve Soluções: altura máxima baseada na viewport, overscroll contido e densidade mais disciplinada no header e no corpo do painel. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |

---

## VP-003 — Institucional

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-007 | VP-003 | /sobre | desktop | default | medium | docs/screenshots/VR-007-sobre-mvv-desktop-current.png | Na seção “Missão, Visão e Valores”, o painel principal da direita parece alto demais e opticamente desalinhado em relação ao bloco narrativo da esquerda. A composição perde equilíbrio editorial e passa sensação de encaixe impreciso. | O split layout deve ter baseline mais intencional entre coluna esquerda e painel principal direito, com alinhamento óptico mais calmo e equilibrado. A seção deve lembrar composições editoriais mais disciplinadas, no espírito Payload-inspired, sem parecer que a direita “subiu” em relação à esquerda. | src/components/MissaoVisaoValores.tsx; src/app/(frontend)/sobre/page.tsx | fixed | src/components/MissaoVisaoValores.tsx | O painel destacado segue ajustado apenas em desktop e o story foi formalmente fechado depois que `npm run lint`, `npx tsc --noEmit` e `npm run build` passaram em 2026-03-11. QA manual de browser permanece pendente. |

---

## VP-004 — Editorial e Prova Social

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-008 | VP-004 | /clientes | desktop | default | high | docs/screenshots/VR-008-clientes-desktop-current.png | O first fold de `/clientes` está comprimido pelo shell fixo: a faixa de CTA/hero fica parcialmente engolida logo abaixo da navbar, e a transição para o bloco de filtros começa cedo demais. A abertura da página perde respiro e parece acidental. | A abertura de `/clientes` deve respirar com clareza abaixo do shell, mantendo a faixa de CTA totalmente legível e separada da superfície de filtros. A transição hero → filtros deve parecer deliberada, contida e editorial, alinhada à base Payload-inspired. | src/components/ClientsPage.tsx; src/components/Navbar.tsx; src/styles/utilities.css | fixed | src/components/ClientsPage.tsx | O hero de `/clientes` já sobe o respiro em desktop e reduz a sobreposição do painel de filtros, devolvendo separação clara abaixo do shell fixo. Checks obrigatórios passaram em 2026-03-11 após rerun de `npm run build`; QA manual de browser permanece pendente. |
| VR-009 | VP-004 | /news | desktop | default | medium | docs/screenshots/VR-009-news-cta-desktop-current.png | Em `/news`, há um vazio vertical grande demais antes do CTA escuro “Se um tema do acervo...”. A costura entre as seções fica frouxa, com sensação de buraco no ritmo da página e de bloco final solto demais em relação ao conteúdo anterior. | A transição para o CTA final deve ter ritmo vertical mais controlado, com menos dead space e integração mais natural com o conteúdo anterior. A composição deve lembrar o espaçamento mais disciplinado e contínuo de páginas editoriais Payload-inspired. | src/app/(frontend)/news/page.tsx; src/components/PostList.tsx | fixed | src/app/(frontend)/news/page.tsx; src/components/PostList.tsx | A listagem editorial e o CTA final já usam costura vertical mais contida, com `section-space-tight` no bloco escuro e continuidade mais limpa a partir do arquivo. Checks obrigatórios passaram em 2026-03-11 após rerun de `npm run build`; QA manual de browser permanece pendente. |
| VR-010 | VP-004 | /news | desktop | default / empty state | high | docs/screenshots/VR-010-news-empty-newsletter-desktop-current.png | A sidebar/newsletter em `/news` está quebrada: o CTA azul circular cresce além do card, cobre conteúdo e compromete leitura, formulário e proporção da coluna lateral. O side rail perde completamente a contenção visual. | O card de newsletter deve permanecer contido, legível e utilizável dentro da coluna lateral, com CTA, inputs e copy respeitando as dimensões do card. A sidebar deve parecer limpa e editorial, não um bloco estourado fora da grid, seguindo a base Payload-inspired. | src/components/NewsletterForm.tsx; src/app/(frontend)/news/page.tsx | fixed | src/components/NewsletterForm.tsx; src/components/PostList.tsx | O side rail já renderiza `NewsletterForm compact`, com formulário em coluna única e CTA contido em largura total dentro do card, eliminando o overflow circular. Checks obrigatórios passaram em 2026-03-11 após rerun de `npm run build`; QA manual de browser permanece pendente. |

---

## VP-005 — Contato e Formulários

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-004 | VP-005 | /contato | desktop | default | high | docs/screenshots/VR-004-contato-desktop-current.png | A composição da página de contato está desequilibrada. O card branco da esquerda concentra formulário, checklist e conteúdo auxiliar demais, deixando o formulário comprimido e o CTA principal fraco. A coluna de unidades à direita acaba parecendo mais resolvida do que a ação principal da página. | O formulário deve ser o foco principal da página, com mais largura útil, melhor hierarquia interna e CTA mais forte. O conteúdo auxiliar deve apoiar o fluxo sem competir com ele, e o balanço entre coluna esquerda e direita deve ficar mais claro e profissional. A referência deve ser uma composição mais limpa, objetiva e editorial, alinhada à base Payload-inspired. | src/app/(frontend)/contato/page.tsx; src/components/ContatoPageForm.tsx | fixed | src/app/(frontend)/contato/page.tsx; src/components/ContatoPageForm.tsx | Rebalanced the section grid toward the primary form, converted the helper content into lighter supporting rails, and strengthened the submit tray so the contact action leads the page again. Checks obrigatórios passaram em 2026-03-11 após rerun de `npm run build`; QA manual de browser permanece pendente. |

---

## VP-006 — Soluções

No actionable issue rows are registered yet for this story family.

Closed on 2026-03-11: the active register still has no screenshot-backed or otherwise objective issue descriptions for `/solucoes`, category hubs, or solution detail pages, so `VP-006` was completed as a validation-only story with no product UI changes.

Validation note: `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed on 2026-03-11. `npm run test` is not defined in `package.json`. Browser tooling was not used, so manual QA remains pending if the Soluções routes are reviewed visually later.

---

## VP-008 — Follow-up de Shell, Homepage e Contato

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-011 | VP-008 | shared public shell | desktop-wide | default | high | docs/screenshots/VR-011-header-desktop-wide-current.png | Em telas maiores, o header perde contenção visual: a barra fica larga demais, com distribuição desequilibrada entre navegação, busca, ícones e CTA final. A CTA fica encostada ou cortada no limite direito e o shell perde a sensação de composição premium e contida. | O header deve permanecer contido e equilibrado em larguras maiores, com melhor largura máxima, distribuição entre grupos e respiro lateral. A composição deve parecer mais estável e editorial, alinhada à base Payload-inspired. | src/components/Navbar.tsx; src/styles/utilities.css | fixed | src/components/Navbar.tsx | A navbar desktop-wide agora limita o shell a `2xl:max-w-[82rem]`, usa grid de 3 colunas e controla melhor a largura de busca, socials e CTA, evitando corte ou aperto no limite direito. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-012 | VP-008 | / | desktop | default | medium | docs/screenshots/VR-012-home-hero-transition-current.png | O rótulo “Explorar” no fim do hero está grudado demais na surface seguinte, especialmente em relação ao bloco “Visão integrada”. Falta respiro na transição entre o hero e a seção subsequente, o que deixa a costura visual apertada e pouco intencional. | A transição hero → próxima seção deve ter zona de respiro mais clara, com separação melhor entre o indicador final do hero e o começo da próxima surface. O resultado deve parecer mais deliberado e calmo, no espírito Payload-inspired. | src/components/HomePage.tsx | fixed | src/components/HomePage.tsx | O hero ganhou mais padding inferior, o indicador “Explorar” desceu e a surface seguinte reduziu a sobreposição, devolvendo uma costura mais respirada com “Visão integrada”. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-013 | VP-008 | /contato | desktop | default | high | docs/screenshots/VR-013-contato-form-layout-current.png | O formulário principal de contato em duas colunas fica estranho para esse contexto consultivo. A leitura do fluxo fica quebrada, os campos competem horizontalmente e a superfície branca perde clareza. A composição parece mais complexa do que o necessário. | O formulário deve migrar para uma coluna única, com hierarquia mais clara, leitura mais linear e CTA mais forte. O conteúdo auxiliar deve virar apoio discreto, não dividir protagonismo com o form. A sensação geral deve ser mais limpa e editorial. | src/app/(frontend)/contato/page.tsx; src/components/ContatoPageForm.tsx | fixed | src/app/(frontend)/contato/page.tsx; src/components/ContatoPageForm.tsx | O formulário principal agora usa pilha única de campos, a abertura virou uma introdução linear com highlights discretos e a grid da rota amplia a área principal para reforçar a hierarquia consultiva. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-014 | VP-008 | /contato | desktop; mobile | default | medium | docs/screenshots/VR-014-contato-unidades-current.png; docs/screenshots/VR-014-contato-unidades-mobile-current.png | A indicação das filiais e unidades está pesada e literal demais, com cards escuros grandes e repetitivos. O bloco passa sensação de excesso de peso visual para conteúdo essencialmente informativo. Em mobile, a leitura continua correta, mas ainda densa demais. | As unidades devem ser apresentadas de maneira mais discreta, com menos peso de card, menos repetição visual e melhor escaneabilidade. A seção deve continuar institucional, mas mais leve e refinada, alinhada à base Payload-inspired. | src/app/(frontend)/contato/page.tsx; src/components/FooterUnidades.tsx | fixed | src/app/(frontend)/contato/page.tsx | A seção de unidades foi convertida para uma rail clara com lista empilhada, separadores sutis e linhas de contato compactas, reduzindo o peso visual tanto em desktop quanto em mobile. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |

---

## Resolution log

### Example

- `VR-012`
  - Status: fixed
  - Files: `src/components/Navbar.tsx`, `src/styles/utilities.css`
  - Resolution: reduced top padding and aligned CTA baseline with search trigger on desktop
  - QA: manual browser verification pending on desktop/tablet

---

## Notes

- Replace missing solutions issues with real screenshot-backed items as soon as they are available.
- Keep issues small and objective.
- Prefer one visual defect per issue row.
- If one shared-component fix resolves multiple issues, update all affected issue rows explicitly.
- When in doubt, prefer calmer, more contained, more editorial compositions aligned with the existing Payload-inspired shell rather than adding new decorative complexity.
