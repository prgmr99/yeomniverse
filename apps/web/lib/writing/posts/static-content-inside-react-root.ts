import type { Post } from '../types';

export const post: Post = {
  slug: 'static-content-inside-react-root',
  title: 'SSR 없이 SPA에 크롤러가 읽을 본문을 넣는 법',
  description:
    'createRoot는 컨테이너의 자식을 교체하고 hydrateRoot는 불일치로 깨진다. 이 차이를 이용해 빌드 결과물의 root div에 본문을 심었습니다. 문구를 한 곳에서만 관리해야 하는 이유도 함께 적었습니다.',
  date: '2026-11-06',
  tags: ['React', 'SPA', 'SEO', '빌드'],
  lead: '서버 렌더링을 도입하지 않고도 크롤러에게 본문을 보여줄 방법이 필요했다. 결론부터 말하면 빌드된 index.html의 root div 안에 HTML을 넣으면 된다. 되는 이유는 React가 마운트할 때 그 안을 어떻게 처리하는지에 달려 있다.',
  sections: [
    {
      heading: 'createRoot와 hydrateRoot는 다르게 움직인다',
      blocks: [
        {
          type: 'p',
          text: 'React 18 이후로 마운트 진입점이 둘이다. 이름이 비슷해서 헷갈리지만 기존 DOM을 대하는 태도가 정반대다.',
        },
        {
          type: 'code',
          code: `createRoot(el).render(<App />)   // el의 자식을 지우고 새로 그린다
hydrateRoot(el, <App />)        // el의 자식이 서버 출력과 같다고 전제한다`,
        },
        {
          type: 'p',
          text: 'hydrateRoot는 서버에서 렌더한 결과를 이어받는 용도다. 그래서 기존 DOM을 재사용하려 하고, 모양이 다르면 불일치 경고를 내거나 통째로 다시 그린다. 여기에 임의의 HTML을 심어 두면 깨진다.',
        },
        {
          type: 'p',
          text: 'createRoot는 그런 전제가 없다. 첫 렌더에서 컨테이너를 비우고 자기 트리를 넣는다. 그래서 그 안에 뭐가 있었든 상관없이 사라진다.',
        },
        {
          type: 'p',
          text: '서버 렌더링이 없는 Vite SPA는 대개 createRoot를 쓴다. 그 경우에만 이 기법이 성립한다. 손대기 전에 진입점을 확인해야 한다.',
        },
      ],
    },
    {
      heading: '빌드 뒤에 끼워 넣는다',
      blocks: [
        {
          type: 'p',
          text: '소스의 index.html에 본문을 적어 두는 방법도 있지만, 라우트마다 다른 내용을 넣으려면 그걸로는 부족하다. 빌드 산출물을 복사해서 라우트별로 한 벌씩 만드는 쪽이 낫다.',
        },
        {
          type: 'code',
          code: `const index = readFileSync('dist/index.html', 'utf8');

for (const [name, route] of Object.entries(routes)) {
  let html = index;
  html = html.replace(/<title>[\\s\\S]*?<\\/title>/, \`<title>\${route.title}</title>\`);
  html = html.replace(/<div id="root"><\\/div>/, \`<div id="root">\${body(route)}</div>\`);
  writeFileSync(\`dist/\${name}.html\`, html);
}`,
        },
        {
          type: 'p',
          text: '치환이 실패해도 조용히 넘어가지 않게 하는 게 중요하다. 정규식이 안 맞으면 replace는 아무 일도 안 하고 원본을 그대로 돌려준다. 빌드는 성공하고 결과물만 틀린다. 그래서 각 치환마다 패턴이 실제로 매치했는지 확인하고, 아니면 빌드를 중단시키게 했다.',
        },
        {
          type: 'note',
          text: '빌드 도구가 HTML을 압축하면 태그 모양이 달라져 패턴이 어긋날 수 있다. "구조가 바뀌었는지 확인할 것"이라는 메시지와 함께 터지게 해 두면, 몇 달 뒤 도구를 올렸을 때 조용히 망가지는 대신 바로 알게 된다.',
        },
      ],
    },
    {
      heading: '문구를 두 군데 적으면 클로킹이 된다',
      blocks: [
        {
          type: 'p',
          text: '여기서 제일 조심해야 할 부분이다. 크롤러가 보는 정적 본문과 사용자가 보는 화면이 다른 내용이면 그건 클로킹이다. 검색엔진이 제재하는 행위고, 의도가 없었다고 봐주지 않는다.',
        },
        {
          type: 'p',
          text: '처음 설계할 때 가장 쉬운 길은 두 군데에 적는 것이다. 빌드 스크립트에 문자열로 한 벌, React 컴포넌트에 또 한 벌. 당장은 같은 내용이니 문제없어 보인다.',
        },
        {
          type: 'p',
          text: '그런데 시간이 지나면 반드시 갈라진다. 설명을 고칠 일이 생겼을 때 둘 중 하나만 고치게 되고, 그 순간부터 클로킹이다. 고친 사람은 자기가 그런 짓을 했다는 걸 모른다.',
        },
        {
          type: 'p',
          text: '그래서 문구를 JSON 한 곳에 두고 양쪽이 그걸 읽게 했다.',
        },
        {
          type: 'code',
          code: `src/content/routeAbout.json   ← 문구는 여기에만
        ├─ RouteAbout.tsx          (화면)
        └─ prerender-routes.mjs    (정적 HTML)`,
        },
        {
          type: 'p',
          text: 'TypeScript는 resolveJsonModule이 켜져 있으면 JSON을 그냥 import할 수 있고, 빌드 스크립트는 fs로 같은 파일을 읽으면 된다. 추가 도구가 필요 없다. 구조적으로 어긋날 수 없게 만드는 게 규칙으로 지키는 것보다 낫다.',
        },
      ],
    },
    {
      heading: '확인한 것들',
      blocks: [
        {
          type: 'p',
          text: '브라우저에서 실제로 교체되는지 봤다.',
        },
        {
          type: 'code',
          code: `// 마운트 후
document.getElementById('root').children.length  // 0 → React 트리로 교체됨
document.querySelectorAll('.route-about').length // 정적 블록 사라짐`,
        },
        {
          type: 'p',
          text: '정적 블록이 남아 있으면 같은 내용이 두 번 보이게 되니 반드시 확인해야 한다.',
        },
        {
          type: 'p',
          text: '한 가지 더 걸린 게 있었다. 생성한 /flash.html 같은 파일이 주소로 직접 열린다. 그런데 라우터에는 .html 경로가 없으니 React가 아무것도 그리지 않고 빈 화면이 된다. 배포 설정에서 .html 주소를 정식 주소로 리다이렉트해 막았다. 리다이렉트는 파일시스템 조회보다 먼저 평가되므로 파일이 있어도 가로챌 수 있다.',
        },
        {
          type: 'note',
          text: '사용자에게는 React가 마운트되기 전 잠깐 정적 본문이 보인다. 숨기고 싶어지지만 그러면 안 된다. 크롤러에게만 보이고 사용자에게는 숨긴 텍스트야말로 검색엔진이 가장 싫어하는 형태다. 그냥 읽을 만한 모양으로 스타일을 맞춰 두는 게 맞다.',
        },
      ],
    },
  ],
};
