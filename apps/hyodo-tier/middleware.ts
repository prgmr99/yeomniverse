import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Old Vercel domain to redirect FROM
const OLD_DOMAIN = 'hyo-tier.vercel.app';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // If request is from old Vercel domain, redirect to new domain
  if (host === OLD_DOMAIN || host === `www.${OLD_DOMAIN}`) {
    const newDomain =
      process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyo-do-tier.vercel.app';
    const url = new URL(request.url);
    url.host = new URL(newDomain).host;
    url.protocol = 'https:';

    return NextResponse.redirect(url.toString(), {
      status: 301, // Permanent redirect for SEO
    });
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static files and API routes that shouldn't redirect
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - api/og (OG image generation - needs to work on old domain too for cached shares)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api/og).*)',
  ],
};
