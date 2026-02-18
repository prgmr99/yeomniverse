'use client';

import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: 'error',
          text: data.error || 'An error occurred.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'A sign-in link has been sent to your email.',
        });
        setEmail('');
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-3xl font-bold text-gradient mb-3"
          >
            FinBrief
          </Link>
          <p className="text-finbrief-gray-500 text-lg">
            Daily key financial insights
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-finbrief-blue-500/10 to-[#5E5CE6]/10 rounded-xl border border-finbrief-blue-500/20">
              <Mail className="w-6 h-6 text-finbrief-blue-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-finbrief-black text-center mb-2">
            Sign In
          </h1>
          <p className="text-finbrief-gray-500 text-center mb-6">
            Enter your email and we'll send you a sign-in link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-finbrief-gray-600 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/60 border border-white/50 rounded-xl text-finbrief-black placeholder-finbrief-gray-500/50 focus:outline-none focus:ring-2 focus:ring-finbrief-blue-500/50 focus:border-finbrief-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-xl text-sm ${
                  message.type === 'success'
                    ? 'bg-finbrief-blue-500/10 border border-finbrief-blue-500/20 text-finbrief-blue-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading
                  ? undefined
                  : 'linear-gradient(135deg, #0071E3 0%, #5E5CE6 100%)',
              }}
              className="w-full px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Sign-in Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-finbrief-gray-500/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-finbrief-gray-500">
                New to FinBrief?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            href="/pricing"
            className="block w-full px-6 py-3 bg-white/60 text-finbrief-black font-semibold rounded-xl hover:bg-white/80 border border-white/50 hover:border-finbrief-blue-500/50 transition-all text-center group"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-finbrief-blue-400 group-hover:text-finbrief-blue-500 transition-colors" />
              Get Started Free
            </span>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-finbrief-gray-500">
            <Link
              href="/"
              className="hover:text-finbrief-black transition-colors"
            >
              Home
            </Link>
            <span>•</span>
            <Link
              href="/pricing"
              className="hover:text-finbrief-black transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-finbrief-blue-500/20 border-t-finbrief-blue-500 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
