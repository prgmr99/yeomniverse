import type { Post } from '../types';

export const post: Post = {
  slug: 'noindex-scope-query-param',
  title: '결과 페이지만 색인에서 빼려다 도구 입구까지 같이 빠졌다',
  description:
    '개인 응답이 담긴 결과 주소를 색인에서 제외하려고 noindex를 걸었는데, 쿼리 유무를 구분하지 않아 설문 화면까지 함께 빠졌다. 어디까지가 색인 대상인지 나누는 기준과 Next.js에서의 분기 방법을 적었습니다.',
  date: '2026-11-06',
  tags: ['Next.js', 'SEO', 'noindex', '메타데이터'],
  lead: '자가진단 도구를 만들면서 결과 주소에 noindex를 걸었다. 개인이 입력한 응답이 쿼리스트링에 실리니 검색에 뜰 이유가 없다고 봤다. 판단은 맞았는데 적용 범위가 틀렸다.',
  sections: [
    {
      heading: '한 라우트가 두 가지 역할을 한다',
      blocks: [
        {
          type: 'p',
          text: '/check라는 주소 하나가 두 화면을 담당하고 있었다.',
        },
        {
          type: 'list',
          items: [
            '/check — 여섯 문항짜리 설문 화면. 누구에게나 같은 내용이다.',
            '/check?c=2-1-0-3-1-2 — 그 응답으로 계산한 결과. 사람마다 다르다.',
          ],
        },
        {
          type: 'p',
          text: '색인에서 빼야 하는 건 두 번째다. 응답 조합마다 주소가 다르니 사실상 무한히 많고, 내용도 개인적이다. 색인에 쌓여 봐야 좋을 게 없다.',
        },
        {
          type: 'p',
          text: '그런데 첫 번째는 다르다. 도구 그 자체이고, 소개 페이지에서 링크를 걸어 두는 화면이다. 검색에서 들어올 수 있어야 하는 입구다.',
        },
        {
          type: 'p',
          text: '코드는 둘을 구분하지 않고 있었다.',
        },
        {
          type: 'code',
          code: `const base: Metadata = { robots: NOINDEX };

if (!answers) {
  return { ...base, title: DEFAULT_TITLE, description: DEFAULT_DESC };
}
// 결과용 메타
return { ...base, /* … */ };`,
        },
        {
          type: 'p',
          text: 'base를 먼저 만들고 양쪽에 펼쳤다. 결과가 없을 때, 즉 설문 화면일 때도 noindex가 따라간다. 주석에는 "결과는 개인 응답 기반이라 색인 대상이 아니다"라고 적혀 있었다. 의도는 분명한데 코드가 그보다 넓게 적용되고 있었다.',
        },
      ],
    },
    {
      heading: '증상이 없는 버그다',
      blocks: [
        {
          type: 'p',
          text: '이런 종류는 알아차리기 어렵다. 에러가 안 나고, 화면도 멀쩡하고, 링크를 타고 들어오면 잘 동작한다. 그냥 검색에서 안 보일 뿐이다.',
        },
        {
          type: 'p',
          text: '게다가 "원래 트래픽이 적구나"로 설명이 되어 버린다. 색인에서 빠져 있다는 가설에 도달하려면 누군가 한 번은 실제 응답 헤더를 들여다봐야 한다.',
        },
        {
          type: 'code',
          code: `$ curl -sS https://example.com/check | grep -o '<meta name="robots"[^>]*>'
<meta name="robots" content="noindex, follow"/>`,
        },
        {
          type: 'note',
          text: '이걸 처음 재려고 했을 때 패턴을 `<meta name="robots" content="[^"]*">`로 썼다가 아무것도 못 찾았다. Next.js는 "/>로 닫는데 패턴은 ">로 끝나기를 요구하고 있었다. 검증 도구가 틀려서 "문제없음"이 나오는 경우가 있으니, 아무것도 안 나올 때는 패턴부터 의심하는 게 좋다.',
        },
      ],
    },
    {
      heading: '쿼리가 있을 때만 걸면 된다',
      blocks: [
        {
          type: 'p',
          text: 'generateMetadata는 이미 쿼리를 읽고 있었으니 분기 하나면 끝이었다.',
        },
        {
          type: 'code',
          code: `const { c } = await searchParams;
const answers = decodeCheckAnswers(c);

if (!answers) {
  // 코드 없는 진입은 설문 화면 자체라 색인 대상이다
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    alternates: alternatesFor('/check'),
  };
}

const base: Metadata = { robots: NOINDEX };   // 결과에만 건다`,
        },
        {
          type: 'p',
          text: '잘못된 코드가 들어온 경우도 이 분기로 떨어진다. 디코딩에 실패하면 answers가 null이니 설문 화면과 같은 취급을 받는다. 이때 canonical이 /check를 가리키므로 쓰레기 쿼리가 붙은 주소들은 전부 깨끗한 주소로 합쳐진다. 의도한 건 아니었는데 결과적으로 맞는 동작이었다.',
        },
      ],
    },
    {
      heading: '사이트맵과 맞춰야 한다',
      blocks: [
        {
          type: 'p',
          text: '색인을 허용했으면 사이트맵에도 넣어야 한다. 안 넣으면 반쪽이다. 반대로 noindex인 주소가 사이트맵에 있으면 그것도 모순이라, 확인해 보니 다행히 /check는 사이트맵에 없었다. noindex와 일관된 상태였고 이제 둘 다 바꾸면 됐다.',
        },
        {
          type: 'code',
          code: `{ path: '/data', changeFrequency: 'weekly', priority: 0.7 },
// 결과(/check?c=…)는 noindex다. 코드 없는 설문 화면만 색인 대상이다.
{ path: '/check', changeFrequency: 'monthly', priority: 0.7 },`,
        },
        {
          type: 'p',
          text: '겸사겸사 제목 중복도 고쳤다. 레이아웃에 title.template이 "%s | 치잡"으로 걸려 있는데 이 페이지만 사이트명을 손으로 덧붙이고 있어서 "근무조건 자가진단 | 치잡 | 치잡"이 나왔다. 색인이 안 될 때는 안 보이던 게, 켜는 순간 검색 결과에 그대로 나오게 된다.',
        },
        {
          type: 'note',
          text: 'openGraph.title은 template을 타지 않는다. 그래서 문서 제목만 맨 제목으로 바꾸고 공유 카드 제목은 사이트명을 붙인 채로 두었다. 두 값이 같아 보여도 처리 경로가 다르다.',
        },
        {
          type: 'p',
          text: '교훈을 한 줄로 줄이면, noindex는 라우트가 아니라 "응답"에 거는 것이다. 한 주소가 입력에 따라 다른 성격의 페이지가 된다면 그 분기까지 메타데이터가 따라가야 한다.',
        },
      ],
    },
  ],
};
