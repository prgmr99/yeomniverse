# 💯 Hyo-Domain Monorepo

<div align="center">
  <img src="https://img.shields.io/badge/Turborepo-2.7-blue?style=for-the-badge&logo=turborepo&logoColor=white" />
  <img src="https://img.shields.io/badge/pnpm-9.0-yellow?style=for-the-badge&logo=pnpm&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" />
  <br/>
  
  <br/>
  
  <h3>🏗️ Turborepo Monorepo Architecture</h3>
  <p>
    A scalable monorepo structure for managing multiple services<br/>
    under a single domain with shared packages and optimized builds.
  </p>
</div>

---

## 📁 Project Structure

```
hyo-domain/
├── apps/
│   └── web/                  # Main Next.js application (hyo-tier)
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── utils/                # Shared utilities and constants
│   └── tsconfig/             # Shared TypeScript configurations
├── turbo.json                # Turborepo pipeline configuration
├── pnpm-workspace.yaml       # pnpm workspace configuration
└── package.json              # Root package configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.0+

### Installation

```bash
# Install dependencies for all workspaces
pnpm install
```

## 📝 Available Commands

### Development

```bash
# Run all dev servers
pnpm dev

# Run dev server for specific app
pnpm turbo dev --filter=@hyo/web
```

### Build

```bash
# Build all apps and packages
pnpm build

# Build specific app
pnpm turbo build --filter=@hyo/web
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Format all code
pnpm format
```

### Clean

```bash
# Clean all build outputs and node_modules
pnpm clean
```

## 📦 Packages

### @hyo/web
Main Next.js application featuring the 효도티어 (Filial Piety Test) service.

- **Path:** `apps/web/`
- **Tech:** Next.js 16, React 19, Tailwind CSS v4
- **Deploy:** Vercel

### @hyo/ui
Shared UI component library.

- **Path:** `packages/ui/`
- **Components:** Footer, Loading, GoogleAdSense, GoogleAnalytics, KakaoScript

### @hyo/utils
Shared utilities and helper functions.

- **Path:** `packages/utils/`  
- **Utilities:** QUESTIONS, Effects type, constants

### @hyo/tsconfig
Shared TypeScript configurations.

- **Path:** `packages/tsconfig/`
- **Configs:** base.json, nextjs.json, react-library.json

## 🔧 Adding a New App

1. Create app directory:
```bash
mkdir apps/my-new-app
```

2. Create `package.json`:
```json
{
  "name": "@hyo/my-new-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@hyo/ui": "workspace:*",
    "@hyo/utils": "workspace:*"
  }
}
```

3. Install dependencies:
```bash
pnpm install
```

4. Add to Turborepo tasks as needed.

## 🌐 Deployment

### Vercel Configuration

**Important:** For monorepo deployment, update your Vercel project settings:

1. **Root Directory:** `apps/web`
2. **Build Command:** `cd ../.. && pnpm turbo build --filter=@hyo/web`
3. **Install Command:** `pnpm install`
4. **Output Directory:** `.next`

📖 **Detailed instructions:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Quick Deploy

```bash
# Commit and push
git add .
git commit -m "feat: monorepo migration"
git push origin main
```

Vercel will automatically detect and deploy (after settings update).

## 🏛️ Architecture Benefits

✅ **Code Sharing** - Reuse components, utilities, and types across all apps  
✅ **Fast Builds** - Turborepo's intelligent caching and parallel execution  
✅ **Type Safety** - Shared TypeScript configurations ensure consistency  
✅ **Scalable** - Easy to add new services/apps to the same domain  
✅ **Developer Experience** - Single command to run/build all apps  

## 📚 Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)

---

## 💯 Main Service: 효도능력시험 (Hyo-Tier)

**효도티어(Hyo-Tier)** is a viral quiz service that tests how well you know your parents.

* **Concept:** 2025 Korean SAT exam design (Newtro aesthetic)
* **Target:** Digital natives (Mobile First)
* **Goal:** Viral sharing via KakaoTalk and family communication

### Key Features

- 📝 14 questions testing relationship depth
- 📊 8 unique personality type results
- 💌 KakaoTalk sharing integration
- 📱 Mobile-optimized experience

[👉 Take the Test](https://hyo-tier.vercel.app)

---

<div align="center">
  Built with ❤️ using Turborepo · Next.js · TypeScript
</div>
