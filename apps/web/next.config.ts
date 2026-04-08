import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect hyodo-tier routes to subdomain
      {
        source: '/hyodo-tier/:path*',
        destination: 'https://hyodo-tier.yeomniverse.com/:path*',
        permanent: true,
      },
      // Redirect finbrief routes to subdomain
      {
        source: '/finbrief/:path*',
        destination: 'https://finbrief.yeomniverse.com/:path*',
        permanent: true,
      },
      // Legacy hyodo-tier routes (SEO protection)
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
        source: '/blog',
        destination: 'https://hyodo-tier.yeomniverse.com/blog',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: 'https://hyodo-tier.yeomniverse.com/blog/:slug*',
        permanent: true,
      },
      {
        source: '/about',
        destination: 'https://hyodo-tier.yeomniverse.com/about',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: 'https://hyodo-tier.yeomniverse.com/privacy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: 'https://hyodo-tier.yeomniverse.com/terms',
        permanent: true,
      },
    ];
  },
  async headers() {
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

    // Base CSP — applied everywhere except the landing page.
    // No Spline-specific allowances; tighter worker-src.
    const baseCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://pagead2.googlesyndication.com https://vitals.vercel-insights.com",
      "worker-src 'self'",
      'frame-src https://googleads.g.doubleclick.net',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');

    // Landing-page CSP — relaxes the policy only for `/` so the Spline 3D
    // scene can load runtime/assets from prod.spline.design, unpkg, gstatic,
    // plus the blob: worker the Spline runtime spawns.
    const splineCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://va.vercel-scripts.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://pagead2.googlesyndication.com https://vitals.vercel-insights.com https://prod.spline.design https://unpkg.com https://www.gstatic.com",
      "worker-src 'self' blob:",
      'frame-src https://googleads.g.doubleclick.net',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');

    return [
      // Landing page only — relaxed CSP for Spline.
      {
        source: '/',
        headers: [
          ...commonSecurityHeaders,
          { key: 'Content-Security-Policy', value: splineCsp },
        ],
      },
      // Everything else — strict CSP without Spline allowances.
      // `/:path+` requires at least one segment so it never matches `/`.
      {
        source: '/:path+',
        headers: [
          ...commonSecurityHeaders,
          { key: 'Content-Security-Policy', value: baseCsp },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
