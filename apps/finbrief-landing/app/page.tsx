'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Zap, Brain, Target, ChevronDown, ArrowRight, Send } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/landing';

export default function Home() {
  return (
    <main className="bg-finbrief-white">
      <HeroSection />
      <ValueProposition />
      <FeatureShowcase />
      <HowItWorks />
      <BriefingSample />
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
      style={{ opacity, scale }}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-finbrief-gray-100 to-finbrief-white" />

      <div className="relative z-10 text-center max-w-content mx-auto">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-hero font-bold tracking-tight mb-6"
        >
          <span className="text-gradient-animated">FinBrief</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-lead text-finbrief-gray-500 mb-10 max-w-text mx-auto"
        >
          30초 만에 읽는 AI 재테크 브리핑
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <a
            href="#subscribe"
            className="inline-flex items-center gap-2 bg-finbrief-blue-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-finbrief-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            무료로 시작하기
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
          className="flex flex-col items-center gap-2 text-finbrief-gray-500"
        >
          <span className="text-sm">스크롤</span>
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
    <section className="py-section px-6 bg-finbrief-white">
      <div className="max-w-content mx-auto text-center">
        <StaggerContainer staggerDelay={0.15} className="space-y-4">
          <StaggerItem>
            <p className="text-section text-finbrief-black">
              AI가 <span className="text-gradient">100개의 뉴스</span>를 읽고,
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="text-section text-finbrief-black">
              당신에게 꼭 필요한 <span className="text-gradient">3가지</span>만.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <ScrollReveal delay={0.4} className="mt-element">
          <p className="text-lead text-finbrief-gray-500 max-w-text mx-auto">
            20년 경력 펀드매니저 수준의 큐레이션을 무료로 경험하세요.
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
      title: '30초 독해',
      description: '출근길 지하철에서, 점심시간 직전에 핵심만 빠르게 파악하세요.',
    },
    {
      icon: Brain,
      title: 'AI 큐레이션',
      description: '최신 AI 기술로 수백 개의 뉴스를 분석하고 가장 중요한 정보만 선별합니다.',
    },
    {
      icon: Target,
      title: '맞춤 인사이트',
      description: '호재와 악재를 즉시 판단할 수 있는 명확한 시장 분석을 제공합니다.',
    },
  ];

  return (
    <section className="py-section px-6 bg-finbrief-black">
      <div className="max-w-content mx-auto">
        <ScrollReveal>
          <p className="text-finbrief-gray-500 text-sm font-medium tracking-wide uppercase mb-4">
            핵심 기능
          </p>
          <h2 className="text-section text-finbrief-white mb-element">
            더 스마트하게,<br />더 빠르게.
          </h2>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <feature.icon className="w-12 h-12 text-finbrief-blue-400 mb-6" />
                <h3 className="text-feature text-finbrief-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-finbrief-gray-500 leading-relaxed">
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
    { number: '01', title: '매일 새벽, AI가 100+ 뉴스를 분석' },
    { number: '02', title: '가장 중요한 3가지를 선별' },
    { number: '03', title: '아침 8시, 텔레그램으로 전송' },
  ];

  return (
    <section className="py-section px-6 bg-finbrief-white">
      <div className="max-w-content mx-auto">
        <ScrollReveal className="text-center mb-element">
          <p className="text-finbrief-gray-500 text-sm font-medium tracking-wide uppercase mb-4">
            작동 방식
          </p>
          <h2 className="text-section text-finbrief-black">
            이렇게 동작해요
          </h2>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.2} className="max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <div className="flex items-start gap-6 mb-12 last:mb-0">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-finbrief-gray-100 flex items-center justify-center">
                  <span className="text-finbrief-blue-500 font-bold text-lg">
                    {step.number}
                  </span>
                </div>
                <div className="pt-4">
                  <p className="text-feature text-finbrief-black">
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
// Briefing Sample - Preview card
// ============================================
function BriefingSample() {
  const briefings = [
    {
      title: '외환거래 역대 최고치 기록',
      description: '한국의 외환거래 규모가 807억 달러로 사상 최대를 기록했습니다.',
      sentiment: 'bullish' as const,
    },
    {
      title: '인텔 주가 11% 급락',
      description: '실적 실망으로 글로벌 기술주 전반에 영향을 미칠 전망입니다.',
      sentiment: 'bearish' as const,
    },
    {
      title: '조각투자 규제 논란',
      description: '새로운 투자 방식의 규제 환경 불확실성이 커지고 있습니다.',
      sentiment: 'neutral' as const,
    },
  ];

  const sentimentStyles = {
    bullish: {
      label: 'BULLISH',
      color: 'text-finbrief-bullish',
      bg: 'bg-finbrief-bullish/10',
      border: 'border-finbrief-bullish/20',
    },
    bearish: {
      label: 'BEARISH',
      color: 'text-finbrief-bearish',
      bg: 'bg-finbrief-bearish/10',
      border: 'border-finbrief-bearish/20',
    },
    neutral: {
      label: 'NEUTRAL',
      color: 'text-finbrief-neutral',
      bg: 'bg-finbrief-gray-100',
      border: 'border-finbrief-gray-200',
    },
  };

  return (
    <section className="py-section px-6 bg-finbrief-gray-100">
      <div className="max-w-content mx-auto">
        <ScrollReveal className="text-center mb-element">
          <p className="text-finbrief-gray-500 text-sm font-medium tracking-wide uppercase mb-4">
            미리보기
          </p>
          <h2 className="text-section text-finbrief-black">
            오늘의 브리핑 샘플
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="max-w-2xl mx-auto bg-finbrief-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="space-y-6">
              {briefings.map((item, index) => {
                const style = sentimentStyles[item.sentiment];
                return (
                  <div
                    key={index}
                    className={`p-5 rounded-2xl border ${style.bg} ${style.border}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h4 className="font-semibold text-lg text-finbrief-black">
                        {item.title}
                      </h4>
                      <span
                        className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full ${style.color} ${style.bg}`}
                      >
                        {style.label}
                      </span>
                    </div>
                    <p className="text-finbrief-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-finbrief-gray-200">
              <div className="flex flex-wrap gap-2 mb-4">
                {['#외환거래', '#반도체', '#조각투자'].map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-finbrief-blue-500 bg-finbrief-blue-500/10 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-finbrief-gray-500">
                시장 분위기: 글로벌 자본 흐름 활발, 기술주 변동성 증가
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ============================================
// CTA Section - Subscription
// ============================================
function CTASection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('구독:', email);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setEmail('');
  };

  return (
    <section id="subscribe" className="py-section px-6 bg-cta-gradient">
      <div className="max-w-content mx-auto text-center">
        <ScrollReveal>
          <h2 className="text-section text-finbrief-white mb-4">
            내일 아침부터 시작하세요
          </h2>
          <p className="text-lead text-white/70 mb-element max-w-text mx-auto">
            매일 아침 8시, 텔레그램으로 배달됩니다
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-finbrief-white text-finbrief-blue-500 px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105"
              >
                {isSubmitted ? (
                  '구독 완료!'
                ) : (
                  <>
                    무료 구독
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-white/60">
            또는{' '}
            <a
              href="https://t.me/finbrief_news_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-finbrief-white underline underline-offset-4 hover:no-underline transition-all"
            >
              텔레그램 봇 바로 시작하기 →
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ============================================
// Footer - Minimal
// ============================================
function Footer() {
  return (
    <footer className="py-12 px-6 bg-finbrief-white border-t border-finbrief-gray-200">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gradient font-bold text-2xl">FinBrief</div>
          <div className="flex items-center gap-6 text-sm text-finbrief-gray-500">
            <a href="#" className="hover:text-finbrief-black transition-colors">
              서비스 소개
            </a>
            <a href="#" className="hover:text-finbrief-black transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-finbrief-black transition-colors">
              이용약관
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-finbrief-gray-500">
          © 2026 FinBrief. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
