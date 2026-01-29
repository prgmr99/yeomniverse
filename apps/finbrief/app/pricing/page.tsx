'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { PricingCard } from '@/components/PricingCard';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '구독을 언제든 취소할 수 있나요?',
    answer:
      '네, 언제든지 구독을 취소하실 수 있습니다. 결제일 기준으로 남은 기간까지는 서비스를 이용하실 수 있습니다.',
  },
  {
    question: '무료 플랜에서 유료 플랜으로 업그레이드하면 어떻게 되나요?',
    answer:
      '즉시 유료 플랜의 모든 기능을 이용하실 수 있습니다. 관심종목 설정, 기술적 분석 등 프리미엄 기능이 활성화됩니다.',
  },
  {
    question: '결제 방법은 무엇이 있나요?',
    answer:
      '신용카드, 체크카드로 결제하실 수 있습니다. 안전한 결제 시스템 Lemon Squeezy를 통해 처리됩니다.',
  },
  {
    question: 'Basic과 Pro의 차이점은 무엇인가요?',
    answer:
      'Basic은 3개의 관심종목과 기본 분석을 제공하며, Pro는 10개의 관심종목과 RSI, MACD 등 고급 기술적 분석, AI 심층 분석을 제공합니다.',
  },
  {
    question: '환불이 가능한가요?',
    answer:
      '서비스 이용 후 7일 이내에 환불을 요청하실 수 있습니다. 단, 과도한 서비스 사용이 확인된 경우 환불이 제한될 수 있습니다.',
  },
];

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleCheckout = async (plan: 'basic' | 'pro') => {
    if (!email || !email.includes('@')) {
      setMessage({
        type: 'error',
        text: '올바른 이메일 주소를 입력해주세요.',
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: 'error',
          text: data.error || '오류가 발생했습니다.',
        });
      } else {
        window.location.href = data.checkoutUrl;
      }
    } catch (_error) {
      setMessage({
        type: 'error',
        text: '서버와 통신 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreePlan = () => {
    if (!email || !email.includes('@')) {
      setMessage({
        type: 'error',
        text: '올바른 이메일 주소를 입력해주세요.',
      });
      return;
    }

    window.location.href = `/auth/login?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"
            >
              FinBrief
            </Link>
            <Link
              href="/auth/login"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            똑똑한 투자
          </span>
          를 위한
          <br />
          완벽한 요금제
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
          매일 아침 핵심 금융 뉴스와 개인화된 투자 인사이트를 받아보세요.
        </p>

        {/* Email Input */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          {message && (
            <div
              className={`mt-3 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <PricingCard
            name="Free"
            price={0}
            period="mo"
            description="금융 뉴스 브리핑으로 시작하기"
            features={[
              '일일 금융 브리핑',
              '3개 주요 뉴스 요약',
              '이메일 또는 텔레그램 전송',
              '기본 시장 개요',
            ]}
            buttonText="무료로 시작하기"
            onButtonClick={handleFreePlan}
          />

          {/* Basic Plan */}
          <PricingCard
            name="Basic"
            price={7}
            period="mo"
            description="개인화된 투자 인사이트"
            features={[
              'Free 플랜 모든 기능',
              '관심종목 3개 설정',
              '기본 종목 분석',
              '개인화된 이메일 브리핑',
              '종목별 뉴스 알림',
            ]}
            highlighted={true}
            buttonText="Basic 시작하기"
            onButtonClick={() => handleCheckout('basic')}
          />

          {/* Pro Plan */}
          <PricingCard
            name="Pro"
            price={20}
            period="mo"
            description="전문가 수준의 심층 분석"
            features={[
              'Basic 플랜 모든 기능',
              '관심종목 10개 설정',
              '기술적 분석 (RSI, MACD, 볼린저밴드)',
              'AI 심층 분석 리포트',
              '실시간 알림 (급등/급락)',
              '프리미엄 투자 인사이트',
            ]}
            buttonText="Pro 시작하기"
            onButtonClick={() => handleCheckout('pro')}
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            자주 묻는 질문
          </h2>
          <p className="text-slate-400 text-lg">
            궁금하신 사항을 확인해보세요.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              <button
                type="button"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-white font-semibold pr-4">
                  {faq.question}
                </span>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/10 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            매일 아침 핵심 인사이트를 받아보고 더 나은 투자 결정을 하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 hover:border-emerald-500/50 transition-all"
            >
              더 알아보기
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <p>© 2026 FinBrief. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-white transition-colors">
                홈
              </Link>
              <Link
                href="/pricing"
                className="hover:text-white transition-colors"
              >
                요금제
              </Link>
              <Link
                href="/auth/login"
                className="hover:text-white transition-colors"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-semibold">결제 페이지로 이동 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
