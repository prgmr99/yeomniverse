# Vercel Deployment Guide for Monorepo

## 🚀 Vercel Project Settings

현재 Vercel 프로젝트 설정을 다음과 같이 업데이트해야 합니다:

### 1. Root Directory 설정
```
Root Directory: apps/web
```

### 2. Build & Development Settings

**Framework Preset:** Next.js

**Build Command:**
```bash
cd ../.. && pnpm turbo build --filter=@hyo/web
```

**Install Command:**
```bash
pnpm install
```

**Output Directory:**
```
.next
```

**Development Command:**
```bash
pnpm dev
```

### 3. Environment Variables

모든 환경 변수는 Vercel Dashboard에서 그대로 유지됩니다:

- `NEXT_PUBLIC_DOMAIN_URL`
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- `NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`
- `NEXT_PUBLIC_KAKAO_APP_KEY`

## 📋 Vercel Dashboard 설정 방법

### Option A: Vercel Dashboard에서 직접 설정

1. **Vercel Dashboard 접속**
   - 프로젝트 선택
   - Settings → General

2. **Root Directory 변경**
   - Root Directory: `apps/web`
   - 저장

3. **Build & Development Settings**
   - Framework Preset: `Next.js` (자동 감지됨)
   - Build Command 변경:
     ```
     cd ../.. && pnpm turbo build --filter=@hyo/web
     ```
   - Install Command: `pnpm install`
   - Output Directory: `.next`

4. **Redeploy**
   - Deployments 탭으로 이동
   - 최근 배포 선택 → "Redeploy" 클릭

### Option B: Git Push로 자동 배포

1. 모노레포 변경사항을 Git에 커밋:
```bash
git add .
git commit -m "feat: migrate to Turborepo monorepo structure"
git push origin main
```

2. Vercel이 자동으로 배포 시도
3. 실패하면 Dashboard에서 Settings 업데이트 후 Redeploy

## 🔧 Troubleshooting

### 문제: Build Command 실패

**증상:**
```
Error: command not found: turbo
```

**해결:**
- Root에서 `pnpm install`이 제대로 실행되었는지 확인
- Build Command가 `cd ../..`로 시작하는지 확인

### 문제: Module Not Found 에러

**증상:**
```
Module not found: Can't resolve '@hyo/ui'
```

**해결:**
- Root Directory가 `apps/web`로 설정되었는지 확인
- Install Command가 workspace root에서 실행되도록 설정

### 문제: Environment Variables 누락

**해결:**
- Vercel Dashboard → Settings → Environment Variables 확인
- 모든 `NEXT_PUBLIC_*` 변수가 설정되어 있는지 확인

## ✅ 배포 확인

배포 성공 후 확인사항:

1. **홈페이지 로드** (`/`)
2. **퀴즈 페이지** (`/quiz`)
3. **결과 페이지** (`/result`)
4. **블로그** (`/blog`)
5. **Google Analytics 작동 확인**
6. **카카오톡 공유 기능 확인**

## 📝 vercel.json 파일

`apps/web/vercel.json` 파일이 생성되었습니다. 이 파일은 Vercel CLI를 사용할 때 자동으로 적용됩니다.

```json
{
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@hyo/web",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

## 🎉 완료!

설정이 완료되면 Vercel이 Turborepo를 사용하여 빌드를 진행합니다.

**예상 빌드 시간:** 약 15-20초 (Turborepo 캐싱 미적용시)
**재배포 시:** 캐시 적용으로 더 빠른 배포 가능
