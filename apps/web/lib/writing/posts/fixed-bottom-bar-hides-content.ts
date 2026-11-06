import type { Post } from '../types';

export const post: Post = {
  slug: 'fixed-bottom-bar-hides-content',
  title: '화면 아래 고정한 버튼이 본문 끝을 먹고 있었다',
  description:
    'position: fixed로 깐 하단 버튼은 문서 흐름에서 빠지기 때문에 본문 마지막을 덮는다. 스페이서가 왜 필요한지, flex 가운데 정렬과 min-height를 쓸 때 무엇을 확인해야 하는지, 그리고 이걸 눈이 아니라 숫자로 검증하는 방법을 적었습니다.',
  date: '2026-11-06',
  tags: ['CSS', '레이아웃', '모바일'],
  lead: '모바일에서 시작 버튼을 항상 보이게 하려고 화면 아래에 고정해 두었다. 나중에 그 위에 설명 섹션을 추가했는데, 마지막 문단이 사라졌다. 정확히는 사라진 게 아니라 버튼 뒤에 깔려 있었다.',
  sections: [
    {
      heading: 'fixed는 자리를 차지하지 않는다',
      blocks: [
        {
          type: 'p',
          text: 'position: fixed를 주면 그 요소는 문서 흐름에서 빠진다. 뷰포트 기준으로 자리를 잡고, 원래 있던 공간은 없던 일이 된다.',
        },
        {
          type: 'p',
          text: '그래서 본문을 끝까지 스크롤하면 마지막 부분이 그 요소 밑에 들어간다. 스크롤은 문서 높이까지만 되는데, 고정된 요소는 그 위에 겹쳐 있으니 더 내릴 방법이 없다.',
        },
        {
          type: 'p',
          text: '해결은 간단하다. 고정 요소 높이만큼 빈 공간을 문서 끝에 넣어 준다.',
        },
        {
          type: 'code',
          code: `<div className="splash-content">
  …본문…
  <section className="splash-about">…</section>
  <div className="splash-actions-spacer" />   {/* 고정 바 높이만큼 */}
</div>

<div className="splash-fixed-bottom">
  <button>시작하기</button>
</div>`,
        },
        {
          type: 'p',
          text: '이미 이 스페이서가 있었다. 그런데 설명 섹션을 스페이서 *뒤에* 넣는 바람에 무용지물이 됐다. 스페이서는 항상 문서의 마지막이어야 한다.',
        },
        {
          type: 'note',
          text: '스페이서가 있는 코드를 보면 "왜 빈 div가 있지" 싶어서 지우거나 위치를 옮기고 싶어진다. 그래서 역할을 적어 두는 게 좋다. 이름만으로는 다음 사람이 알아보기 어렵다.',
        },
      ],
    },
    {
      heading: 'flex 가운데 정렬 안에 긴 내용을 넣을 때',
      blocks: [
        {
          type: 'p',
          text: '같은 작업에서 한 번 더 걸렸다. 카드를 화면 가운데 놓으려고 이렇게 되어 있었다.',
        },
        {
          type: 'code',
          code: `.overlay {
  display: flex;
  align-items: center;
  min-height: 100vh;
}`,
        },
        {
          type: 'p',
          text: 'align-items: center와 높이 고정을 같이 쓰면 유명한 문제가 생긴다. 내용이 컨테이너보다 길어졌을 때 위아래로 똑같이 넘치는데, 위쪽으로 넘친 부분은 스크롤로 닿을 수가 없다. 잘린다.',
        },
        {
          type: 'p',
          text: '그런데 여기서는 안 잘렸다. height가 아니라 min-height였기 때문이다. 내용이 길어지면 컨테이너가 같이 늘어나므로 넘칠 일이 없고, 페이지 자체가 스크롤된다.',
        },
        {
          type: 'p',
          text: '둘의 차이가 한 글자인데 동작이 완전히 다르다. 긴 내용을 넣기 전에 이 구분을 확인해야 하고, height라면 자식에 margin: auto를 주는 방식으로 바꾸는 게 안전하다. 자동 마진은 공간이 남을 때만 가운데로 밀고, 모자라면 밀지 않는다.',
        },
      ],
    },
    {
      heading: '눈으로 보지 말고 재야 한다',
      blocks: [
        {
          type: 'p',
          text: '"가려지나?"는 스크린샷으로 판단하기 어렵다. 기기 높이에 따라 다르고, 아슬아슬하게 걸쳐 있으면 괜찮아 보인다.',
        },
        {
          type: 'p',
          text: '그래서 숫자를 뽑았다.',
        },
        {
          type: 'code',
          code: `scrollTo(0, document.documentElement.scrollHeight);

const last = document.querySelector('.route-about-links').getBoundingClientRect();
const bar  = document.querySelector('.splash-fixed-bottom').getBoundingClientRect();

({ clearance: Math.round(bar.top - last.bottom),
   hidden:    last.bottom > bar.top })`,
        },
        {
          type: 'p',
          text: '끝까지 스크롤한 상태에서 마지막 요소의 아래쪽과 고정 바의 위쪽 사이 거리를 잰다. 음수면 가려진 것이고, 양수면 그만큼 여유가 있는 것이다. 40px이 나왔고 hidden은 false였다.',
        },
        {
          type: 'p',
          text: '같이 확인하면 좋은 것이 가로 넘침이다. 긴 코드 블록이나 줄바꿈이 안 되는 문자열을 넣으면 좁은 화면에서 가로 스크롤이 생긴다.',
        },
        {
          type: 'code',
          code: `document.documentElement.scrollWidth > innerWidth   // false여야 한다`,
        },
        {
          type: 'note',
          text: '레이아웃 검증은 "보이는가"가 아니라 "닿을 수 있는가"를 봐야 한다. 둘은 다르고, 가려진 콘텐츠는 보이지 않으니 스크린샷에도 안 남는다.',
        },
      ],
    },
  ],
};
