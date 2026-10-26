import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 아직 서브도메인에 사는 서비스로 넘긴다.
      // 효도티어를 /hyodo-tier 경로로 옮길 때 이 두 항목을 rewrite로 바꾼다.
      {
        source: '/hyodo-tier/:path*',
        destination: 'https://hyodo-tier.yeomniverse.com/:path*',
        permanent: true,
      },
      {
        source: '/finbrief/:path*',
        destination: 'https://finbrief.yeomniverse.com/:path*',
        permanent: true,
      },
      // 루트가 효도티어였던 시절의 경로들. 루트에 같은 이름의 페이지가 없는
      // 것만 남긴다 — /about, /privacy, /terms는 이제 루트 자체 페이지다.
      {
        source: '/quiz',
        destination: 'https://hyodo-tier.yeomniverse.com/quiz',
        permanent: true,
      },
      {
        source: '/result',
        destination: 'https://hyodo-tier.yeomniverse.com/result',
        permanent: true,
      },
      {
        source: '/result/:path*',
        destination: 'https://hyodo-tier.yeomniverse.com/result/:path*',
        permanent: true,
      },
      {
        source: '/blog',
        destination: 'https://hyodo-tier.yeomniverse.com/blog',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: 'https://hyodo-tier.yeomniverse.com/blog/:slug*',
        permanent: true,
      },
    ];
  },
  async headers() {
    // CSP는 요청마다 nonce가 달라야 해서 middleware.ts에서 설정한다.
    // 여기서 CSP를 함께 내보내면 두 정책의 교집합이 적용돼 광고가 깨진다.
    const commonSecurityHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];

    return [{ source: '/:path*', headers: commonSecurityHeaders }];
  },
};

export default bundleAnalyzer(nextConfig);
