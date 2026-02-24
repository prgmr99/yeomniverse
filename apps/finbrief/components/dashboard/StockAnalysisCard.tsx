'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Crown,
  Minus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

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

  const fetchAnalysis = useCallback(async () => {
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
        throw new Error(result.error || 'Unable to load analysis data.');
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const getSentimentInfo = (sentiment: 'bullish' | 'bearish' | 'neutral') => {
    switch (sentiment) {
      case 'bullish':
        return {
          label: 'Bullish',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20',
          borderColor: 'border-emerald-500/30',
          icon: TrendingUp,
        };
      case 'bearish':
        return {
          label: 'Bearish',
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          icon: TrendingDown,
        };
      default:
        return {
          label: 'Neutral',
          color: 'text-slate-400',
          bgColor: 'bg-slate-500/20',
          borderColor: 'border-slate-500/30',
          icon: Minus,
        };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const isPro = planName === 'pro';
  const _isFree = planName === 'free';

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
                type="button"
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
              <p className="text-slate-400">Analyzing...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-red-500/20 border border-red-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-400 font-medium mb-1">Error</p>
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
                        Stock analysis is a paid plan feature
                      </h3>
                      <p className="text-slate-300 mb-4">
                        Upgrade to Basic or Pro for AI-powered technical
                        analysis.
                      </p>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                      >
                        Upgrade Plan
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={fetchAnalysis}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
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
                    <p className="text-sm text-slate-400 mb-2">Current Price</p>
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
                    <div className="text-sm">
                      {formatPercent(data.changePercent)}
                    </div>
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
                          <p className="text-sm text-slate-300 mb-1">
                            Overall Sentiment
                          </p>
                          <p
                            className={`text-2xl font-bold ${sentiment.color}`}
                          >
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
                  <h3 className="text-lg font-semibold text-white">
                    Moving Average Analysis
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: '5-Day', value: data.sma.sma5 },
                    { label: '20-Day', value: data.sma.sma20 },
                    { label: '60-Day', value: data.sma.sma60 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="text-center p-3 rounded-lg bg-white/5"
                    >
                      <p className="text-xs text-slate-400 mb-1">
                        {item.label}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {item.value !== null
                          ? `$${formatPrice(item.value)}`
                          : 'N/A'}
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
                    <h3 className="text-lg font-semibold text-white">
                      Trading Signals
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {data.signals.map((signal) => (
                      <li
                        key={signal}
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
                        <h3 className="text-lg font-semibold text-white">
                          RSI
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                          PRO
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {data.rsi.toFixed(2)}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {data.rsi > 70
                          ? 'Overbought'
                          : data.rsi < 30
                            ? 'Oversold'
                            : 'Neutral zone'}
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
                        <h3 className="text-lg font-semibold text-white">
                          MACD
                        </h3>
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
                          <p className="text-xs text-slate-400 mb-1">
                            Histogram
                          </p>
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
                        <h3 className="text-lg font-semibold text-white">
                          Bollinger Bands
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                          PRO
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-slate-400 mb-1">Upper</p>
                          <p className="text-sm font-semibold text-white">
                            ${formatPrice(data.bollingerBands.upper)}
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-slate-400 mb-1">Middle</p>
                          <p className="text-sm font-semibold text-white">
                            ${formatPrice(data.bollingerBands.middle)}
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-slate-400 mb-1">Lower</p>
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
                        Need more detailed analysis?
                      </h3>
                      <p className="text-slate-300 mb-4">
                        Upgrade to Pro for RSI, MACD, Bollinger Bands, and more
                        advanced technical indicators.
                      </p>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                      >
                        Upgrade to Pro
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Refresh Button */}
              <button
                type="button"
                onClick={fetchAnalysis}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
