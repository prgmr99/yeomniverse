'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  RefreshCw,
  Crown,
  ArrowRight,
  BarChart3,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

interface StockAnalysisCardProps {
  symbol: string;
  name: string;
  planName: 'free' | 'basic' | 'pro';
  onClose?: () => void;
}

interface BasicAnalysisData {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  sma: {
    sma5: number | null;
    sma20: number | null;
    sma60: number | null;
  };
  signals: string[];
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
}

interface ProAnalysisData extends BasicAnalysisData {
  rsi: number | null;
  macd: {
    MACD: number;
    signal: number;
    histogram: number;
  } | null;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  } | null;
  volumeRatio: number | null;
}

type AnalysisData = BasicAnalysisData | ProAnalysisData;

export default function StockAnalysisCard({
  symbol,
  name,
  planName,
  onClose,
}: StockAnalysisCardProps) {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldUpgrade, setShouldUpgrade] = useState(false);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setShouldUpgrade(false);

    try {
      const response = await fetch(`/api/stocks/${symbol}/analysis`);
      const result = await response.json();

      if (!response.ok) {
        if (result.upgrade) {
          setShouldUpgrade(true);
        }
        throw new Error(result.error || '분석 데이터를 불러올 수 없습니다.');
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [symbol]);

  const getSentimentInfo = (sentiment: 'bullish' | 'bearish' | 'neutral') => {
    switch (sentiment) {
      case 'bullish':
        return {
          label: '상승',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20',
          borderColor: 'border-emerald-500/30',
          icon: TrendingUp,
        };
      case 'bearish':
        return {
          label: '하락',
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          icon: TrendingDown,
        };
      default:
        return {
          label: '중립',
          color: 'text-slate-400',
          bgColor: 'bg-slate-500/20',
          borderColor: 'border-slate-500/30',
          icon: Minus,
        };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const isPro = planName === 'pro';
  const isFree = planName === 'free';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <p className="text-sm text-slate-400 mt-1">{symbol}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-slate-400">분석 중...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-red-500/20 border border-red-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-400 font-medium mb-1">오류</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              </div>

              {shouldUpgrade && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/30">
                  <div className="flex items-start gap-4">
                    <Crown className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        종목 분석은 유료 플랜 전용 기능입니다
                      </h3>
                      <p className="text-slate-300 mb-4">
                        Basic 또는 Pro 플랜으로 업그레이드하고 AI 기반 기술적 분석을 받아보세요.
                      </p>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                      >
                        플랜 업그레이드
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={fetchAnalysis}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                다시 시도
              </button>
            </div>
          )}

          {/* Success State */}
          {data && !isLoading && !error && (
            <div className="space-y-6">
              {/* Current Price */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">현재가</p>
                    <div className="text-4xl font-bold text-white">
                      ${formatPrice(data.currentPrice)}
                    </div>
                  </div>
                  <div
                    className={`text-right ${
                      data.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    <div className="text-xl font-semibold">
                      {data.change >= 0 ? '+' : ''}
                      {formatPrice(data.change)}
                    </div>
                    <div className="text-sm">{formatPercent(data.changePercent)}</div>
                  </div>
                </div>
              </motion.div>

              {/* Overall Sentiment */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {(() => {
                  const sentiment = getSentimentInfo(data.overallSentiment);
                  const Icon = sentiment.icon;
                  return (
                    <div
                      className={`p-6 rounded-xl ${sentiment.bgColor} border ${sentiment.borderColor}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${sentiment.color}`} />
                        <div>
                          <p className="text-sm text-slate-300 mb-1">종합 판단</p>
                          <p className={`text-2xl font-bold ${sentiment.color}`}>
                            {sentiment.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>

              {/* SMA Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">이동평균선 분석</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: '5일', value: data.sma.sma5 },
                    { label: '20일', value: data.sma.sma20 },
                    { label: '60일', value: data.sma.sma60 },
                  ].map((item, index) => (
                    <div key={index} className="text-center p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                      <p className="text-lg font-semibold text-white">
                        {item.value !== null ? `$${formatPrice(item.value)}` : 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Signals */}
              {data.signals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-semibold text-white">매매 신호</h3>
                  </div>
                  <ul className="space-y-2">
                    {data.signals.map((signal, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Pro Features */}
              {isPro && 'rsi' in data && (
                <>
                  {/* RSI */}
                  {data.rsi !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="w-5 h-5 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">RSI</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                          PRO
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {data.rsi.toFixed(2)}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {data.rsi > 70
                          ? '과매수 구간'
                          : data.rsi < 30
                            ? '과매도 구간'
                            : '중립 구간'}
                      </p>
                    </motion.div>
                  )}

                  {/* MACD */}
                  {data.macd && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Crown className="w-5 h-5 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">MACD</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                          PRO
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-slate-400 mb-1">MACD</p>
                          <p className="text-sm font-semibold text-white">
                            {data.macd.MACD.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-slate-400 mb-1">Signal</p>
                          <p className="text-sm font-semibold text-white">
                            {data.macd.signal.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-slate-400 mb-1">Histogram</p>
                          <p className="text-sm font-semibold text-white">
                            {data.macd.histogram.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Bollinger Bands */}
                  {data.bollingerBands && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Crown className="w-5 h-5 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">볼린저 밴드</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                          PRO
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-slate-400 mb-1">상단</p>
                          <p className="text-sm font-semibold text-white">
                            ${formatPrice(data.bollingerBands.upper)}
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-slate-400 mb-1">중간</p>
                          <p className="text-sm font-semibold text-white">
                            ${formatPrice(data.bollingerBands.middle)}
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-slate-400 mb-1">하단</p>
                          <p className="text-sm font-semibold text-white">
                            ${formatPrice(data.bollingerBands.lower)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* Upgrade Prompt for Basic users */}
              {planName === 'basic' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/30"
                >
                  <div className="flex items-start gap-4">
                    <Crown className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        더 상세한 분석이 필요하신가요?
                      </h3>
                      <p className="text-slate-300 mb-4">
                        Pro 플랜으로 업그레이드하고 RSI, MACD, 볼린저 밴드 등 고급 기술적 지표를
                        확인하세요.
                      </p>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                      >
                        Pro로 업그레이드
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Refresh Button */}
              <button
                onClick={fetchAnalysis}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                새로고침
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
