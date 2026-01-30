'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Trash2, TrendingUp, X, AlertCircle, Crown } from 'lucide-react';
import Link from 'next/link';
import StockAnalysisCard from '@/components/dashboard/StockAnalysisCard';

interface Watchlist {
  id: string;
  symbol: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ';
}

interface Subscription {
  plan: 'free' | 'basic' | 'pro';
  watchlistLimit: number;
}

const MARKET_OPTIONS = [
  { value: 'KOSPI', label: 'KOSPI' },
  { value: 'KOSDAQ', label: 'KOSDAQ' },
  { value: 'NYSE', label: 'NYSE' },
  { value: 'NASDAQ', label: 'NASDAQ' },
] as const;

export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string } | null>(null);

  // Form state
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [market, setMarket] = useState<string>('KOSPI');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [watchlistRes, subRes] = await Promise.all([
        fetch('/api/watchlist'),
        fetch('/api/subscription'),
      ]);

      if (watchlistRes.ok) {
        const data = await watchlistRes.json();
        setWatchlists(data);
      }

      if (subRes.ok) {
        const data = await subRes.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol.toUpperCase().trim(),
          name: name.trim(),
          market,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '추가에 실패했습니다.');
      }

      // Reset form and refresh data
      setSymbol('');
      setName('');
      setMarket('KOSPI');
      setShowAddForm(false);
      await fetchData();
    } catch (error) {
      setError(error instanceof Error ? error.message : '추가에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 종목을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/watchlist/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('삭제에 실패했습니다.');
      }

      await fetchData();
    } catch (error) {
      setError(error instanceof Error ? error.message : '삭제에 실패했습니다.');
    }
  };

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

  const watchlistCount = watchlists.length;
  const watchlistLimit = subscription?.watchlistLimit || 10;
  const isAtLimit = watchlistCount >= watchlistLimit;
  const isFree = subscription?.plan === 'free';

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradientShift_3s_ease-in-out_infinite]">
            관심종목
          </h1>
          <p className="mt-2 text-slate-400">
            {watchlistCount}/{watchlistLimit}개 등록됨
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          disabled={isAtLimit}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isAtLimit
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105'
          }`}
        >
          <Plus className="w-5 h-5" />
          종목 추가
        </button>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Limit Warning */}
      {isAtLimit && isFree && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/30"
        >
          <div className="flex items-start gap-4">
            <Crown className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                관심종목 한도에 도달했습니다
              </h3>
              <p className="text-slate-300 mb-4">
                Pro 플랜으로 업그레이드하면 무제한으로 종목을 추가할 수 있습니다.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                Pro로 업그레이드
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">종목 추가</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label htmlFor="symbol" className="block text-sm font-medium text-slate-300 mb-2">
                    종목 코드
                  </label>
                  <input
                    id="symbol"
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="예: AAPL, 005930"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    종목명
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: Apple, 삼성전자"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="market" className="block text-sm font-medium text-slate-300 mb-2">
                    시장
                  </label>
                  <select
                    id="market"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  >
                    {MARKET_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-all duration-200"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 mx-auto border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      '추가'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watchlist Grid */}
      {watchlists.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <Star className="w-16 h-16 text-slate-700 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            아직 관심종목이 없습니다
          </h3>
          <p className="text-slate-500 mb-8">
            종목을 추가하고 맞춤형 분석을 받아보세요
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            첫 종목 추가하기
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlists.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-slate-400">{item.symbol}</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  {item.market}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
                <button
                  onClick={() => setSelectedStock({ symbol: item.symbol, name: item.name })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-all duration-200"
                >
                  <TrendingUp className="w-4 h-4" />
                  분석 보기
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stock Analysis Modal */}
      {selectedStock && (
        <StockAnalysisCard
          symbol={selectedStock.symbol}
          name={selectedStock.name}
          planName={subscription?.plan || 'free'}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}
