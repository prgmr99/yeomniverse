import type { NextConfig } from 'next';

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
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://pagead2.googlesyndication.com https://vitals.vercel-insights.com",
              'frame-src https://googleads.g.doubleclick.net',
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
