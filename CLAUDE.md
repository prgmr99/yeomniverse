# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yeomniverse is a Turborepo monorepo containing multiple digital services built with Next.js 16, React 19, and TypeScript 5.

Not every Yeomniverse service lives here. NeuroTrade, Argus, 치잡, and 안심월세 are separate repositories; this monorepo holds the hub, 효도티어, and FinBrief.

## Commands

```bash
# Development
pnpm dev                                    # Run all dev servers
pnpm turbo dev --filter=@hyo/web            # Hub          (port 3003)
pnpm turbo dev --filter=@hyo/hyodo-tier     # 효도티어      (port 3001)
pnpm turbo dev --filter=@hyo/finbrief       # FinBrief     (port 3002)

# Build
pnpm build                                  # Build all
pnpm turbo build --filter=@hyo/web          # Build one

# Code Quality
pnpm lint                                   # Biome check (not ESLint)
pnpm format                                 # Biome check --write
pnpm test                                   # Vitest across all workspaces
pnpm test:e2e                               # Playwright (hyodo-tier only)
pnpm clean

# FinBrief briefing pipeline (standalone Node service in /finbrief)
cd finbrief && npm run send-briefing        # Full pipeline
cd finbrief && npm run test:rss             # RSS collection only
cd finbrief && npm run test:ai              # Gemini analysis only
cd finbrief && npm run test:telegram        # Telegram delivery only
```

## Architecture

```
yeomniverse/
├── apps/
│   ├── web/                # Hub — yeomniverse.com (@hyo/web)
│   ├── hyodo-tier/         # 효도티어 — hyodo-tier.yeomniverse.com (@hyo/hyodo-tier)
│   ├── finbrief/           # FinBrief — finbrief.yeomniverse.com (@hyo/finbrief)
│   └── finbrief-landing/   # Orphaned: 3 API route files, no package.json. Not a
│                           # workspace member and not deployed. Ignore or remove.
├── packages/
│   ├── ui/                 # Shared React components (@hyo/ui)
│   ├── utils/              # Quiz constants and scoring (@hyo/utils)
│   ├── services/           # Email/templates (@hyo/services)
│   ├── finbrief-api/       # FinBrief shared API layer (@hyo/finbrief-api)
│   └── tsconfig/           # Shared TypeScript configs (@hyo/tsconfig)
├── finbrief/               # Standalone Node service (not a workspace package)
├── supabase/               # SQL schema
├── turbo.json
└── vitest.workspace.ts     # Lists which packages/apps run tests
```

**Package naming**: shared packages use the `@hyo/*` prefix. Use `workspace:*` for internal dependencies.

## Key Technologies

- **Framework**: Next.js 16, App Router
- **Linting/Formatting**: Biome — each app has its own `biome.json` (`apps/web`, `apps/hyodo-tier`, `apps/finbrief`)
- **Styling**: Tailwind CSS v4
- **State**: Zustand (효도티어 quiz)
- **Animations**: Framer Motion (효도티어, FinBrief); the hub landing uses CSS keyframes instead so it ships no animation runtime
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library; Playwright for 효도티어 e2e

## Services

### Hub (`apps/web`)
Landing page plus the content pages that carry the root domain: service write-ups at
`/services/<slug>`, and `/about`, `/contact`, `/privacy`, `/terms`.

Two things to know before editing:

**`lib/services.ts` is the single source of truth for services.** The home list, the Spline
modal cards, the footer, the sitemap, and every `/services/<slug>` page all derive from it.
Adding a service there is enough — no other file needs editing. Each entry carries
`access: 'public' | 'private'`; a `private` service renders no outbound link anywhere
(it would lead to a login wall), and `accessNote` adds a line under the CTA for services
that need a login.

**`middleware.ts` issues a per-request CSP nonce, which makes every route dynamic.** Google
does not support domain allowlisting for AdSense, so `script-src` uses
`'nonce-…' 'strict-dynamic'`. A nonce has to be generated per response, so `app/layout.tsx`
reads it via `headers()` and no page can be statically prerendered. Do not also set a CSP in
`next.config.ts` — two CSP headers are intersected by the browser and that breaks ad serving.

### 효도티어 (`apps/hyodo-tier`)
Korean quiz (효도능력시험) with a child-facing test and a parent-facing counterpart, plus a
blog and per-result-type landing pages. KakaoTalk sharing with dynamically generated OG cards
(`/api/og`, edge runtime).

Quiz state lives in `sessionStorage` via Zustand `persist` — nothing is sent to a server.

Question counts and result types come from `@hyo/utils` (`QUESTION_COUNT`,
`PARENT_QUESTION_COUNT`). **Import them; never hardcode the numbers.** They have drifted
before — `public/manifest.json` still says 14 questions while the constant is 15.

### FinBrief (`apps/finbrief` + `finbrief/`)
`apps/finbrief` is the web app (landing, dashboard, briefing archive, One-Way Index).
`finbrief/` is a separate Node service that collects financial news over RSS, summarizes it
with Gemini, and sends it to Telegram. It runs from GitHub Actions, not Vercel.

## Deployment

**Vercel** — one project per app. For the hub:
- Root Directory: `apps/web`
- Build Command: `cd ../.. && pnpm turbo build --filter=@hyo/web`
- Install Command: `pnpm install`

**`NEXT_PUBLIC_DOMAIN_URL` decides `canonical`, `og:url`, and every sitemap entry.** If it is
wrong in Vercel, the whole site silently canonicalizes to the wrong host and search engines
drop it. `apps/web/lib/site.ts` falls back to `https://yeomniverse.com`, but a wrong value in
Vercel still wins over the fallback. It is inlined at build time, so changing it requires a
redeploy without the build cache.

**GitHub Actions** — `.github/workflows/daily-briefing.yml`, cron `30 22 * * *` UTC
(07:30 KST). `test.yml` runs on push.

## Code Style

- Biome handles linting and formatting (2-space indent, single quotes, semicolons, 80 cols)
- TypeScript strict mode
- Public environment variables must be prefixed with `NEXT_PUBLIC_`
- Comments explain what the code cannot say for itself — an external constraint, a workaround,
  a non-obvious contract. Keep them to a line, in Korean, matching the surrounding files.
