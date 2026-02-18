'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { PricingCard } from '@/components/PricingCard';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel anytime. You will continue to have access until the end of your billing period.',
  },
  {
    question: 'What happens when I upgrade from Free to a paid plan?',
    answer:
      'You get instant access to all paid features including watchlist, technical analysis, and more.',
  },
  {
    question: 'What payment methods are available?',
    answer:
      'We accept credit and debit cards via Lemon Squeezy, our secure payment provider.',
  },
  {
    question: "What's the difference between Basic and Pro?",
    answer:
      'Basic includes 3 watchlist stocks and standard analysis. Pro includes 10 watchlist stocks with RSI, MACD, Bollinger Bands, and AI deep analysis.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'You can request a refund within 7 days of purchase. Refunds may be limited in cases of excessive usage.',
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
        text: 'Please enter a valid email address.',
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
          text: data.error || 'An error occurred.',
        });
      } else {
        window.location.href = data.checkoutUrl;
      }
    } catch (_error) {
      setMessage({
        type: 'error',
        text: 'A server communication error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreePlan = () => {
    if (!email || !email.includes('@')) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    window.location.href = `/auth/login?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 text-center">
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 mx-auto max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-finbrief-black mb-6">
            The perfect plan for{' '}
            <span className="text-gradient">smart investing</span>
          </h1>
          <p className="text-finbrief-gray-500 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            Get daily financial news and personalized investment insights every
            morning.
          </p>

          {/* Email Input */}
          <div className="max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-xl p-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-transparent text-finbrief-black placeholder-finbrief-gray-500/50 focus:outline-none"
              />
            </div>
            {message && (
              <div
                className={`mt-3 p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-finbrief-blue-500/10 border border-finbrief-blue-500/20 text-finbrief-blue-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
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
            description="Get started with financial news briefing"
            features={[
              'Daily financial briefing',
              '3 key news summaries',
              'Email or Telegram delivery',
              'Basic market overview',
            ]}
            buttonText="Get Started Free"
            onButtonClick={handleFreePlan}
          />

          {/* Basic Plan */}
          <PricingCard
            name="Basic"
            price={7}
            period="mo"
            description="Personalized investment insights"
            features={[
              'All Free features',
              '3 watchlist stocks',
              'Basic stock analysis',
              'Personalized email briefing',
              'Stock news alerts',
            ]}
            highlighted={true}
            buttonText="Start Basic"
            onButtonClick={() => handleCheckout('basic')}
          />

          {/* Pro Plan */}
          <PricingCard
            name="Pro"
            price={20}
            period="mo"
            description="Expert-level deep analysis"
            features={[
              'All Basic features',
              '10 watchlist stocks',
              'Technical analysis (RSI, MACD, Bollinger Bands)',
              'AI deep analysis reports',
              'Real-time alerts (surges/drops)',
              'Premium investment insights',
            ]}
            buttonText="Start Pro"
            onButtonClick={() => handleCheckout('pro')}
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 sm:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-finbrief-black mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-finbrief-gray-500 text-lg">
              Find answers to common questions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-finbrief-blue-500/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-finbrief-black font-semibold pr-4">
                    {faq.question}
                  </span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-finbrief-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-finbrief-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-finbrief-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/10 bg-cta-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get started now
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Get daily insights and make better investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/login"
              className="px-8 py-4 bg-white text-finbrief-blue-500 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
            </a>
            <a
              href="/"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-finbrief-gray-500">
            <p>© 2026 FinBrief. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="/"
                className="hover:text-finbrief-black transition-colors"
              >
                Home
              </a>
              <a
                href="/pricing"
                className="hover:text-finbrief-black transition-colors"
              >
                Pricing
              </a>
              <a
                href="/auth/login"
                className="hover:text-finbrief-black transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-finbrief-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-finbrief-blue-500/20 border-t-finbrief-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-finbrief-black font-semibold">
              Redirecting to checkout...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
