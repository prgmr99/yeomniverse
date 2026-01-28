#!/bin/bash
set -e

echo "🔧 Yeomniverse 최적화 시작..."
echo ""

# P0: 폰트 설정 수정
echo "✓ 1/3: 폰트 서브셋 수정 (한글 지원)"
sed -i '' "s/subsets: \['latin'\]/subsets: ['latin', 'korean']/" app/fonts.ts
sed -i '' "s/display: 'optional'/display: 'swap'/" app/fonts.ts

# P1: Sitemap 생성
echo "✓ 2/3: Sitemap 생성"
cat > app/sitemap.ts << 'EOF'
export default function sitemap() {
  return [{
    url: process.env.NEXT_PUBLIC_DOMAIN_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }];
}
EOF

# P1: Robots.txt 생성
echo "✓ 3/3: Robots.txt 생성"
mkdir -p public
cat > public/robots.txt << 'EOF'
User-agent: *
Allow: /
Sitemap: https://yeomniverse.com/sitemap.xml
EOF

echo ""
echo "✅ 자동 수정 완료!"
echo ""
echo "변경된 파일:"
echo "  - app/fonts.ts (폰트 서브셋 + display 전략)"
echo "  - app/sitemap.ts (새로 생성)"
echo "  - public/robots.txt (새로 생성)"
echo ""
echo "다음: 수동 작업 5개를 진행해주세요."
