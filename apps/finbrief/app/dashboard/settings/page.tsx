'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Bell, Mail, Send, Crown, Check, AlertCircle, X, CreditCard } from 'lucide-react';

interface UserSettings {
  newsAlertsEnabled: boolean;
  emailNotifications: boolean;
  telegramNotifications: boolean;
}

interface Subscription {
  plan: string | null;
  planDisplayName: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    newsAlertsEnabled: true,
    emailNotifications: true,
    telegramNotifications: false,
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, subRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/subscription'),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings({
          newsAlertsEnabled: data.newsAlertsEnabled ?? true,
          emailNotifications: data.emailNotifications ?? true,
          telegramNotifications: data.telegramNotifications ?? false,
        });
      }

      if (subRes.ok) {
        const data = await subRes.json();
        const planName = data.plan?.name || 'free';
        setSubscription({
          plan: planName,
          planDisplayName: data.plan?.display_name || 'Free',
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '저장에 실패했습니다.');
      }

      setSuccess('설정이 저장되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    setError('');

    try {
      const response = await fetch('/api/customer-portal');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '구독 관리 페이지로 이동할 수 없습니다.');
      }

      window.location.href = data.portalUrl;
    } catch (error) {
      setError(error instanceof Error ? error.message : '구독 관리 페이지로 이동할 수 없습니다.');
      setIsPortalLoading(false);
    }
  };

  const isPro = subscription?.plan === 'pro';
  const isBasicOrPro = subscription?.plan === 'basic' || subscription?.plan === 'pro';

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

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradientShift_3s_ease-in-out_infinite]">
          설정
        </h1>
        <p className="mt-2 text-slate-400">알림 및 환경 설정을 관리하세요</p>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-start gap-3"
          >
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-emerald-400 text-sm">{success}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">알림 설정</h2>
        </div>

        <div className="space-y-6">
          {/* News Alerts Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">뉴스 알림</h3>
              <p className="text-sm text-slate-400">
                관심종목 관련 중요 뉴스가 발생하면 알림을 받습니다
              </p>
            </div>
            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, newsAlertsEnabled: !prev.newsAlertsEnabled }))
              }
              className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                settings.newsAlertsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <motion.div
                animate={{
                  x: settings.newsAlertsEnabled ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Email Notifications */}
          <div
            className={`flex items-start justify-between gap-4 ${
              !settings.newsAlertsEnabled ? 'opacity-50' : ''
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-5 h-5 text-slate-300" />
                <h3 className="text-lg font-semibold text-white">이메일 알림</h3>
              </div>
              <p className="text-sm text-slate-400">이메일로 뉴스 알림을 받습니다</p>
            </div>
            <button
              onClick={() =>
                settings.newsAlertsEnabled &&
                setSettings((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }))
              }
              disabled={!settings.newsAlertsEnabled}
              className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                settings.emailNotifications && settings.newsAlertsEnabled
                  ? 'bg-emerald-500'
                  : 'bg-slate-700'
              }`}
            >
              <motion.div
                animate={{
                  x: settings.emailNotifications && settings.newsAlertsEnabled ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>

          {/* Telegram Notifications */}
          <div
            className={`flex items-start justify-between gap-4 ${
              !settings.newsAlertsEnabled || !isPro ? 'opacity-50' : ''
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Send className="w-5 h-5 text-slate-300" />
                <h3 className="text-lg font-semibold text-white">텔레그램 알림</h3>
                {!isPro && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold">
                    <Crown className="w-3 h-3" />
                    Pro
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400">
                텔레그램으로 실시간 뉴스 알림을 받습니다 {!isPro && '(Pro 전용)'}
              </p>
            </div>
            <button
              onClick={() =>
                isPro &&
                settings.newsAlertsEnabled &&
                setSettings((prev) => ({
                  ...prev,
                  telegramNotifications: !prev.telegramNotifications,
                }))
              }
              disabled={!isPro || !settings.newsAlertsEnabled}
              className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                settings.telegramNotifications && settings.newsAlertsEnabled && isPro
                  ? 'bg-emerald-500'
                  : 'bg-slate-700'
              }`}
            >
              <motion.div
                animate={{
                  x:
                    settings.telegramNotifications && settings.newsAlertsEnabled && isPro ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>저장 중...</span>
              </div>
            ) : (
              '설정 저장'
            )}
          </button>
        </div>
      </motion.div>

      {/* Pro Upgrade Card (if not Pro) */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/30"
        >
          <div className="flex items-start gap-4">
            <Crown className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Pro로 업그레이드</h3>
              <p className="text-slate-300 mb-4">
                텔레그램 알림, 기술적 분석, 심층 리포트 등 프리미엄 기능을 이용하세요.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                플랜 보기
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Plan Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">현재 플랜</h3>
            <p className="text-xl font-bold text-white">{subscription?.planDisplayName}</p>
          </div>
          {isPro && (
            <Crown className="w-8 h-8 text-amber-400" />
          )}
        </div>
      </motion.div>

      {/* Subscription Management - Only for paid users */}
      {isBasicOrPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">구독 관리</h2>
          </div>

          <p className="text-slate-400 mb-6">
            결제 수단 변경, 구독 취소, 인보이스 확인 등 구독 관련 설정을 관리할 수 있습니다.
          </p>

          <button
            onClick={handleManageSubscription}
            disabled={isPortalLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPortalLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>이동 중...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>구독 관리 포털 열기</span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}
