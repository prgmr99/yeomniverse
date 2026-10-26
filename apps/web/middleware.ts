import { type NextRequest, NextResponse } from 'next/server';

/**
 * AdSense는 도메인 허용목록을 지원하지 않는다 — 쓰는 호스트가 예고 없이
 * 바뀌기 때문이다. Google이 지원하는 방식은 요청마다 새 nonce를 발급하는
 * strict CSP 하나뿐이라, script-src로 보호하고 전송 계열 지시문은 열어둔다.
 * https://support.google.com/adsense/answer/16283098
 */
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    // 'unsafe-inline'과 https:는 nonce를 모르는 구형 브라우저용 폴백이다.
    // nonce와 strict-dynamic을 이해하는 브라우저는 둘을 무시한다.
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' https: http:`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    'frame-src https:',
    "media-src 'self' https:",
    // Spline 런타임이 blob: 워커를 띄운다.
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildCsp(nonce);

  // Next는 요청 헤더의 CSP에서 nonce를 읽어 자신이 렌더하는 script 태그에
  // 붙인다. 그래서 응답뿐 아니라 요청 헤더에도 넣어야 한다.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('content-security-policy', csp);

  return response;
}

export const config = {
  matcher: [
    {
      // 정적 자산과 prefetch에는 CSP를 붙일 필요가 없다.
      source:
        '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
