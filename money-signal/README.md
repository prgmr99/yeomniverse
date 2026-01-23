# Money Signal 💰

> 30초 만에 읽는 AI 기반 글로벌 재테크 모닝 브리핑

**AI가 100개의 뉴스를 읽고, 당신에게 꼭 필요한 3가지만 골라줍니다.**

---

## 🎯 프로젝트 개요

**Money Signal**은 바쁜 2030 직장인을 위한 AI 재테크 뉴스 자동화 봇입니다.

- **목표**: 30일 내 순수익 100만원 달성
- **핵심 가치**: 시간을 아껴주는 인사이트 (단순 정보 전달이 아닌 가공된 정보)
- **플랫폼**: 텔레그램 (알림) + 랜딩 페이지 (구독)

## 🏗️ Zero Cost Architecture

| 구분 | 기술 스택 | 비용 |
|------|---------|------|
| Language | TypeScript + Node.js 20 | 0원 |
| Scheduler | GitHub Actions | 0원 |
| LLM | Google Gemini API | 0원 |
| Frontend | Next.js + Vercel | 0원 |
| DB | Git JSON → Supabase | 0원 |
| Messenger | Telegram Bot API | 0원 |

## 📁 프로젝트 구조

```
money-signal/
├── src/
│   ├── collectors/          # 데이터 수집
│   │   ├── rss-collector.ts
│   │   └── fear-greed-api.ts
│   ├── analyzers/           # AI 분석
│   │   └── gemini-analyzer.ts
│   ├── messengers/          # 메시지 발송
│   │   └── telegram-sender.ts
│   ├── types/              # 타입 정의
│   │   └── news.types.ts
│   └── main.ts             # 메인 실행 스크립트
├── data/                   # 분석 결과 저장
├── .github/workflows/      # GitHub Actions
└── landing/                # Next.js 랜딩 페이지
```

## 🚀 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성하고 API 키를 입력하세요.

```bash
cp .env.example .env
```

필요한 API 키:
- `GEMINI_API_KEY`: [Google AI Studio](https://makersuite.google.com/app/apikey)
- `TELEGRAM_BOT_TOKEN`: Telegram [@BotFather](https://t.me/BotFather)
- `TELEGRAM_CHAT_ID`: 본인의 텔레그램 Chat ID

### 3. 실행

#### RSS 수집 테스트
```bash
npm run test:rss
```

#### 전체 파이프라인 실행
```bash
npm run dev
```

## ✅ Day 1 검증 완료!

**RSS 파싱이 정상 작동**하고 있습니다. 이는 **프로젝트의 30% 완료**를 의미합니다! 🎉

현재 구현된 기능:
- ✅ Google News RSS 수집 (20개 뉴스)
- ✅ Naver Stock RSS 수집 (10개 뉴스)
- ✅ 광고성 기사 필터링
- ✅ TypeScript 타입 정의

## 📋 다음 단계 (Day 2-5)

- [ ] Gemini API 연동 (AI 분석)
- [ ] Telegram Bot 구현
- [ ] GitHub Actions 자동화
- [ ] Next.js 랜딩 페이지

## 📊 30일 로드맵

| Phase | 기간 | 목표 |
|-------|------|------|
| Phase 1 | Day 1-5 | 개발 및 세팅 |
| Phase 2 | Day 6-12 | 콘텐츠 축적 & 시딩 |
| Phase 3 | Day 13-20 | 트래픽 증대 |
| Phase 4 | Day 21-30 | 공격적 수익화 (100만원 달성) |

## 📝 라이선스

MIT

## 👨‍💻 개발자

Made with ❤️ by [Your Name]
