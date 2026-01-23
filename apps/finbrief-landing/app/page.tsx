'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 이메일 구독 로직 추가
    console.log('구독:', email);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo & Title */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FinBrief
            </h1>
            <p className="text-2xl text-gray-700 font-medium">
              30초 만에 읽는 AI 재테크 브리핑 💰
            </p>
          </div>

          {/* Value Proposition */}
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            AI가 <span className="font-bold text-indigo-600">100개의 뉴스</span>를 읽고,<br />
            당신에게 <span className="font-bold text-indigo-600">꼭 필요한 3가지</span>만 골라줍니다
          </p>

          {/* Subscription Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              무료로 시작하기
            </h2>
            <p className="text-gray-600 mb-6">
              매일 아침 8시, 텔레그램으로 받아보세요
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
              >
                {isSubmitted ? '✅ 구독 신청 완료!' : '텔레그램으로 구독하기'}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              또는{' '}
              <a
                href="https://t.me/finbrief_news_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline font-medium"
              >
                텔레그램 봇 바로 시작
              </a>
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              emoji="⚡"
              title="30초 독해"
              description="출근길에 핵심만 빠르게"
            />
            <FeatureCard
              emoji="🤖"
              title="AI 큐레이션"
              description="20년 경력 펀드매니저 수준"
            />
            <FeatureCard
              emoji="🎯"
              title="맞춤 인사이트"
              description="호재/악재 즉시 판단"
            />
          </div>

          {/* Sample Briefing */}
          <div className="bg-white p-8 rounded-2xl shadow-xl text-left max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              📊 오늘의 브리핑 샘플
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="border-l-4 border-indigo-500 pl-4">
                <p className="font-bold text-lg mb-2">
                  1. 외환거래 역대 최고치 기록 🐂
                </p>
                <p className="text-sm leading-relaxed">
                  한국의 외환거래 규모가 807억 달러로 사상 최대...
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <p className="font-bold text-lg mb-2">
                  2. 인텔 주가 11% 급락 🐻
                </p>
                <p className="text-sm leading-relaxed">
                  실적 실망으로 글로벌 기술주 전반에 영향...
                </p>
              </div>
              <div className="border-l-4 border-gray-400 pl-4">
                <p className="font-bold text-lg mb-2">
                  3. 조각투자 규제 논란 😐
                </p>
                <p className="text-sm leading-relaxed">
                  새로운 투자 방식의 규제 환경 불확실성...
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                🔑 <span className="font-bold">오늘의 키워드:</span> #외환거래 #반도체 #조각투자
              </p>
              <p className="text-sm text-gray-600 mt-2">
                📈 <span className="font-bold">시장 분위기:</span> 글로벌 자본 흐름 활발, 기술주 변동성 증가
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © 2026 FinBrief. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Made with ❤️ using AI
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
