# Yeomniverse

<div align="center">
  <p>
    Building creative and useful digital services to share with the world
  </p>
  <p>
    <a href="https://yeomniverse.com">yeomniverse.com</a>
  </p>
</div>

---

## Services

### Hyodo-Tier (효도티어)
**2026 National Filial Piety Aptitude Test**

`한국어`

A quiz that measures how much you actually know about your parents, scored across three axes — attention, closeness, and expression.

- 15 questions, 9 result types and a grade
- A parent-facing counterpart (14 questions, 8 types) so both sides can compare
- Parent interview question sheet handed out with the result
- KakaoTalk sharing with generated result cards
- No sign-up; answers stay in the browser session and are never stored

[Visit Hyodo-Tier](https://hyodo-tier.yeomniverse.com) · [About](https://yeomniverse.com/services/hyodo-tier)

---

### FinBrief
**Daily Morning Financial Market Summary**

`한국어` `English`

AI-curated global financial news delivered to your Telegram every morning.

- Daily delivery before 8 AM KST, fully automated
- Gemini AI-powered summaries
- Curated from major financial media RSS feeds
- One-Way Index, a single number for how far the market is leaning
- Archive of past briefings by date

[Subscribe to FinBrief](https://finbrief.yeomniverse.com) · [About](https://yeomniverse.com/services/finbrief)

---

### NeuroTrade
**Simulated Financial Trading Game**

`한국어` `English`

A web-based educational trading simulator where players analyze fictional news events to predict market movements and manage a digital portfolio.

- News-driven dynamic market engine
- 5-day trading cycle simulation
- Interactive portfolio dashboard with candlestick charts
- Bilingual support (English / Korean)
- Day-end market impact summaries

[Visit NeuroTrade](https://neuro-trade.yeomniverse.com) · [About](https://yeomniverse.com/services/neuro-trade)

---

### Argus
**Global Situation Map**

`한국어` `English`

An interactive dashboard that maps the world's major developments onto a single world map, giving a strategy-game-style overview of global affairs at a glance.

- Four toggleable layers: war & conflict, geopolitics, finance, technology & energy
- Per-country detail panel with current conflicts, issues, and trends
- Live indicator ticker and auto-refreshing breaking news feed
- Historical archive for reviewing past snapshots of world state

[Visit Argus](https://argus.yeomniverse.com) · [About](https://yeomniverse.com/services/argus)

---

### Chijob (치잡)
**Anonymous Workplace Reviews for Dental Staff**

`한국어`

Dental hygienists and assistants rarely get to know what a clinic is like before they take the job. Chijob puts every clinic in the country on the map and lets the people who worked there say what it was like.

- Nationwide clinic directory built from HIRA public health insurance data
- Reviews split into pay, work-life balance, atmosphere, and growth
- Fully anonymous, moderated before publishing
- Region drill-down from province to district
- Six-question diagnostic that places your current conditions against the national spread
- Guides on hiring, practice, and workers' rights

[Visit Chijob](https://chijob.vercel.app) · [About](https://yeomniverse.com/services/chijob)

---

### Ansim Wolse (안심월세)
**Seoul Rental Comparison, Scored on the Walk Home and the Contract**

`한국어`

Listing photos never tell you what the walk from the station looks like at 11pm, or what the property register says. This scores both before you sign.

- Walk route split into main roads and alleys, scored on CCTV and street-light density
- Walking time, nearby police posts, adjacent road width, nightlife proximity
- Adjustable weights; missing data is excluded rather than scored as zero
- Contract safety tracked separately in four stages, from documents through move-in
- On-site checklist per listing, and a shared board you can invite someone to
- Built entirely on Korean public datasets

[Visit Ansim Wolse](https://ansim.yeomniverse.com/login.html) · [About](https://yeomniverse.com/services/ansim-wolse)

---

## Repository

This is a Turborepo monorepo (Next.js 16, React 19, TypeScript 5) holding the hub, Hyodo-Tier, and FinBrief. NeuroTrade, Argus, Chijob, and Ansim Wolse live in their own repositories.

```
apps/web/          Hub — yeomniverse.com
apps/hyodo-tier/   효도티어
apps/finbrief/     FinBrief web app
finbrief/          FinBrief briefing pipeline (standalone Node service)
packages/          Shared UI, utils, services, API layer, tsconfig
```

```bash
pnpm install
pnpm dev                                 # all dev servers
pnpm turbo dev --filter=@hyo/web         # just the hub
pnpm lint                                # Biome
pnpm test                                # Vitest
```

See [CLAUDE.md](CLAUDE.md) for the fuller development guide.

---

## Contact

Questions or suggestions? Feel free to reach out.

- GitHub: [@prgmr99](https://github.com/prgmr99)
- Email: johnyeom24@naver.com
