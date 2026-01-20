# Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Vercel Dashboard 설정 변경 (먼저 수행!)

> [!IMPORTANT]
> 코드를 푸시하기 **전에** Vercel Dashboard 설정을 변경해야 배포 실패를 방지할 수 있습니다.

1. **Vercel Dashboard 접속**
   - https://vercel.com 로그인
   - 프로젝트 선택 (hyo-tier)

2. **Settings → General**
   - Root Directory: `apps/web` 로 변경
   - 저장 (Save)

3. **Settings → Build & Development Settings**
   - Framework Preset: `Next.js` (이미 설정되어 있음)
   - Build Command 변경:
     ```
     cd ../.. && pnpm turbo build --filter=@hyo/web
     ```
   - Install Command: `pnpm install`
   - Output Directory: `.next`
   - 저장 (Save)

### 2. 로컬 빌드 테스트 (확인)

```bash
pnpm turbo build --filter=@hyo/web
```

✅ 빌드가 성공하는지 확인

### 3. Git Commit & Push

```bash
# 모든 변경사항 추가
git add .

# 커밋
git commit -m "feat: migrate to Turborepo monorepo structure

- Set up Turborepo with pnpm workspaces
- Extract shared packages: @hyo/ui, @hyo/utils, @hyo/tsconfig
- Update all import paths to use shared packages
- Configure Vercel deployment for monorepo
- Update documentation and deployment guides"

# 푸시
git push origin main
```

### 4. Vercel 자동 배포 확인

- Vercel Dashboard → Deployments
- 자동 배포 시작 확인
- 배포 로그 모니터링

### 5. 배포 성공 확인

배포 완료 후 다음 항목 테스트:

- [ ] 홈페이지 로드 (`/`)
- [ ] 퀴즈 시작 (`/quiz`)
- [ ] 결과 페이지 (`/result`)
- [ ] 블로그 (`/blog`)
- [ ] 카카오톡 공유 기능
- [ ] Google Analytics 작동
- [ ] Google AdSense 표시

---

## 🚨 문제 발생 시

### 배포 실패 - Build Command 에러

**Vercel 로그:**
```
Error: command not found: turbo
```

**해결:**
1. Vercel Dashboard → Settings → General
2. Root Directory가 `apps/web`로 설정되었는지 확인
3. Build Command가 정확한지 확인
4. Redeploy

### 배포 실패 - Module Not Found

**Vercel 로그:**
```
Module not found: Can't resolve '@hyo/ui'
```

**해결:**
1. Root Directory 설정 확인
2. pnpm-workspace.yaml이 커밋되었는지 확인
3. Redeploy

---

## 📋 Quick Commands

```bash
# 빌드 테스트
pnpm turbo build --filter=@hyo/web

# 개발 서버 실행
pnpm turbo dev --filter=@hyo/web

# 모든 변경사항 확인
git status

# 커밋 및 푸시
git add .
git commit -m "feat: migrate to Turborepo monorepo"
git push origin main
```

---

## ✅ Deployment Complete!

모든 단계가 완료되면 Vercel이 자동으로 새로운 Monorepo 구조로 빌드하고 배포합니다.
