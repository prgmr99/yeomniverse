import SplineExperience from './components/SplineExperience';

export default function YeomniverseLanding() {
  const services = [
    {
      title: '효도티어',
      subtitle: 'Filial Piety Test',
      description:
        'What is your filial piety grade? Take the 2026 National Filial Piety Test to assess your relationship with your parents.',
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
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <main id="main-content" className="relative min-h-screen">
        <SplineExperience services={services} />
      </main>
    </>
  );
}
