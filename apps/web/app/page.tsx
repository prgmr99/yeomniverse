import { Sparkles } from 'lucide-react';
import SplineExperience from './components/SplineExperience';

const services = [
  {
    title: '효도티어',
    subtitle: 'Filial Piety Test',
    description:
      '어버이날 특집 🌸 나는 효자일까 효녀일까? 2026 효도능력시험으로 부모님과 나의 관계를 테스트해보세요.',
    href: 'https://hyodo-tier.yeomniverse.com',
    accent: 'from-red-400 to-orange-400',
    glow: 'bg-orange-500/40',
    index: '01 — Quiz',
  },
  {
    title: 'FinBrief',
    subtitle: 'AI Financial Briefing',
    description:
      'AI-powered financial briefing you can read in 30 seconds. Get the essential news delivered to your Telegram every morning at 8 AM.',
    href: 'https://finbrief.yeomniverse.com',
    accent: 'from-sky-400 to-cyan-300',
    glow: 'bg-cyan-500/40',
    index: '02 — Brief',
  },
  {
    title: 'NeuroTrade',
    subtitle: 'Simulated Financial Trading',
    description:
      'A web-based educational trading simulator where players analyze fictional news events to predict market movements.',
    href: 'https://neuro-trade.yeomniverse.com',
    accent: 'from-emerald-300 to-green-400',
    glow: 'bg-emerald-500/40',
    index: '03 — Sim',
  },
  {
    title: 'Argus',
    subtitle: 'Global Situation Map',
    description:
      'An interactive world map layering conflict, diplomacy, markets, and technology into one glanceable view of global affairs.',
    href: 'https://argus.yeomniverse.com',
    accent: 'from-violet-400 to-fuchsia-400',
    glow: 'bg-violet-500/40',
    index: '04 — Map',
  },
];

export default function YeomniverseLanding() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <main id="main-content" className="relative min-h-screen">
        <SplineExperience services={services}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0d0f17]/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />A digital
            craft universe
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] md:text-7xl lg:text-8xl">
            Yeomniverse
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-lg">
            Four worlds of digital craft, orbiting one idea.
          </p>
        </SplineExperience>
      </main>
    </>
  );
}
