'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  ChevronDown,
  MessageCircle,
  Send,
  Target,
  Zap,
} from 'lucide-react';
import { useRef, useState } from 'react';
import BriefingSample from '@/components/BriefingSample';
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/landing';
import MarketPulse from '@/components/MarketPulse';
import { useBriefingData } from '@/hooks/useBriefingData';
import './finbrief.css';

export default function FinBriefPage() {
  const { data, isLoading } = useBriefingData();

  return (
    <main className="relative">
      <HeroSection />
      <ValueProposition />
      <FeatureShowcase />
      <HowItWorks />
      <MarketPulse data={data} isLoading={isLoading} />
      <BriefingSample data={data} isLoading={isLoading} />
      <HowToRead />
      <CTASection />
      <Footer />
    </main>
  );
}

// ============================================
// Hero Section - Full viewport with animations
// ============================================
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale, willChange: 'transform, opacity' }}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      <div className="relative z-10 text-center max-w-[980px] mx-auto">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-bold tracking-tight mb-6"
          style={{ fontSize: 'clamp(64px, 14vw, 140px)', lineHeight: 1 }}
        >
          <span
            style={{
              color: '#FFFFFF',
              textShadow:
                '0 4px 8px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3), 0 16px 64px rgba(0,0,0,0.2)',
            }}
          >
            FinBrief
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="mb-10 max-w-[680px] mx-auto font-medium"
          style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            color: 'rgba(255,255,255,0.95)',
            textShadow:
              '0 2px 4px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          The morning's market news, in five minutes
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <a
            href="#subscribe"
            className="btn-metal inline-flex items-center gap-2 px-8 py-4 rounded-full text-base"
            style={{ color: '#0071E3' }}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          <span className="text-sm">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// ============================================
// Value Proposition - Large text reveal
// ============================================
function ValueProposition() {
  return (
    <section
      className="px-6 bg-[#f5f5f7]"
      style={{ padding: 'clamp(80px, 12vh, 150px) 24px' }}
    >
      <div className="max-w-[980px] mx-auto text-center">
        <StaggerContainer staggerDelay={0.15} className="space-y-6">
          <StaggerItem>
            <p
              className="font-semibold text-finbrief-black"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.2 }}
            >
              AI reads <span className="text-gradient">about 50 articles</span>,
            </p>
          </StaggerItem>
          <StaggerItem>
            <p
              className="font-semibold text-finbrief-black"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.2 }}
            >
              and keeps the <span className="text-gradient">10</span> that moved
              the market.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <ScrollReveal delay={0.4} className="mt-10">
          <p
            className="text-finbrief-gray-500 max-w-[680px] mx-auto"
            style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
          >
            Experience fund manager-level curation, for free.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ============================================
// Feature Showcase - Dark section with cards
// ============================================
function FeatureShowcase() {
  const features = [
    {
      icon: Zap,
      title: 'Five-Minute Read',
      description:
        'Catch the key points quickly on your commute or before lunch.',
    },
    {
      icon: Brain,
      title: 'AI Curation',
      description:
        'Gemini scores every story for market impact, then keeps the ten that carried the day.',
    },
    {
      icon: Target,
      title: 'Tailored Insights',
      description:
        'Get clear market analysis to instantly judge bullish or bearish signals.',
    },
  ];

  return (
    <section
      className="px-6 bg-finbrief-black"
      style={{ padding: 'clamp(80px, 12vh, 150px) 24px' }}
    >
      <div className="max-w-[980px] mx-auto">
        <ScrollReveal>
          <p className="text-finbrief-gray-500 text-base font-medium tracking-wide uppercase mb-4">
            KEY FEATURES
          </p>
          <h2
            className="text-finbrief-white font-semibold mb-10"
            style={{ fontSize: 'clamp(36px, 5vw, 48px)', lineHeight: 1.15 }}
          >
            Smarter.
            <br />
            Faster.
          </h2>
        </ScrollReveal>

        <StaggerContainer
          staggerDelay={0.2}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="p-8 h-90 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <feature.icon
                  className="w-12 h-12 mb-6"
                  style={{ color: '#2997FF' }}
                />
                <h3
                  className="text-finbrief-white mb-4"
                  style={{ fontSize: 'clamp(24px, 4vw, 40px)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-finbrief-gray-500 leading-relaxed break-keep">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ============================================
// How It Works - Step by step
// ============================================
function HowItWorks() {
  const steps = [
    { number: '01', title: 'Every dawn, AI reads about 50 articles' },
    { number: '02', title: 'Keeps the 10 that moved the market' },
    { number: '03', title: 'Delivered via Telegram at 8 AM' },
  ];

  return (
    <section
      className="px-6 bg-[#f5f5f7]"
      style={{ padding: 'clamp(80px, 12vh, 150px) 24px' }}
    >
      <div className="max-w-[980px] mx-auto">
        <ScrollReveal className="text-center mb-10">
          <p className="text-finbrief-gray-500 text-base font-medium tracking-wide uppercase mb-4">
            HOW IT WORKS
          </p>
          <h2
            className="text-finbrief-black font-semibold"
            style={{ fontSize: '36px' }}
          >
            Here's how it works
          </h2>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.2} className="max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <StaggerItem key={step.number}>
              <div className="flex items-start gap-6 mb-12 last:mb-0">
                <div
                  className="flex-shrink-0 rounded-full bg-finbrief-gray-100 flex items-center justify-center"
                  style={{ width: '72px', height: '72px' }}
                >
                  <span className="text-finbrief-blue-500 font-bold text-xl">
                    {step.number}
                  </span>
                </div>
                <div className="pt-5">
                  <p
                    className="text-finbrief-black font-medium"
                    style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-px h-8 bg-finbrief-gray-200 ml-8 -mt-8 mb-4" />
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ============================================
// CTA Section - Subscription
// ============================================
function CTASection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        const data = await response.json();
        setError(data.error || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setError('A network error occurred. Please try again later.');
      console.error('Subscription failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="subscribe"
      className="px-6 bg-cta-gradient"
      style={{ padding: 'clamp(80px, 12vh, 150px) 24px' }}
    >
      <div className="max-w-[980px] mx-auto text-center">
        <ScrollReveal>
          <h2
            className="text-finbrief-white mb-4"
            style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}
          >
            Start tomorrow morning
          </h2>
          <p
            className="mb-12 max-w-[680px] mx-auto"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Delivered to your Telegram every morning at 8 AM
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          {/* Mobile: stacked. Desktop: 3-col grid with "or" divider in the middle */}
          <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] md:items-stretch gap-6 max-w-[860px] mx-auto">
            {/* Telegram Card */}
            <div
              className="flex flex-col items-center text-center rounded-2xl p-8 border"
              style={{
                background: 'rgba(41, 128, 185, 0.15)',
                borderColor: 'rgba(41, 128, 185, 0.4)',
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(41, 128, 185, 0.3)' }}
              >
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3
                className="text-finbrief-white font-semibold mb-2"
                style={{ fontSize: 'clamp(18px, 2vw, 22px)' }}
              >
                Telegram Bot
              </h3>
              <p
                className="mb-6 flex-1"
                style={{
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                Instant delivery straight to your Telegram. Every morning at 8
                AM, no inbox required.
              </p>
              <a
                href="https://t.me/finbrief_news_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-metal btn-metal--blue inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full cursor-pointer w-full"
              >
                <MessageCircle className="w-4 h-4" />
                Start Telegram Bot
              </a>
            </div>

            {/* Divider — horizontal on mobile, vertical on desktop */}
            <div className="flex md:flex-col items-center gap-3 md:gap-4 md:py-8">
              <div
                className="flex-1 h-px md:h-auto md:w-px"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              />
              <span
                className="px-3 py-1 rounded-full text-sm font-medium shrink-0"
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                or
              </span>
              <div
                className="flex-1 h-px md:h-auto md:w-px"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              />
            </div>

            {/* Email Card */}
            <div
              className="flex flex-col items-center text-center rounded-2xl p-8 border"
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.15)',
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Send className="w-7 h-7 text-white" />
              </div>
              <h3
                className="text-finbrief-white font-semibold mb-2"
                style={{ fontSize: 'clamp(18px, 2vw, 22px)' }}
              >
                Email Digest
              </h3>
              <p
                className="mb-6"
                style={{
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                Prefer your inbox? Get the same daily briefing delivered to your
                email every morning.
              </p>
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => {
                      if (isSubmitted) {
                        setIsSubmitted(false);
                        setError('');
                      }
                    }}
                    disabled={isLoading}
                    required
                    className="w-full px-5 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitted}
                    className="btn-metal inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    style={{ color: '#0071E3' }}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      'Subscribed!'
                    ) : (
                      <>
                        Subscribe Free
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {isSubmitted && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-white/90 font-medium text-sm"
                  >
                    Check your email. Your first briefing is on its way!
                  </motion.p>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-red-300 font-medium text-sm"
                  >
                    {error}
                  </motion.p>
                )}
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ============================================
// Footer - Minimal
// ============================================
function HowToRead() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-[720px] mx-auto">
        <h2 className="text-3xl font-bold text-finbrief-black mb-8">
          What you are actually reading
        </h2>

        <div className="space-y-5 text-finbrief-gray-500 leading-relaxed">
          <p>
            FinBrief is a daily digest of the overnight market, assembled
            without a human in the loop. Every dawn a scheduled job pulls four
            RSS feeds — CNBC, MarketWatch, Investing.com and Google News Korea —
            and takes the most recent items from each. Stories that several
            outlets carried collapse into one, advertising and price-ticker
            filler drop out, and roughly fifty articles survive to be scored.
            Google Gemini then writes up the ten that carried the day, and the
            result lands in your Telegram at 8 AM KST.
          </p>

          <h3 className="text-xl font-semibold text-finbrief-black pt-4">
            How to read it
          </h3>
          <p>
            Each of the ten entries gives you the event, what it means, and
            which way it cut. Read the sentiment tag as the briefing&apos;s
            reading of market reaction on the day, not as a forecast. The
            ordering is by scored importance, so the top of the list is where
            the day&apos;s weight sat — if you only have a minute, the first
            three are the ones to keep.
          </p>
          <p>
            Alongside the news we publish the One-Way Index, a single number for
            how strongly the market is trending in one direction. It measures
            the strength of a move, not its direction&apos;s correctness, and it
            says nothing about what happens tomorrow.
          </p>

          <h3 className="text-xl font-semibold text-finbrief-black pt-4">
            What it is not
          </h3>
          <p>
            Four feeds are not the whole market. Anything those outlets did not
            run that morning is not in the briefing, and coverage skews toward
            US headlines with Korean market news arriving through an aggregator.
            The summaries are model-written and can get a detail wrong, so treat
            a number that matters to you as something to confirm at the source
            rather than as a quotation.
          </p>
          <p>
            The briefing is delivered after the US close, so it describes the
            session that just ended. None of it is investment advice, and
            nothing here is personalised to your holdings.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-[#e8e8ed] text-sm">
          <p className="text-finbrief-gray-500">
            Want the full source list, the scoring method and the One-Way Index
            weights?{' '}
            <a
              href="/about"
              className="text-finbrief-black font-semibold underline underline-offset-4"
            >
              Read how it is built
            </a>
            .
          </p>
          <p className="text-finbrief-gray-500 mt-3">
            FinBrief is one of the tools built at{' '}
            <a
              href="https://yeomniverse.com"
              className="text-finbrief-black font-semibold underline underline-offset-4"
            >
              Yeomniverse
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#f5f5f7] border-t border-[#e8e8ed]">
      <div className="max-w-[980px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gradient font-bold text-2xl">FinBrief</div>
          <div className="flex items-center gap-6 text-sm text-finbrief-gray-500">
            <a
              href="/about"
              className="hover:text-finbrief-black transition-colors"
            >
              About
            </a>
            <a
              href="/privacy"
              className="hover:text-finbrief-black transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-finbrief-black transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="https://yeomniverse.com"
              className="hover:text-finbrief-black transition-colors"
            >
              Yeomniverse
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-finbrief-gray-500">
          2026 FinBrief. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
