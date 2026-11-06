import type { Post } from '../types';

export const post: Post = {
  slug: 'middleware-runs-before-static-files',
  title: '로그인 미들웨어가 robots.txt까지 가로채고 있었다',
  description:
    '미들웨어는 정적 파일보다 먼저 실행된다. 로그인 월을 세운 사이트에서 공개되어야 할 파일이 조용히 로그인 화면으로 바뀌는 이유와, 허용 목록을 쓸 때 무엇을 빠뜨리기 쉬운지 정리했습니다.',
  date: '2026-11-06',
  tags: ['미들웨어', 'Vercel', 'SEO', '안심월세'],
  lead: '로그인해야 쓸 수 있는 서비스를 만들면서 미들웨어로 접근을 막았다. 그 자체는 잘 동작했다. 문제는 막을 생각이 없던 것까지 막혔다는 것이다.',
  sections: [
    {
      heading: '정적 파일이면 그냥 나갈 줄 알았다',
      blocks: [
        {
          type: 'p',
          text: 'robots.txt나 ads.txt 같은 파일은 그냥 디스크에 있는 텍스트다. 요청이 오면 서버가 읽어서 돌려준다. 애플리케이션 코드를 거칠 일이 없다고 생각하기 쉽다.',
        },
        {
          type: 'p',
          text: '그런데 미들웨어는 그보다 앞에 있다. 요청이 파일시스템에 닿기 전에 먼저 실행된다. 그래서 "로그인 안 했으면 로그인 화면으로"라는 규칙을 짜 두면, 크롤러가 robots.txt를 달라고 해도 로그인 화면이 나간다.',
        },
        {
          type: 'p',
          text: '크롤러 입장에서는 robots.txt가 HTML이다. 파싱에 실패하거나, 운이 나쁘면 이상하게 해석한다. ads.txt도 마찬가지로 무효가 된다. 둘 다 에러를 내지 않고 조용히 틀린다.',
        },
      ],
    },
    {
      heading: '허용 목록은 빠뜨리기 쉽다',
      blocks: [
        {
          type: 'p',
          text: '해결은 간단하다. 로그인 없이 나가야 할 경로를 목록으로 두고 거기 해당하면 그냥 통과시킨다.',
        },
        {
          type: 'code',
          code: `const PUBLIC_PATHS = /^\\/(login\\.html|robots\\.txt|sitemap\\.xml|ads\\.txt|…)$/;

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  if (PUBLIC_PATHS.test(url.pathname)) return next();
  // 이하 로그인 검사
}`,
        },
        {
          type: 'p',
          text: '문제는 이 목록이 처음부터 완전할 수 없다는 것이다. 처음 만들 때는 robots.txt와 sitemap.xml만 떠오른다. ads.txt는 나중에 광고를 붙이기로 하면서 추가되고, 그때 이 목록을 고쳐야 한다는 생각이 안 든다. 파일을 public에 넣었으니 끝이라고 여긴다.',
        },
        {
          type: 'p',
          text: '실제로 이 사이트에서도 ads.txt를 올려 두고 한참 뒤에야 알았다. 파일은 있는데 응답은 로그인 화면이었다.',
        },
        {
          type: 'note',
          text: '허용 목록 방식은 빠뜨린 것이 조용히 막힌다. 반대로 차단 목록 방식은 빠뜨린 것이 조용히 열린다. 로그인 월에서는 전자가 맞지만, 대신 "공개되어야 할 파일을 추가할 때마다 목록을 고친다"를 규칙으로 들고 있어야 한다.',
        },
      ],
    },
    {
      heading: '미들웨어가 전부가 아니다',
      blocks: [
        {
          type: 'p',
          text: '같은 사이트에서 하나 더 걸렸다. 로그인 월 뒤의 내용이 검색에 뜨면 안 되니 응답 헤더에 noindex를 넣어 두었는데, 그게 ads.txt에도 붙고 있었다.',
        },
        {
          type: 'code',
          code: `{
  "headers": [
    { "source": "/((?!robots\\\\.txt|sitemap\\\\.xml|ads\\\\.txt$).*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }] }
  ]
}`,
        },
        {
          type: 'p',
          text: '부정 전방탐색으로 예외를 만드는 방식인데, 여기도 똑같이 새 파일을 추가할 때마다 손봐야 한다. 미들웨어의 허용 목록과 헤더의 예외 목록이 따로 관리되고 있으니, 한쪽만 고치면 다른 쪽에서 막힌다.',
        },
        {
          type: 'p',
          text: '두 곳을 하나로 합치는 게 이상적이겠지만 실행 계층이 달라서 그러기 어렵다. 차선은 두 목록을 같은 파일에 나란히 두고 주석으로 서로를 가리키게 해 두는 것이다. 적어도 한쪽을 고칠 때 다른 쪽이 눈에 들어온다.',
        },
      ],
    },
    {
      heading: '확인은 밖에서 해야 한다',
      blocks: [
        {
          type: 'p',
          text: '이런 종류의 버그는 로컬에서 안 보인다. 개발 서버는 미들웨어 설정이 다르거나, 로그인 쿠키가 이미 브라우저에 있어서 통과한다.',
        },
        {
          type: 'p',
          text: '배포된 주소에 쿠키 없이 요청을 보내 봐야 한다.',
        },
        {
          type: 'code',
          code: `$ for p in /robots.txt /sitemap.xml /ads.txt; do
    curl -sS -o /tmp/o -w "$p %{http_code} %{content_type}\\n" "https://example.com$p"
    head -1 /tmp/o
  done`,
        },
        {
          type: 'p',
          text: '상태 코드, Content-Type, 첫 줄을 같이 본다. 셋 중 하나라도 어긋나면 그 파일은 제 역할을 못 하고 있는 것이다. 로그인 월이 있는 사이트라면 이 확인을 배포 체크리스트에 넣어 두는 편이 낫다. 한 번 틀리면 원인을 찾는 데 오래 걸리는 종류의 문제다.',
        },
      ],
    },
  ],
};
