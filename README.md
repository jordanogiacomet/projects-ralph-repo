# Apollo Gestão Website

Recriação do site institucional da Apollo Gestão com Next.js + Payload CMS.

O projeto migra o site de WordPress para uma stack moderna com conteúdo administrável no Payload, mantendo a estrutura institucional, páginas de soluções, clientes, conteúdos, blog/news e formulários.

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Payload CMS 3 (integrado ao Next)
- PostgreSQL
- Tailwind CSS 3
- React Hook Form
- Framer Motion

## Arquitetura

- Frontend: `src/app/(frontend)`
- Payload Admin/API: `src/app/(payload)`
- Collections: `src/collections`
- Globals: `src/globals`
- Blocks CMS: `src/blocks`
- Renderização de blocos: `src/components/BlockRenderer.tsx`
- Config central do Payload: `src/payload.config.ts`
- Seed inicial: `src/seed.ts`

## Pré-requisitos

- Node.js 20 LTS (recomendado)
- npm 10+
- PostgreSQL acessível pela aplicação

## Setup Local

1. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Instale dependências:

```bash
npm install --legacy-peer-deps
```

3. Rode em desenvolvimento:

```bash
npm run dev
```

4. Acesse:

- Site: `http://localhost:3000`
- Admin Payload: `http://localhost:3000/admin`

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URI` | Sim | String de conexão PostgreSQL usada pelo Payload |
| `PAYLOAD_SECRET` | Sim | Chave secreta para autenticação/sessões do Payload |
| `NEXT_PUBLIC_SERVER_URL` | Sim (produção) | URL pública canônica do site (SEO/canonical/sitemap) |
| `NEXT_PUBLIC_SITE_URL` | Opcional | Alias legado para URL pública (fallback) |

### S3 (opcional)

Use apenas se o projeto migrar uploads para storage S3/compatível:

- `S3_BUCKET`
- `S3_REGION`
- `S3_ENDPOINT` (se provider compatível S3)
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

Atualmente o projeto usa upload local (`media`) via Payload.

## Seed de Dados

Para popular categorias, soluções, segmentos, globals e páginas base:

```bash
npm run seed
```

Requisitos:

- `DATABASE_URI` configurada
- `PAYLOAD_SECRET` configurado

O seed é idempotente (registros existentes por slug são preservados).

## Scripts

- `npm run dev` inicia ambiente local
- `npm run build` gera build de produção
- `npm run start` sobe build de produção
- `npm run lint` roda lint
- `npm run generate:types` atualiza `src/payload-types.ts`
- `npm run generate:importmap` atualiza import map do admin
- `npm run seed` executa seed de conteúdo inicial

## Deploy na Vercel

1. Crie um banco PostgreSQL gerenciado (Neon, Supabase, RDS etc.).
2. Importe este repositório na Vercel.
3. Configure as variáveis em Project Settings -> Environment Variables:
   - `DATABASE_URI`
   - `PAYLOAD_SECRET`
   - `NEXT_PUBLIC_SERVER_URL`
   - opcionais de S3 (se aplicável)
4. Defina `NEXT_PUBLIC_SERVER_URL` com o domínio final (exemplo: `https://www.apollogestao.com.br`).
5. Faça deploy.

Este repositório inclui `vercel.json` com:

- `installCommand`: `npm install --legacy-peer-deps`
- `buildCommand`: `npm run build`

## Deploy Containerizado (Opcional)

Para ambientes fora da Vercel, há um `Dockerfile` multi-stage.

Build:

```bash
docker build -t apollo-gestao-website .
```

Run:

```bash
docker run --rm -p 3000:3000 \
  -e DATABASE_URI="postgres://..." \
  -e PAYLOAD_SECRET="..." \
  -e NEXT_PUBLIC_SERVER_URL="https://seu-dominio.com" \
  apollo-gestao-website
```

## Domínio Personalizado (Vercel)

1. Em Vercel -> Project -> Settings -> Domains, adicione o domínio.
2. Configure DNS conforme instruções da Vercel:
   - `A`/`ALIAS` para domínio raiz
   - `CNAME` para `www` (quando aplicável)
3. Após propagação, confirme HTTPS ativo.
4. Atualize `NEXT_PUBLIC_SERVER_URL` para o domínio canônico final.

## Guia para Editores (Payload Admin)

Guia rápido disponível em [docs/payload-admin-guide.md](docs/payload-admin-guide.md):

- criar post no blog/news
- editar páginas institucionais
- adicionar cliente e segmento

## Backup e Recuperação

Estratégia e comandos em [docs/backup-strategy.md](docs/backup-strategy.md):

- dump PostgreSQL (`pg_dump`)
- backup de uploads (`media`)
- retenção e restauração básica

## Qualidade

Checks recomendados antes de deploy:

```bash
npm run lint
npx tsc --noEmit
npm run build
```
