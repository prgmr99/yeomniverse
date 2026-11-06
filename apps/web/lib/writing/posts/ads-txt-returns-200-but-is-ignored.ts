import type { Post } from '../types';

export const post: Post = {
  slug: 'ads-txt-returns-200-but-is-ignored',
  title: 'ads.txt가 200을 주는데도 무효였다',
  description:
    'SPA의 catch-all rewrite가 ads.txt 요청을 삼켜 HTML을 돌려주고 있었다. 상태 코드만 보면 정상이라 눈치채기 어렵다. IAB 스펙이 Content-Type을 어떻게 다루는지, Vercel의 라우팅 순서가 왜 해결책이 되는지 정리했습니다.',
  date: '2026-11-06',
  tags: ['AdSense', 'ads.txt', 'Vercel', 'SPA'],
  lead: '광고가 붙지 않아 ads.txt부터 확인했다. curl로 찍어 보니 200이 떴다. 그래서 한동안 이 파일은 용의선상에서 빼 두었다. 상태 코드만 봤기 때문이다.',
  sections: [
    {
      heading: '200인데 내용이 HTML이었다',
      blocks: [
        {
          type: 'p',
          text: '뒤늦게 본문까지 확인했더니 이게 나왔다.',
        },
        {
          type: 'code',
          code: `$ curl -sS https://example.vercel.app/ads.txt | head -3
<!doctype html>
<html lang="en">
  <head>`,
        },
        {
          type: 'p',
          text: 'ads.txt를 달라고 했는데 index.html이 왔다. 원인은 SPA 배포에서 거의 반드시 들어가는 이 설정이었다.',
        },
        {
          type: 'code',
          code: `{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`,
        },
        {
          type: 'p',
          text: '클라이언트 라우팅을 쓰는 SPA는 /daily 같은 주소로 직접 들어와도 index.html을 받아야 한다. 서버에 그런 파일이 없으니 전부 index.html로 돌려보내는 규칙을 넣는다. 그런데 이 규칙은 경로를 가리지 않는다. ads.txt도 "그런 파일 없음"에 해당하면 똑같이 삼켜진다.',
        },
        {
          type: 'note',
          text: '서버가 200을 반환하는 것과 요청한 것을 돌려주는 것은 다른 문제다. 정적 파일을 확인할 때 상태 코드만 보면 이 종류의 버그는 보이지 않는다. 본문과 Content-Type까지 같이 봐야 한다.',
        },
      ],
    },
    {
      heading: '스펙은 틀린 Content-Type을 오류로 본다',
      blocks: [
        {
          type: 'p',
          text: '"그래도 200이니까 크롤러가 어떻게든 읽지 않을까" 싶었지만 아니었다. IAB의 ads.txt 명세는 이 파일이 text/plain으로 제공되어야 한다고 정해 두었고, 다른 Content-Type으로 오면 오류로 보고 무시한다.',
        },
        {
          type: 'p',
          text: '구글 쪽 설명도 같은 방향이다. 파일을 가져오는 데 실패하면 그 파일은 없는 것으로 취급한다. 그리고 ads.txt가 없으면 그 사이트의 광고 재고는 인증되지 않은 것이 된다.',
        },
        {
          type: 'p',
          text: '성가신 점은 이게 조용히 실패한다는 것이다. 에러가 뜨지 않는다. 파일을 올렸고, 주소를 열면 200이 나오고, 그런데 광고만 안 나온다. 어디를 봐야 하는지 모르면 한참 돌아간다.',
        },
        {
          type: 'list',
          items: [
            '상태 코드가 200인가',
            'Content-Type이 text/plain인가',
            '본문 첫 줄이 실제로 선언문인가',
          ],
        },
        {
          type: 'p',
          text: '세 가지를 한 번에 보는 게 제일 빠르다.',
        },
        {
          type: 'code',
          code: `$ curl -sS -o /tmp/a -w "%{http_code} %{content_type}\\n" \\
    https://example.com/ads.txt && head -1 /tmp/a
200 text/plain; charset=utf-8
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`,
        },
      ],
    },
    {
      heading: '해결은 라우팅 순서에 있다',
      blocks: [
        {
          type: 'p',
          text: 'rewrite에 예외를 추가하는 방법도 있다. 정규식으로 ads.txt를 빼면 된다. 그런데 더 간단한 방법이 있었다.',
        },
        {
          type: 'p',
          text: 'Vercel은 요청을 이 순서로 처리한다.',
        },
        {
          type: 'code',
          code: `headers / redirects
      ↓
파일시스템 (실제 파일이 있으면 여기서 끝)
      ↓
rewrites`,
        },
        {
          type: 'p',
          text: 'rewrite는 마지막이다. 그 말은 실제 파일이 존재하면 catch-all까지 내려가지 않는다는 뜻이다. public/ads.txt를 두는 것만으로 해결된다. 설정을 건드릴 필요가 없다.',
        },
        {
          type: 'p',
          text: '이 순서를 알아 두면 비슷한 문제를 미리 피할 수 있다. robots.txt, sitemap.xml, 각종 인증 파일처럼 "SPA 라우팅 대상이 아닌데 경로로 들어오는 것"은 전부 같은 함정을 공유한다. 전부 실제 파일로 두면 된다.',
        },
      ],
    },
    {
      heading: '고쳐도 바로 반영되지 않는다',
      blocks: [
        {
          type: 'p',
          text: '파일을 제대로 올린 뒤에도 광고가 곧바로 돌아오지는 않는다. 크롤러가 다시 읽어야 하고 그 주기가 있다.',
        },
        {
          type: 'p',
          text: '더 헷갈리는 건 중간 상태다. 구글은 200을 주면서 내용만 틀린 경우(이른바 소프트 404)에 이전에 읽어 둔 선언을 며칠간 유지한다. 그래서 고치기 전에도 한동안은 광고가 나왔을 수 있고, 고친 뒤에도 한동안은 변화가 없어 보인다. 둘 다 "지금 파일 상태"와 무관하게 움직인다.',
        },
        {
          type: 'note',
          text: '그래서 이 문제는 광고 노출로 검증하면 안 된다. 파일 자체가 200 + text/plain + 올바른 본문인지를 직접 확인하고, 그다음은 기다리는 게 맞다. 노출을 기준으로 삼으면 며칠 지연된 신호를 보면서 엉뚱한 곳을 고치게 된다.',
        },
        {
          type: 'p',
          text: '서비스가 여러 개면 한 번에 전부 확인해 두는 편이 낫다. 도메인마다 배포 설정이 조금씩 다르고, 한 곳에서 멀쩡하다고 다른 곳도 멀쩡한 게 아니다.',
        },
      ],
    },
  ],
};
