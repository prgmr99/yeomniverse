'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || '오류가 발생했습니다.' });
      } else {
        setMessage({
          type: 'success',
          text: '로그인 링크가 이메일로 전송되었습니다.',
        });
        setEmail('');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: '서버와 통신 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-3"
          >
            FinBrief
          </Link>
          <p className="text-slate-400 text-lg">
            매일 아침 핵심 금융 인사이트
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            로그인
          </h1>
          <p className="text-slate-400 text-center mb-6">
            이메일 주소를 입력하시면 로그인 링크를 보내드립니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-xl text-sm ${
                  message.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  전송 중...
                </>
              ) : (
                <>
                  로그인 링크 전송
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800/50 text-slate-400">
                처음 사용하시나요?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            href="/pricing"
            className="block w-full px-6 py-3 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 transition-all text-center group"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              무료로 시작하기
            </span>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              홈
            </Link>
            <span>•</span>
            <Link href="/pricing" className="hover:text-white transition-colors">
              요금제
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
