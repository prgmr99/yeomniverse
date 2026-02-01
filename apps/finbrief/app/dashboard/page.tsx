'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Crown, Star, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Subscription {
  plan: 'free' | 'pro';
  renewalDate?: string;
  watchlistLimit: number;
}

interface Watchlist {
  id: string;
  symbol: string;
  name: string;
  market: string;
}

export default function DashboardPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, watchlistRes] = await Promise.all([
          fetch('/api/subscription'),
          fetch('/api/watchlist'),
        ]);

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscription(subData);
        }

        if (watchlistRes.ok) {
          const watchlistData = await watchlistRes.json();
          setWatchlists(watchlistData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const isFree = subscription?.plan === 'free';
  const watchlistCount = watchlists.length;
  const watchlistLimit = subscription?.watchlistLimit || 10;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradientShift_3s_ease-in-out_infinite]">
          대시보드
        </h1>
        <p className="mt-2 text-slate-400">
          AI가 분석한 금융 뉴스를 한눈에 확인하세요
        </p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <Star className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white">{watchlistCount}</div>
          <div className="text-sm text-slate-400 mt-1">등록된 관심종목</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-6 h-6 text-teal-400" />
          </div>
          <div className="text-3xl font-bold text-white">08:00</div>
          <div className="text-sm text-slate-400 mt-1">매일 브리핑 시간</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white capitalize">
            {subscription?.plan || 'Free'}
          </div>
          <div className="text-sm text-slate-400 mt-1">현재 플랜</div>
        </motion.div>
      </div>

      {/* Subscription Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-500/30"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isFree ? 'Free Plan' : 'Pro Plan'}
            </h2>
            <p className="text-slate-300 mb-4">
              {isFree
                ? '무료로 FinBrief의 기본 기능을 이용하세요'
                : '모든 프리미엄 기능을 제한 없이 사용하세요'}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>
                  관심종목: {watchlistCount}/{watchlistLimit}
                </span>
              </div>
              {subscription?.renewalDate && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>
                    갱신일:{' '}
                    {new Date(subscription.renewalDate).toLocaleDateString(
                      'ko-KR',
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {isFree && (
            <Link
              href="/pricing"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              <span>Pro로 업그레이드</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Watchlist Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">관심종목</h2>
          <Link
            href="/dashboard/watchlist"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            전체 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {watchlists.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">
              아직 등록된 관심종목이 없습니다
            </p>
            <Link
              href="/dashboard/watchlist"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/30 transition-all duration-200"
            >
              <Star className="w-4 h-4" />첫 종목 추가하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {watchlists.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-slate-400">{item.symbol}</p>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    {item.market}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Today's Briefing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">오늘의 브리핑</h2>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-emerald-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">
                  AI 분석 준비 중
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  매일 새벽 AI가 100개 이상의 뉴스를 분석하고, 아침 8시에 가장
                  중요한 3가지 소식을 전달합니다. 텔레그램으로 받아보세요!
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center pt-4">
            <a
              href="https://t.me/finbrief_news_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <TrendingUp className="w-4 h-4" />
              텔레그램 봇 시작하기
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
