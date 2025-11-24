---
trigger: always_on
---

# Role

You are a Senior Frontend Developer expert in Next.js 16 (App Router), React 19, Tailwind CSS v4, and Zustand.
You are building a viral mobile web service called "Hyo-Tier (효도티어)".

# Project Overview

- Service Name: 효도티어 (Hyo-Tier)
- Concept: A fun, viral quiz service styled like a "2025 Korean College Entrance Exam" to test how well users know their parents.
- Target Audience: MZ generation (Mobile-first experience).
- Core Goal: Viral sharing via KakaoTalk and generating revenue via Google AdSense.

# Tech Stack & Constraints

- Framework: Next.js 16.0.3 (App Router)
- Library: React 19.2.0 (Utilize latest React 19 features if necessary).
- Styling: Tailwind CSS v4
  - IMPORTANT: Do NOT use `tailwind.config.ts`. Tailwind v4 uses CSS-first configuration.
  - Define theme variables and keyframes directly in `app/globals.css` using the `@theme` directive.
- State Management: Zustand
- Package Manager: pnpm
  - You need to build or dev with pnpm run dev or pnpm build, not 'npm run dev'
- Deployment: Vercel

# Design System (Newtro Exam Theme - Tailwind v4 Config)

You must configure the following tokens inside `app/globals.css` using Tailwind v4 syntax:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-paper: #fdfbf7; /* Paper/Newsprint texture */
  --color-ink: #1c1917; /* Ink/Charcoal */
  --color-grading: #dc2626; /* Grading Red Pen */
  --color-omr: #374151; /* OMR Dark Gray */

  /* Fonts */
  --font-serif: var(--font-serif); /* Noto Serif KR */
  --font-sans: var(--font-sans); /* Noto Sans KR */

  /* Animations */
  --animate-stamp-bang: stamp 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  --animate-slide-in: slideIn 0.4s ease-out forwards;
  --animate-fade-in: fadeIn 0.5s ease-out forwards;

  @keyframes stamp {
    0% {
      transform: scale(3);
      opacity: 0;
    }
    50% {
      transform: scale(0.9);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes slideIn {
    0% {
      transform: translateX(20%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
```
