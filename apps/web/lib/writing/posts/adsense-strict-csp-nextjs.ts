import type { Post } from '../types';

export const post: Post = {
  slug: 'adsense-strict-csp-nextjs',
  title: 'Next.js에서 AdSense와 strict CSP를 같이 쓰기',
  description:
    'Google은 AdSense에 대해 도메인 허용목록을 지원하지 않습니다. nonce 기반 strict CSP로 전환하면서 정적 생성을 포기해야 했던 과정과, 그 과정에서 확인한 것들을 정리했습니다.',
  date: '2026-10-27',
  tags: ['Next.js', 'CSP', 'AdSense', '보안'],
  lead: '사이트에 Content-Security-Policy를 걸어두고 AdSense를 붙이면, 광고는 뜨는데 콘솔에 조용히 차단 로그가 쌓인다. 허용목록에 도메인을 하나씩 추가하는 방식으로는 이 문제가 끝나지 않는다. Google이 그 방식을 지원하지 않기 때문이다.',
  sections: [
    {
      heading: '증상',
      blocks: [
        {
          type: 'p',
          text: '광고 자체는 뜨는데 콘솔에 이런 게 찍힌다.',
        },
        {
          type: 'code',
          code: `Connecting to 'https://ep1.adtrafficquality.google/getconfig/sodar?...'\nviolates the following Content Security Policy directive:\n"connect-src 'self' https://www.google-analytics.com\nhttps://pagead2.googlesyndication.com ..."`,
        },
        {
          type: 'p',
          text: 'AdSense의 무효 트래픽 탐지 비컨이 CSP에 막힌 것이다. 광고가 당장 안 보이는 건 아니라서 놓치기 쉽지만, Google 문서는 CSP가 맞지 않으면 광고 게재가 방해될 수 있다고 명시한다.',
        },
        {
          type: 'p',
          text: '처음 든 생각은 당연히 "connect-src에 저 도메인을 추가하자"였다.',
        },
      ],
    },
    {
      heading: '허용목록은 해결책이 아니다',
      blocks: [
        {
          type: 'p',
          text: 'Google의 AdSense 문서를 찾아보면 이 접근을 명시적으로 막는다. 요지는 이렇다. AdSense 코드가 쓰는 도메인은 시간이 지나면서 바뀌기 때문에, 허용목록 방식은 지원하지 않는다. nonce 기반 strict CSP만 지원한다.',
        },
        {
          type: 'p',
          text: '실제로 그렇다. `ep1.adtrafficquality.google`을 추가해도 다음에 `ep3`가 생기면 또 막힌다. 광고가 깨지는 시점은 내가 배포한 날이 아니라 Google이 엔드포인트를 늘린 날이고, 그때는 원인을 찾기도 어렵다.',
        },
        {
          type: 'p',
          text: 'Google이 권장하는 정책은 대략 이런 모양이다.',
        },
        {
          type: 'code',
          code: `script-src 'nonce-{RANDOM}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' https: http:;\nobject-src 'none';\nbase-uri 'none';`,
        },
        {
          type: 'p',
          text: '여기서 눈여겨볼 점이 두 가지 있다. 첫째, `connect-src`와 `frame-src`에 대한 제한이 아예 없다. 보호는 `script-src`가 담당하고 전송 계열은 열어두는 구조다. 둘째, `unsafe-inline`과 `https:`가 같이 들어 있는데, 이건 nonce와 strict-dynamic을 모르는 구형 브라우저용 폴백이다. 둘을 이해하는 브라우저는 이 값들을 무시한다.',
        },
      ],
    },
    {
      heading: 'Next.js에서의 구현',
      blocks: [
        {
          type: 'p',
          text: 'nonce는 요청마다 달라야 하므로 미들웨어에서 만든다. 중요한 건 응답 헤더뿐 아니라 요청 헤더에도 넣는 것이다. Next.js는 요청 헤더의 CSP에서 nonce를 읽어 자신이 렌더하는 script 태그에 자동으로 붙인다.',
        },
        {
          type: 'code',
          code: `const nonce = Buffer.from(crypto.randomUUID()).toString('base64');\nconst csp = buildCsp(nonce);\n\nconst requestHeaders = new Headers(request.headers);\nrequestHeaders.set('x-nonce', nonce);\nrequestHeaders.set('content-security-policy', csp);\n\nconst response = NextResponse.next({ request: { headers: requestHeaders } });\nresponse.headers.set('content-security-policy', csp);`,
        },
        {
          type: 'p',
          text: '그리고 레이아웃에서 nonce를 읽어 직접 넣는 스크립트들에 전달한다.',
        },
        {
          type: 'code',
          code: `const nonce = (await headers()).get('x-nonce') ?? undefined;`,
        },
        {
          type: 'note',
          text: 'CSP를 next.config.ts의 headers()에도 함께 설정하면 안 된다. 브라우저는 CSP 헤더가 여러 개일 때 교집합을 적용하므로, 한쪽에 nonce가 없으면 결국 막힌다. 미들웨어 한 곳에서만 내보내야 한다.',
        },
      ],
    },
    {
      heading: '대가: 정적 생성을 잃는다',
      blocks: [
        {
          type: 'p',
          text: '이 방식의 비용은 분명하다. nonce는 응답 시점에 만들어져야 하므로 HTML을 미리 만들어 둘 수 없다. 레이아웃에서 `headers()`를 호출하는 순간 전체 라우트가 동적 렌더링으로 바뀐다.',
        },
        {
          type: 'code',
          code: `Route (app)                 전        후\n/                           ○ Static  ƒ Dynamic\n/about                      ○ Static  ƒ Dynamic\n/services/[slug]            ● SSG     ƒ Dynamic`,
        },
        {
          type: 'p',
          text: '모든 페이지가 정적으로 생성되던 사이트가 요청마다 서버를 거치게 된다. 콘텐츠가 바뀌지 않는 소개 페이지까지 그렇다. 이게 받아들일 만한 비용인지는 사이트 성격에 달렸다. 트래픽이 크고 HTML이 거의 안 바뀌는 사이트라면 다시 생각해 볼 문제다.',
        },
        {
          type: 'p',
          text: '다만 보안 측면에서는 분명히 나아진다. 기존 정책은 `script-src`에 `unsafe-inline`과 `unsafe-eval`이 들어간 채 호스트 허용목록에 의존하고 있었는데, 그 조합은 XSS 방어력이 거의 없다. strict-dynamic으로 바꾸면 nonce를 가진 스크립트가 불러온 것만 실행되므로, HTML에 주입된 script 태그는 동작하지 않는다.',
        },
      ],
    },
    {
      heading: '확인하는 법',
      blocks: [
        {
          type: 'p',
          text: '제대로 걸렸는지는 눈으로 확인하기 어렵다. 두 가지를 봤다.',
        },
        {
          type: 'p',
          text: '첫째, 같은 응답의 헤더 nonce와 HTML 안 script 태그의 nonce가 일치하는지. 하나라도 빠지면 그 스크립트는 실행되지 않는다.',
        },
        {
          type: 'code',
          code: `# 헤더의 nonce와 HTML script 태그의 nonce가 모두 같아야 한다\ncurl -s -D h.txt https://example.com/ -o b.html\nN=$(grep -oE 'nonce-[A-Za-z0-9+/=]+' h.txt | head -1 | sed 's/nonce-//')\ngrep -oE '<script' b.html | wc -l\ngrep -oE "<script[^>]*nonce=\\"$N\\"" b.html | wc -l`,
        },
        {
          type: 'p',
          text: '둘째, AdSense 스크립트가 실제로 실행됐는지. strict-dynamic 아래에서는 외부 스크립트가 DOM에 삽입되는 방식이라 네트워크 탭만으로는 헷갈린다. 전역 객체를 보는 게 확실하다.',
        },
        {
          type: 'code',
          code: `typeof window.adsbygoogle  // "object"면 실행된 것, "undefined"면 차단된 것`,
        },
        {
          type: 'note',
          text: '콘솔을 볼 때는 탭을 새로 열어라. 브라우저 콘솔은 이전 페이지의 메시지를 버퍼에 남겨두기 때문에, 이미 고친 뒤에도 옛 정책의 위반 로그가 계속 보인다. 이것 때문에 한참 헤맸다.',
        },
      ],
    },
  ],
};
