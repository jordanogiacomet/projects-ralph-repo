# Visual Register

This file is the issue-level source of truth for the screenshot-driven visual-r1 cycle.

The visual direction for this round remains **Payload-inspired**, translated to Apollo's institutional context:

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
| VR-001 | VP-002 | / | desktop | default | high | docs/screenshots/VR-001-home-desktop-current.png | O overlap da seção seguinte está subindo demais e invadindo a área final do hero. Os CTAs ficam visualmente comprimidos entre o bloco de texto e o painel seguinte, e a transição entre seções parece acidental em vez de intencional. | O hero deve terminar com respiro claro abaixo dos CTAs, e o painel seguinte deve sobrepor de forma controlada sem "engolir" os botões nem competir com a área de ação principal. A transição deve parecer deliberada, mais próxima do ritmo limpo e editorial da referência Payload-inspired. | src/components/HomePage.tsx | open | | Priorizar ajuste de spacing inferior do hero, intensidade do overlap e convivência com o float de WhatsApp. |
| VR-002 | VP-002 | / | desktop | default | high | docs/screenshots/VR-002-home-navbar-desktop-current.png; docs/screenshots/VR-002-home-navbar-desktop-current-2.png | A navbar está densa demais: logo, navegação, busca, ícones sociais e CTA final competem no mesmo nível visual. O conjunto parece apertado, com busca curta, utilitários comprimidos e CTA encostada demais no limite direito. | O header deve ter hierarquia mais clara entre navegação principal, utilitários e CTA. Busca e CTA precisam de mais respiro, e o conjunto deve parecer mais limpo, premium e estável, com menos sensação de amontoado, mais próximo de um shell maduro no estilo Payload-inspired. | src/components/Navbar.tsx | open | | Rever padding horizontal, largura útil da busca, espaçamento entre grupos, peso dos ícones sociais e respiração do CTA final. |
| VR-003 | VP-002 | / | desktop | default | medium | docs/screenshots/VR-003-home-metrics-desktop-current.png | A fileira de métricas tem pouca presença institucional e a tipografia interna está mal resolvida. Números e labels parecem opticamente desalinhados, com pouco contraste hierárquico e padding interno fraco. | A seção de métricas deve comunicar autoridade com mais clareza: números com melhor protagonismo, labels melhor alinhadas, cards com padding e ritmo mais refinados e leitura mais equilibrada na fileira inteira. | src/components/HomePage.tsx | open | | Ajustar alinhamento interno, hierarquia tipográfica e presença visual sem transformar a seção em algo chamativo demais. |
| VR-005 | VP-002 | shared public shell | desktop | mega menu open (Contato) | high | docs/screenshots/VR-005-contato-megamenu-desktop-current.png | O painel expandido de navegação da área de Contato está vazando/estourando a altura útil da viewport em desktop 100%, fazendo o shell parecer grande demais, pesado e pouco contido. O painel perde sensação de controle e acabamento premium. | O mega panel deve caber com segurança dentro da viewport útil em desktop comum, com altura, densidade e distribuição de conteúdo mais controladas. A superfície expandida deve parecer contida e estável, mais próxima do comportamento de mega panels Payload-inspired. | src/components/MegaMenu.tsx; src/components/Navbar.tsx | open | | Tratar como problema de shell global, não como problema da página de contato. Rever altura total do panel, paddings, quantidade de conteúdo visível e estratégia de compressão/redistribuição em 100% de zoom. |
| VR-006 | VP-002 | shared public shell | desktop | mega menu open (Soluções) | high | docs/screenshots/VR-006-solucoes-megamenu-desktop-current.png | O painel expandido de Soluções também está vazando/estourando a viewport útil em desktop 100%, confirmando um problema sistêmico no shell expandido. A superfície fica longa demais e perde a contenção visual esperada. | O mega panel de Soluções deve manter contenção vertical e leitura confortável em desktop 100%, com composição mais disciplinada, altura mais segura e melhor distribuição entre mapa da área e cards inferiores. O resultado deve parecer mais controlado e editorial, seguindo a base Payload-inspired. | src/components/MegaMenu.tsx; src/components/Navbar.tsx | open | | Problema da mesma família de VR-005; se um único ajuste resolver os dois painéis, atualizar ambas as issues explicitamente. |

---

## VP-003 — Institucional

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-007 | VP-003 | /sobre | desktop | default | medium | docs/screenshots/VR-007-sobre-mvv-desktop-current.png | Na seção "Missão, Visão e Valores", o painel principal da direita parece alto demais e opticamente desalinhado em relação ao bloco narrativo da esquerda. A composição perde equilíbrio editorial e passa sensação de encaixe impreciso. | O split layout deve ter baseline mais intencional entre coluna esquerda e painel principal direito, com alinhamento óptico mais calmo e equilibrado. A seção deve lembrar composições editoriais mais disciplinadas, no espírito Payload-inspired, sem parecer que a direita "subiu" em relação à esquerda. | src/components/MissaoVisaoValores.tsx; src/app/(frontend)/sobre/page.tsx | open | | Rever alinhamento vertical entre os dois lados, espaçamento superior do painel destacado e ritmo entre título, copy e card principal. |

---

## VP-004 — Editorial e Prova Social

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-008 | VP-004 | /clientes | desktop | default | high | docs/screenshots/VR-008-clientes-desktop-current.png | O first fold de `/clientes` está comprimido pelo shell fixo: a faixa de CTA/hero fica parcialmente engolida logo abaixo da navbar, e a transição para o bloco de filtros começa cedo demais. A abertura da página perde respiro e parece acidental. | A abertura de `/clientes` deve respirar com clareza abaixo do shell, mantendo a faixa de CTA totalmente legível e separada da superfície de filtros. A transição hero → filtros deve parecer deliberada, contida e editorial, alinhada à base Payload-inspired. | src/components/ClientsPage.tsx; src/components/Navbar.tsx; src/styles/utilities.css | fixed | src/components/ClientsPage.tsx | Raised the desktop hero top/bottom spacing and softened the filter overlap so the CTA fold clears the fixed shell cleanly. QA: manual browser verification pending. |
| VR-009 | VP-004 | /news | desktop | default | medium | docs/screenshots/VR-009-news-cta-desktop-current.png | Em `/news`, há um vazio vertical grande demais antes do CTA escuro "Se um tema do acervo...". A costura entre as seções fica frouxa, com sensação de buraco no ritmo da página e de bloco final solto demais em relação ao conteúdo anterior. | A transição para o CTA final deve ter ritmo vertical mais controlado, com menos dead space e integração mais natural com o conteúdo anterior. A composição deve lembrar o espaçamento mais disciplinado e contínuo de páginas editoriais Payload-inspired. | src/app/(frontend)/news/page.tsx; src/components/PostList.tsx | fixed | src/app/(frontend)/news/page.tsx; src/components/PostList.tsx; src/components/NewsletterForm.tsx | Tightened the final CTA section spacing and reduced side-rail height through the compact newsletter layout so the editorial flow hands off without a visible gap. QA: manual browser verification pending. |
| VR-010 | VP-004 | /news | desktop | default / empty state | high | docs/screenshots/VR-010-news-empty-newsletter-desktop-current.png | A sidebar/newsletter em `/news` está quebrada: o CTA azul circular cresce além do card, cobre conteúdo e compromete leitura, formulário e proporção da coluna lateral. O side rail perde completamente a contenção visual. | O card de newsletter deve permanecer contido, legível e utilizável dentro da coluna lateral, com CTA, inputs e copy respeitando as dimensões do card. A sidebar deve parecer limpa e editorial, não um bloco estourado fora da grid, seguindo a base Payload-inspired. | src/components/NewsletterForm.tsx; src/app/(frontend)/news/page.tsx | fixed | src/components/NewsletterForm.tsx; src/components/PostList.tsx | Added a compact sidebar form variant that stacks the controls, removes the forced desktop button width, and keeps the CTA contained inside the rail card. QA: manual browser verification pending. |

---

## VP-005 — Contato e Formulários

| ID | Story | Route | Breakpoint | State | Severity | Screenshot(s) | Problem | Expected | Suspected area | Status | Changed files | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| VR-004 | VP-005 | /contato | desktop | default | high | docs/screenshots/VR-004-contato-desktop-current.png | A composição da página de contato está desequilibrada. O card branco da esquerda concentra formulário, checklist e conteúdo auxiliar demais, deixando o formulário comprimido e o CTA principal fraco. A coluna de unidades à direita acaba parecendo mais resolvida do que a ação principal da página. | O formulário deve ser o foco principal da página, com mais largura útil, melhor hierarquia interna e CTA mais forte. O conteúdo auxiliar deve apoiar o fluxo sem competir com ele, e o balanço entre coluna esquerda e direita deve ficar mais claro e profissional. A referência deve ser uma composição mais limpa, objetiva e editorial, alinhada à base Payload-inspired. | src/app/(frontend)/contato/page.tsx; src/components/ContatoPageForm.tsx | fixed | src/app/(frontend)/contato/page.tsx; src/components/ContatoPageForm.tsx | Rebalanced the section grid toward the primary form, converted the helper content into lighter supporting rails, and strengthened the submit tray so the contact action leads the page again. QA: manual browser verification pending. |

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

## Rename commands

```bash
mv <print-clientes> docs/screenshots/VR-008-clientes-desktop-current.png
mv <print-news-cta> docs/screenshots/VR-009-news-cta-desktop-current.png
mv <print-news-newsletter> docs/screenshots/VR-010-news-empty-newsletter-desktop-current.png
```

---

## Notes

- Replace missing solutions issues with real screenshot-backed items as soon as they are available.
- Keep issues small and objective.
- Prefer one visual defect per issue row.
- If one shared-component fix resolves multiple issues, update all affected issue rows explicitly.
- When in doubt, prefer calmer, more contained, more editorial compositions aligned with the existing Payload-inspired shell rather than adding new decorative complexity.
