# 💯 2025학년도 대국민 효도능력시험 (Hyo-Tier)

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-Bear-orange?style=for-the-badge&logo=react&logoColor=white" />
  <br/>
  
  <br/>
  
  <h3>👵 "당신은 1등급 효자입니까?" 👴</h3>
  <p>
    MZ세대를 위한 <b>부모님 탐구영역 모의고사</b> 서비스입니다.<br/>
    단순한 심리테스트를 넘어, 부모님에 대한 관심도를 진단하고<br/>
    재미와 감동, 그리고 약간의 '뼈 때리기'를 선사합니다.
  </p>

  [👉 시험 응시하러 가기 (Demo)](https://hyo-tier.vercel.app)
</div>

---

## ✨ 프로젝트 소개 (Overview)

**효도티어(Hyo-Tier)**는 "부모님과 친하다고 생각하지만, 막상 아는 건 별로 없는" 현대 자녀들의 현실을 꼬집는 바이럴 퀴즈 서비스입니다.

* **Concept:** 2025학년도 수능 시험지 컨셉 (Newtro Design)
* **Target:** 디지털 네이티브 (Mobile First)
* **Goal:** 카카오톡 바이럴 공유 및 재미를 통한 가족 간 소통 유도

## 🚀 핵심 기능 (Key Features)

### 1. 📝 14문항의 부모님 탐구영역
단순한 취향 파악부터 깊은 가치관까지, 3단계(기초/관계/심화)로 구성된 퀴즈를 통해 `관심도`, `친밀도`, `표현력`을 정밀하게 측정합니다.

### 2. 📊 8가지 효도 유형 분석 (Algorithm)
사용자의 응답 패턴(츤데레 성향, 자본주의 성향 등)을 분석하여 8가지의 독창적인 캐릭터를 매칭합니다.
> 🦄 **전설의 유니콘 효자**, 💳 **금융치료 전문의**, 🌵 **방구석 츤데레** 등

### 3. 🎨 동적 성적표 생성 (Dynamic OG Image)
`@vercel/og`를 활용하여, 공유받는 사람의 이름과 등급이 박힌 **성적표 썸네일**을 서버리스 환경에서 즉시 생성합니다.
* *Tech:* Next.js ImageResponse

### 4. 💌 카카오톡 공유 최적화
친구에게 내 성적표를 자랑하거나, "너도 한번 풀어봐"라며 도발(?)할 수 있는 맞춤형 공유 기능을 제공합니다.

---

## 🛠 기술 스택 (Tech Stack)

| Category | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** | App Router, Server Actions |
| **Language** | **TypeScript** | Strict typing for logic safety |
| **Styling** | **Tailwind CSS v4** | Zero-config, CSS-first configuration |
| **State Mgmt** | **Zustand** | Lightweight global state for quiz logic |
| **Animation** | **CSS Keyframes** | Zero-dependency performance optimization |
| **Deployment** | **Vercel** | CI/CD, Edge Functions |

## 📂 폴더 구조 (Directory Structure)

```bash
hyo-tier/
├── app/
│   ├── api/og/          # 동적 OG 이미지 생성 API
│   ├── quiz/            # 퀴즈 진행 페이지 & 로직
│   ├── result/          # 결과 분석 & 공유 페이지
│   ├── globals.css      # Tailwind v4 테마 설정 (@theme)
│   └── layout.tsx       # 모바일 뷰 레이아웃 & 폰트 설정
├── components/
│   ├── ui/              # 버튼, 카드 등 공통 컴포넌트
│   └── quiz/            # 진행바, 선택지 등 퀴즈 전용 컴포넌트
├── hooks/               # 카카오 공유 등 커스텀 훅
├── lib/
│   ├── constants.ts     # 질문 데이터 상수
│   ├── resultData.ts    # 결과 캐릭터 데이터
│   └── calculate.ts     # 유형 판별 알고리즘
└── store/               # Zustand 스토어 (useQuizStore)