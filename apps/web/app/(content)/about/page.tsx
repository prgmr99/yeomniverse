import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES } from '@/lib/services';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

const title = 'Yeomniverse 소개';
const description =
  'Yeomniverse는 개인이 만든 작은 웹 도구를 모아두는 사이트입니다. 어떤 서비스를 운영하는지, 어떤 기준으로 만들고 어떤 리듬으로 늘려가는지 정리했습니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function AboutPage() {
  return (
    <article>
      <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
        소개
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-white/80">
        Yeomniverse는 개인이 만든 작은 웹 도구를 모아두는 사이트입니다. 회사
        제품도, 팀 프로젝트도 아닙니다. 직접 쓰고 싶어서 만든 것들을 한 곳에
        두고 조금씩 고쳐가는 공간입니다.
      </p>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">왜 만들었나</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-white/70">
          <p>
            개발을 하면서 생기는 아이디어는 대부분 머릿속에서 끝납니다. 시작은
            쉽지만, 끝까지 만들어 사람들이 실제로 쓰게 하는 일은 전혀 다른
            문제입니다. Yeomniverse는 그 간격을 좁히기 위해 만든 장치입니다.
            완성한 것을 올려둘 곳이 있으면 완성할 이유가 생깁니다.
          </p>
          <p>
            그래서 이 사이트에 올라가는 기준은 하나입니다. 실제로 동작하고,
            누군가 지금 바로 쓸 수 있는 상태여야 합니다. 아이디어 단계이거나
            데모만 있는 것은 올리지 않습니다.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">만들 때 지키는 것</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-white/70">
          <p>
            <strong className="text-white">가입 없이 쓸 수 있게 한다.</strong>{' '}
            대부분의 도구는 회원가입 없이 바로 쓸 수 있습니다. 로그인이 필요한
            기능은 그 기능이 로그인 없이는 성립하지 않을 때만 둡니다. 한 번
            써보려는 사람에게 계정부터 만들라고 하는 것은 대개 만드는 사람의
            편의입니다.
          </p>
          <p>
            <strong className="text-white">
              필요 없는 데이터는 받지 않는다.
            </strong>{' '}
            효도티어처럼 응답을 받는 도구도 그 응답을 서버에 저장하지 않습니다.
            브라우저 안에서 계산하고 끝낼 수 있으면 그렇게 합니다. 수집하지 않은
            데이터는 유출될 일도 없습니다.
          </p>
          <p>
            <strong className="text-white">모바일에서 먼저 확인한다.</strong>{' '}
            대부분의 방문은 휴대폰에서 일어납니다. 데스크톱에서 멀쩡해 보이는
            화면이 휴대폰에서 무너지는 일이 잦아서, 작은 화면을 기준으로 먼저
            만듭니다.
          </p>
          <p>
            <strong className="text-white">하나를 제대로 한다.</strong> 도구마다
            하는 일을 하나로 좁힙니다. 기능을 덧붙이다 보면 무엇을 하는
            도구인지가 흐려지고, 그 시점부터 아무도 쓰지 않게 됩니다.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">지금 운영 중인 서비스</h2>
        <p className="mt-4 leading-relaxed text-white/70">
          각 서비스는 독립적으로 동작하고, 서로 데이터를 주고받지 않습니다.
        </p>
        <ul className="mt-6 space-y-3">
          {SERVICES.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <p className="font-semibold text-white">
                  {service.title}
                  <span className="ml-2 text-sm font-normal text-white/40">
                    {service.subtitle}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {service.tagline}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">어떤 리듬으로 늘리나</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-white/70">
          <p>
            한 달에 하나, 새 도구를 내거나 기존 도구를 의미 있게 개선하는 것을
            기준으로 두고 있습니다. 숫자 자체가 목표는 아니지만, 기준이 없으면
            만들던 것을 방치하게 되어서 리듬을 정해두었습니다.
          </p>
          <p>
            개선 쪽을 새 출시와 같은 무게로 두는 이유는, 이미 쓰는 사람이 있는
            도구를 고치는 일이 새로 만드는 일보다 가치가 큰 경우가 많기
            때문입니다.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">기술 구성</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-white/70">
          <p>
            각 서비스는 Next.js와 TypeScript로 만들어 Vercel에 배포합니다.
            효도티어와 FinBrief는 이 사이트와 같은 모노레포에서 관리하며, 공통
            UI 컴포넌트와 유틸리티를 패키지로 분리해 공유합니다. 나머지는 각자
            독립된 저장소에 있습니다.
          </p>
          <p>
            FinBrief의 일일 브리핑처럼 정해진 시각에 돌아야 하는 작업은 GitHub
            Actions의 스케줄러가 처리합니다.
          </p>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-bold text-white">연락</h2>
        <p className="mt-3 leading-relaxed text-white/70">
          버그 신고, 기능 제안, 그 밖의 문의는 메일로 받습니다.{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            {CONTACT_EMAIL}
          </a>
          로 보내주시면 확인합니다. 자세한 안내는{' '}
          <Link
            href="/contact"
            className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            문의 페이지
          </Link>
          에 있습니다.
        </p>
      </section>
    </article>
  );
}
