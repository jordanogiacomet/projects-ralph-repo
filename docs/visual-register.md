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

## VP-001 — Bootstrap do ciclo visual e registro de issues

Bootstrap status: `fixed`

- O registro ativo deste ciclo está versionado neste arquivo e organizado por família de story/template.
- As issues atuais já incluem route, breakpoint, state, severity, screenshot(s), problem, expected, suspected area e status.
- Esta story não possui issues de produto próprias; este run apenas formalizou o bootstrap do ciclo sem alterar UI pública.
- QA: verificação de browser não se aplica a esta story. QA manual permanece pendente para as próximas stories visuais.

---

## VP-002 — Shell e Homepage

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-001 | VP-002 | / | desktop | default | high | docs/screenshots/VR-001-home-desktop-current.png | O overlap da seção seguinte está subindo demais e invadindo a área final do hero. Os CTAs ficam visualmente comprimidos entre o bloco de texto e o painel seguinte, e a transição entre seções parece acidental em vez de intencional. | O hero deve terminar com respiro claro abaixo dos CTAs, e o painel seguinte deve sobrepor de forma controlada sem “engolir” os botões nem competir com a área de ação principal. A transição deve parecer deliberada, mais próxima do ritmo limpo e editorial da referência Payload-inspired. | src/components/HomePage.tsx | fixed | src/components/HomePage.tsx | Aumentado o respiro inferior do hero e reduzido o overlap do painel introdutório com um wrapper mais contido. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-002 | VP-002 | / | desktop | default | high | docs/screenshots/VR-002-home-navbar-desktop-current.png; docs/screenshots/VR-002-home-navbar-desktop-current-2.png | A navbar está densa demais: logo, navegação, busca, ícones sociais e CTA final competem no mesmo nível visual. O conjunto parece apertado, com busca curta, utilitários comprimidos e CTA encostada demais no limite direito. | O header deve ter hierarquia mais clara entre navegação principal, utilitários e CTA. Busca e CTA precisam de mais respiro, e o conjunto deve parecer mais limpo, premium e estável, com menos sensação de amontoado, mais próximo de um shell maduro no estilo Payload-inspired. | src/components/Navbar.tsx | fixed | src/components/Navbar.tsx | Reduzida a densidade do shell desktop na home com mais padding lateral, busca mais larga, brand tag postergada para `2xl` e remoção do item redundante `Home` no desktop de `/`. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-003 | VP-002 | / | desktop | default | medium | docs/screenshots/VR-003-home-metrics-desktop-current.png | A fileira de métricas tem pouca presença institucional e a tipografia interna está mal resolvida. Números e labels parecem opticamente desalinhados, com pouco contraste hierárquico e padding interno fraco. | A seção de métricas deve comunicar autoridade com mais clareza: números com melhor protagonismo, labels melhor alinhadas, cards com padding e ritmo mais refinados e leitura mais equilibrada na fileira inteira. | src/components/HomePage.tsx | fixed | src/components/HomePage.tsx | Reforçada a hierarquia interna dos cards de métricas com pilha vertical consistente, padding mais firme e alinhamento institucional mais claro. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-005 | VP-002 | shared public shell | desktop | mega menu open (Contato) | high | docs/screenshots/VR-005-contato-megamenu-desktop-current.png | O painel expandido de navegação da área de Contato está vazando/estourando a altura útil da viewport em desktop 100%, fazendo o shell parecer grande demais, pesado e pouco contido. O painel perde sensação de controle e acabamento premium. | O mega panel deve caber com segurança dentro da viewport útil em desktop comum, com altura, densidade e distribuição de conteúdo mais controladas. A superfície expandida deve parecer contida e estável, mais próxima do comportamento de mega panels Payload-inspired. | src/components/MegaMenu.tsx; src/components/Navbar.tsx | fixed | src/components/MegaMenu.tsx; src/components/Navbar.tsx | O mega panel recebeu compactação de espaçamentos, redistribuição do topo e `max-height` com scroll interno para caber na viewport útil. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |
| VR-006 | VP-002 | shared public shell | desktop | mega menu open (Soluções) | high | docs/screenshots/VR-006-solucoes-megamenu-desktop-current.png | O painel expandido de Soluções também está vazando/estourando a viewport útil em desktop 100%, confirmando um problema sistêmico no shell expandido. A superfície fica longa demais e perde a contenção visual esperada. | O mega panel de Soluções deve manter contenção vertical e leitura confortável em desktop 100%, com composição mais disciplinada, altura mais segura e melhor distribuição entre mapa da área e cards inferiores. O resultado deve parecer mais controlado e editorial, seguindo a base Payload-inspired. | src/components/MegaMenu.tsx; src/components/Navbar.tsx | fixed | src/components/MegaMenu.tsx; src/components/Navbar.tsx | O mesmo ajuste compartilhado do mega menu agora contém o painel de Soluções em desktop 100% sem estourar a viewport útil. Checks obrigatórios passaram em 2026-03-11; QA manual de browser permanece pendente. |

---

## VP-003 — Institucional

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-007 | VP-003 | /sobre | desktop | default | medium | docs/screenshots/VR-007-sobre-mvv-desktop-current.png | Na seção “Missão, Visão e Valores”, o painel principal da direita parece alto demais e opticamente desalinhado em relação ao bloco narrativo da esquerda. A composição perde equilíbrio editorial e passa sensação de encaixe impreciso. | O split layout deve ter baseline mais intencional entre coluna esquerda e painel principal direito, com alinhamento óptico mais calmo e equilibrado. A seção deve lembrar composições editoriais mais disciplinadas, no espírito Payload-inspired, sem parecer que a direita “subiu” em relação à esquerda. | src/components/MissaoVisaoValores.tsx; src/app/(frontend)/sobre/page.tsx | open |  | Rever alinhamento vertical entre os dois lados, espaçamento superior do painel destacado e ritmo entre título, copy e card principal. |

---

## VP-004 — Editorial e Prova Social

No screenshot-backed issues registered yet for this story family.

---

## VP-005 — Contato e Formulários

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-004 | VP-005 | /contato | desktop | default | high | docs/screenshots/VR-004-contato-desktop-current.png | A composição da página de contato está desequilibrada. O card branco da esquerda concentra formulário, checklist e conteúdo auxiliar demais, deixando o formulário comprimido e o CTA principal fraco. A coluna de unidades à direita acaba parecendo mais resolvida do que a ação principal da página. | O formulário deve ser o foco principal da página, com mais largura útil, melhor hierarquia interna e CTA mais forte. O conteúdo auxiliar deve apoiar o fluxo sem competir com ele, e o balanço entre coluna esquerda e direita deve ficar mais claro e profissional. A referência deve ser uma composição mais limpa, objetiva e editorial, alinhada à base Payload-inspired. | src/app/(frontend)/contato/page.tsx; src/components/ContatoPageForm.tsx | open |  | Rever distribuição entre formulário e conteúdo auxiliar, tamanho/peso do botão principal, largura dos campos e densidade geral do card branco. |

---

## VP-006 — Soluções

No screenshot-backed issues registered yet for this story family.

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

- Replace placeholder or missing solution/editorial issues with real screenshot-backed items as soon as they are available.
- Keep issues small and objective.
- Prefer one visual defect per issue row.
- If one shared-component fix resolves multiple issues, update all affected issue rows explicitly.
- When in doubt, prefer calmer, more contained, more editorial compositions aligned with the existing Payload-inspired shell rather than adding new decorative complexity.
