export type WritingBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; code: string }
  | { type: 'note'; text: string };

export type WritingSection = {
  heading: string;
  blocks: WritingBlock[];
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** ISO 날짜. sitemap의 lastModified로도 쓴다. */
  date: string;
  tags: string[];
  lead: string;
  sections: WritingSection[];
};

export const POSTS: Post[] = [
  {
    slug: 'public-data-night-walk-safety',
    title: '공공데이터로 밤길 안전을 점수화하면서 배운 것',
    description:
      '월세 매물을 밤길 안전 기준으로 점수 매기는 도구를 만들며 겪은 문제들. 반경이 아니라 경로를 재야 하는 이유, 공공데이터의 함정, 데이터 공백을 0점으로 처리하면 안 되는 이유를 정리했습니다.',
    date: '2026-10-27',
    tags: ['공공데이터', '안심월세', '데이터 전처리'],
    lead: '방을 구할 때 매물 사진으로는 알 수 없는 것이 있다. 지하철역에서 그 집까지 밤 11시에 걸어가면 어떤 길인지다. 낮에 본 골목과 밤에 걷는 골목은 다른 장소고, 그 차이는 계약하고 몇 달 지나서야 체감된다. 그걸 미리 재보려고 도구를 하나 만들었는데, 만드는 과정이 생각과 많이 달랐다.',
    sections: [
      {
        heading: '반경이 아니라 경로를 재야 한다',
        blocks: [
          {
            type: 'p',
            text: '처음 떠올린 방법은 단순했다. 집 주변 반경 300m 안에 CCTV가 몇 대 있는지 세는 것이다. 데이터도 있고 계산도 쉽다.',
          },
          {
            type: 'p',
            text: '그런데 이 방식에는 구조적인 결함이 있다. 반경 안에 CCTV가 스무 대 있어도 그게 전부 집 반대편, 큰길 쪽에 몰려 있으면 내가 매일 걷는 골목은 여전히 깜깜하다. 반대로 CCTV가 세 대뿐이어도 그 세 대가 내가 걷는 길에 정확히 있으면 체감은 완전히 다르다.',
          },
          {
            type: 'p',
            text: '밤길이 무서운 건 "이 동네"가 아니라 "이 길"이다. 그래서 평가 대상을 집의 위치에서 역에서 집까지의 보행 경로로 바꿨다. 보행 경로는 TMAP에서 받는다. 직선거리가 아니라 실제로 사람이 걷는 경로여야 의미가 있다.',
          },
          {
            type: 'p',
            text: '여기서 한 번 더 쪼갰다. 같은 10분이라도 큰길만 걷는 10분과 골목을 통과하는 10분은 다르다. 경로를 대로·로와 골목으로 나눈 다음, 골목 구간에만 CCTV와 보안등 밀도를 적용하고 두 구간의 길이 비율로 섞었다. 큰길은 가로등과 유동인구가 기본으로 깔리니 따로 점수를 매길 필요가 없다.',
          },
        ],
      },
      {
        heading: '공공데이터는 생각보다 거칠다',
        blocks: [
          {
            type: 'p',
            text: '"공공데이터 포털에서 받아서 쓰면 된다"고 생각했는데, 실제로는 데이터를 쓸 수 있는 상태로 만드는 데 시간의 대부분이 들어갔다.',
          },
          {
            type: 'p',
            text: '보안등 데이터가 대표적이다. 전국보안등정보표준데이터를 포털 화면에서 다운로드하면 5만 행에서 잘린다. 그리고 하필 정렬 순서 때문에 서울이 통째로 빠진다. 파일을 열어보고 "서울 데이터가 왜 없지" 하다가 한참 뒤에야 알았다. API로 25개 구를 하나씩 나눠 받아야 했다.',
          },
          {
            type: 'p',
            text: '받고 나서도 끝이 아니다. 일부 자치구는 좌표 컬럼이 비어 있고 주소만 있다. 그 행들은 주소를 지오코딩해서 좌표를 채워야 하는데, 지오코딩 API는 하루 무료 한도가 있어서 한 번에 다 못 돌린다. 결국 나눠 돌리는 옵션을 따로 만들었다.',
          },
          {
            type: 'p',
            text: '좌표계도 함정이었다. 유흥업소 인허가 데이터의 좌표가 EPSG:5174인지 2097인지 문서만 봐서는 확실하지 않았다. 둘은 수백 미터씩 어긋난다. 결국 같은 행의 주소를 지오코딩한 결과와 비교해서 어느 쪽이 맞는지 역으로 확인하는 스크립트를 짰다.',
          },
          {
            type: 'note',
            text: '여기서 무서운 건 좌표계를 틀려도 에러가 안 난다는 것이다. 숫자는 멀쩡하고 지도에도 점이 찍힌다. 그냥 조용히 틀린 점수가 나온다. 외부 데이터를 쓸 때는 "파싱에 성공했다"와 "값이 맞다"가 전혀 다른 이야기다.',
          },
          {
            type: 'p',
            text: '집 좌표도 보정이 필요했다. 주소를 지오코딩하면 건물 중심 근처의 한 점이 나오는데, 실제로 걸어 들어가는 지점은 출입구다. 출입구 위치에 따라 경로가 반대쪽으로 돌아가는 경우가 있어서, 도로명주소 건물 도형에서 출입구 좌표를 가져와 덮어썼다.',
          },
        ],
      },
      {
        heading: '데이터가 없는 것과 나쁜 것은 다르다',
        blocks: [
          {
            type: 'p',
            text: '가중 합산을 짤 때 가장 고민한 지점이다. 어떤 자치구는 보안등 원본 데이터가 거의 없다. 이 지역 매물의 밤길 점수를 어떻게 할 것인가.',
          },
          {
            type: 'p',
            text: '처음엔 0점을 줬다. 구현이 제일 쉽다. 그런데 결과를 보니 데이터가 없는 구의 매물이 전부 하위권으로 깔렸다. 그 동네가 위험해서가 아니라 공공데이터가 부실해서다. 도구가 사실과 다른 말을 하고 있었다.',
          },
          {
            type: 'p',
            text: '그래서 해당 항목을 아예 빼고 남은 가중치로 다시 나누는 방식으로 바꿨다. 밤길 항목을 못 재면 도보·접면도로·긴급대응 같은 나머지 항목만으로 점수를 만든다.',
          },
          {
            type: 'code',
            code: `// 데이터가 없는 항목은 0점이 아니라 분모에서 제외한다\nconst usable = items.filter((i) => i.value !== null);\nconst totalWeight = usable.reduce((sum, i) => sum + i.weight, 0);\nconst score = usable.reduce(\n  (sum, i) => sum + i.value * i.weight,\n  0,\n) / totalWeight;`,
          },
          {
            type: 'p',
            text: '대신 그 매물은 근거가 얕다는 표시를 따로 남긴다. 점수가 같아도 여섯 항목으로 나온 점수와 네 항목으로 나온 점수는 신뢰도가 다르고, 그 차이는 사용자가 알아야 한다.',
          },
        ],
      },
      {
        heading: '합산하면 안 되는 것이 있다',
        blocks: [
          {
            type: 'p',
            text: '점수를 만들다 보면 모든 걸 하나의 숫자로 합치고 싶어진다. 비교가 쉬워지기 때문이다. 그런데 합치면 안 되는 항목이 있었다.',
          },
          {
            type: 'p',
            text: '등기부에서 확인하는 것들이다. 신탁 등기, 압류, 소유자 불일치, 위반건축물, 보증금과 근저당의 합이 공시가격의 70%를 넘는 이른바 깡통 매물. 이걸 가중치 하나로 점수에 섞으면, 다른 항목에서 높은 점수를 받은 매물이 위험을 안고 상위권에 올라온다.',
          },
          {
            type: 'p',
            text: '성격이 다르기 때문이다. 밤길이 어두운 집은 감수하고 들어갈 수 있다. 역에서 12분 걸리는 집도 마찬가지다. 그런데 보증금을 잃을 수 있는 집은 다른 조건이 아무리 좋아도 후보가 아니다. 이건 가중치의 문제가 아니라 필터의 문제다.',
          },
          {
            type: 'p',
            text: '그래서 계약 위험은 점수에서 완전히 분리해 별도 판정으로 두고, 하나라도 걸리면 순위 맨 아래로 내린다. 그리고 아직 확인하지 않은 항목은 안전으로 처리하지 않고 "확인 필요"로 둔다. 모르는 것과 괜찮은 것을 구분하는 게 이 화면의 목적이다.',
          },
        ],
      },
      {
        heading: '점수는 답이 아니라 순서다',
        blocks: [
          {
            type: 'p',
            text: '만들면서 계속 되뇐 원칙이 하나 있다. 이 도구는 "어디가 가장 좋은가"를 답하지 않는다. "어디를 먼저 가볼 것인가"를 정할 뿐이다.',
          },
          {
            type: 'p',
            text: '공공데이터는 현장의 많은 것을 담지 못한다. 공동현관이 실제로 잠기는지, 1층에 어떤 업종이 있는지, 밤에 그 골목에 사람이 다니는지는 데이터에 없다. CCTV가 있어도 각도가 엉뚱하면 의미가 없다.',
          },
          {
            type: 'p',
            text: '그래서 점수 다음 단계를 같이 넣었다. 추려진 매물을 직접 가서 확인할 체크리스트, 그리고 계약까지 가는 동안 봐야 할 서류 순서다. 점수가 하는 일은 하루에 서너 곳밖에 못 가보는 상황에서 어디부터 갈지 정해주는 것까지다. 그 이상을 약속하면 도구가 거짓말을 하게 된다.',
          },
        ],
      },
    ],
  },
  {
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
  },
];

export const POST_SLUGS = POSTS.map((post) => post.slug);

export function getPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}
