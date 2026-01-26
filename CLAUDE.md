# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yeomniverse is a Turborepo monorepo containing multiple digital services built with Next.js 16, React 19, and TypeScript 5.

## Commands

```bash
# Development
pnpm dev                              # Run all dev servers
pnpm turbo dev --filter=@hyo/web      # Run specific service

# Build
pnpm build                            # Build all services
pnpm turbo build --filter=@hyo/web    # Build specific service

# Code Quality
pnpm lint                             # Lint all packages (uses Biome, not ESLint)
pnpm format                           # Format all code
pnpm clean                            # Clean build outputs and node_modules

# FinBrief (standalone Node.js service in /finbrief)
cd finbrief && npm run send-briefing  # Run full briefing pipeline
cd finbrief && npm run test:rss       # Test RSS collection
cd finbrief && npm run test:ai        # Test AI analysis
cd finbrief && npm run test:telegram  # Test Telegram notifications
```

## Architecture

```
yeomniverse/
├── apps/
│   ├── web/                    # Hyo-Tier quiz app (Next.js)
│   └── finbrief-landing/       # FinBrief landing page (Next.js)
├── packages/
│   ├── ui/                     # Shared React components (@hyo/ui)
│   ├── utils/                  # Shared utilities & constants (@hyo/utils)
│   └── tsconfig/               # Shared TypeScript configs (@hyo/tsconfig)
├── finbrief/                   # Standalone Node.js AI briefing service
└── turbo.json                  # Turborepo pipeline config
```

**Package naming**: All shared packages use `@hyo/*` prefix. Use `workspace:*` protocol for internal dependencies.

## Key Technologies

- **Framework**: Next.js 16 with App Router
- **Linting/Formatting**: Biome (not ESLint/Prettier) - config in `apps/web/biome.json`
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Services

### Hyo-Tier (`apps/web`)
Korean personality quiz (효도능력시험) with 14 questions and 8 personality types. Features KakaoTalk sharing integration. Production: https://hyo-tier.vercel.app

### FinBrief (`finbrief/`)
Node.js service that collects financial news via RSS, summarizes with Gemini AI, and sends daily Telegram notifications. Runs via GitHub Actions at 8 AM KST.

### FinBrief Landing (`apps/finbrief-landing`)
Landing page for FinBrief subscription.

## Deployment

**Vercel** (for Next.js apps):
- Root Directory: `apps/web`
- Build Command: `cd ../.. && pnpm turbo build --filter=@hyo/web`
- Install Command: `pnpm install`

**GitHub Actions** (for FinBrief):
- Workflow: `.github/workflows/daily-briefing.yml`
- Schedule: Daily at 08:00 KST

## Code Style

- Biome handles linting and formatting (2-space indent, single quotes, semicolons)
- TypeScript strict mode enabled
- Public environment variables must be prefixed with `NEXT_PUBLIC_`
