import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import GalaxyBackground from './components/GalaxyBackground';

export default function YeomniverseLanding() {
  const services = [
    {
      title: '효도티어',
      subtitle: 'Filial Piety Test',
      description:
        'What is your filial piety grade? Take the 2026 National Filial Piety Test to assess your relationship with your parents.',
      href: 'https://hyodo-tier.yeomniverse.com',
      gradient: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'FinBrief',
      subtitle: 'AI Financial Briefing',
      description:
        'AI-powered financial briefing you can read in 30 seconds. Get the essential news delivered to your Telegram every morning at 8 AM.',
      href: 'https://finbrief.yeomniverse.com',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Fixed Galaxy Background */}
      <GalaxyBackground />

      <main id="main-content" className="min-h-screen relative">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
              Yeomniverse
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-md">
            Explore our digital services
          </p>
        </section>

        {/* Services Grid */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                aria-label={`${service.title} - ${service.subtitle} - Get started`}
                className="group flex flex-col p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div className="mb-4">
                  <h2
                    className={`text-3xl font-black bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
                  >
                    {service.title}
                  </h2>
                  <p className="text-sm font-medium text-gray-300 mt-1">
                    {service.subtitle}
                  </p>
                </div>

                <p className="text-gray-200 leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>

                <div
                  className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all`}
                >
                  Get Started
                  <ArrowRight
                    aria-hidden="true"
                    className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-400">
          <p>2026 Yeomniverse. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
