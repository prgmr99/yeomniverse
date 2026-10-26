import { ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SERVICES } from '@/lib/services';
import SiteFooter from './components/SiteFooter';
import SplineExperience from './components/SplineExperience';

// 모달 카드는 기존 동작을 유지한다 — 눌렀을 때 바로 서비스로 간다.
// 비공개 도구만 예외로, 로그인 벽 대신 소개 페이지로 보낸다.
const splineServices = SERVICES.map((service) => ({
  title: service.title,
  subtitle: service.subtitle,
  description: service.cardDescription,
  href: service.access === 'public' ? service.url : `/services/${service.slug}`,
  accent: service.accent,
  glow: service.glow,
  index: service.index,
}));

export default function YeomniverseLanding() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>

      {/* Spline 히어로: CDN 연결을 미리 열고 씬 파일을 선로드해 캔버스가
          런타임 하이드레이션 직후 바로 그려지게 한다. React 19가 이 리소스
          힌트를 <head>로 올려준다. 랜딩에만 필요하므로 여기에 둔다. */}
      <link rel="preconnect" href="https://prod.spline.design" crossOrigin="" />
      <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />
      <link
        rel="preload"
        as="fetch"
        href="https://prod.spline.design/yEWkAjJuCo873kcF/scene.splinecode"
        crossOrigin=""
      />

      <main id="main-content" className="relative min-h-screen">
        <SplineExperience services={splineServices}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0d0f17]/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />A digital
            craft universe
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] md:text-7xl lg:text-8xl">
            Yeomniverse
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-lg">
            직접 만든 작은 웹 도구를 모아두는 곳. 심리테스트부터 금융 브리핑,
            세계 정세 지도, 치과 취업 정보까지 {SERVICES.length}개의 서비스를
            운영합니다.
          </p>
        </SplineExperience>

        {/*
          고정된 Spline 캔버스(z-0) 위로 스크롤되어 올라오는 콘텐츠.
          불투명 배경 + z-20이라 스크롤하면 캔버스를 덮는다.
          서버 컴포넌트이므로 아래 텍스트는 첫 HTML에 그대로 담긴다.
        */}
        <section className="relative z-20 bg-[#0b0e17] px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Yeomniverse는 어떤 곳인가
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-white/70">
              <p>
                Yeomniverse는 개인이 만든 웹 도구를 한 곳에 모아둔 사이트입니다.
                쓰고 싶은 것이 없어서 직접 만든 것들이라, 주제가 서로 멀고
                규모도 작습니다. 부모님에 대해 얼마나 아는지 재는 심리테스트가
                있고, 아침마다 금융 뉴스를 요약해 보내주는 봇이 있고, 뉴스를
                읽고 시장을 맞혀보는 연습용 시뮬레이터와 세계 정세를 지도 한
                장에 겹쳐 보는 대시보드가 있습니다.
              </p>
              <p>
                공통점은 하나씩만 한다는 것입니다. 각 도구는 하는 일이 하나로
                좁혀져 있고, 대부분 회원가입 없이 바로 쓸 수 있습니다. 한 달에
                하나, 새로 내거나 기존 것을 고치는 리듬으로 늘려가고 있습니다.
              </p>
            </div>

            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
            >
              만들 때 지키는 기준 읽기
            </Link>
          </div>
        </section>

        <section className="relative z-20 border-t border-white/10 bg-[#0b0e17] px-6 pb-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              운영 중인 서비스
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              {SERVICES.length}개의 서비스가 각각 독립적으로 동작합니다. 서비스
              이름을 누르면 무엇을 하는 도구인지, 어떻게 쓰는지 정리한 소개
              페이지로 갑니다.
            </p>

            <ul className="mt-10 space-y-6">
              {SERVICES.map((service) => (
                <li
                  key={service.slug}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-7"
                >
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">
                      {service.index}
                    </p>
                    {service.access === 'private' && (
                      <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-medium text-white/45">
                        비공개
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-white">
                    <Link
                      href={`/services/${service.slug}`}
                      className="underline decoration-white/20 underline-offset-4 transition hover:decoration-white"
                    >
                      {service.title}
                    </Link>
                    <span className="ml-2 text-sm font-normal text-white/40">
                      {service.subtitle}
                    </span>
                  </h3>

                  <p className="mt-2 text-sm font-medium text-white/55">
                    {service.tagline}
                  </p>

                  <p className="mt-4 leading-relaxed text-white/70">
                    {service.cardDescription}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    <Link
                      href={`/services/${service.slug}`}
                      className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
                    >
                      자세히 보기
                    </Link>
                    {service.access === 'public' && (
                      <a
                        href={service.url}
                        className="inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-white"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        바로 사용하기
                        <ArrowUpRight
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
