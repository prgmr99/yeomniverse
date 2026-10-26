import { Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { CONTACT_EMAIL, GITHUB_URL, SITE_NAME, SITE_URL } from '@/lib/site';

const title = '문의';
const description =
  'Yeomniverse 문의 안내입니다. 버그 신고, 기능 제안, 서비스 관련 질문을 받는 경로와 답변까지 걸리는 시간을 안내합니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function ContactPage() {
  return (
    <article>
      <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
        문의
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-white/80">
        버그를 발견했거나, 고쳤으면 하는 점이 있거나, 만들었으면 하는 도구가
        떠올랐다면 메일로 보내주세요. 전부 직접 읽습니다.
      </p>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-5 transition hover:border-white/30 hover:bg-white/[0.08]"
      >
        <Mail className="h-5 w-5 text-white/60" aria-hidden="true" />
        <span>
          <span className="block text-xs uppercase tracking-[0.2em] text-white/40">
            이메일
          </span>
          <span className="block font-semibold text-white">
            {CONTACT_EMAIL}
          </span>
        </span>
      </a>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">
          이렇게 보내주면 빠릅니다
        </h2>
        <p className="mt-4 leading-relaxed text-white/70">
          특히 버그 신고는 아래 정보가 있으면 재현해 보는 단계를 건너뛸 수
          있어서 훨씬 빨리 고칩니다.
        </p>
        <ul className="mt-6 space-y-3 text-white/70">
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed">
            <strong className="text-white">어떤 서비스인지</strong> — 효도티어,
            FinBrief, NeuroTrade, Argus 중 어느 것인지
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed">
            <strong className="text-white">무엇을 하다가 생겼는지</strong> —
            눌렀던 버튼이나 밟은 순서
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed">
            <strong className="text-white">환경</strong> — 휴대폰인지
            데스크톱인지, 브라우저 종류
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed">
            <strong className="text-white">화면 캡처</strong> — 있으면 가장
            확실합니다
          </li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">답변까지 걸리는 시간</h2>
        <p className="mt-4 leading-relaxed text-white/70">
          개인이 운영하는 사이트라 상시 응대는 어렵습니다. 보통 며칠 안에
          확인하며, 내용에 따라 더 걸릴 수 있습니다. 서비스가 멈춰 있는 것처럼
          보이는 장애는 우선해서 봅니다.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">그 밖의 경로</h2>
        <p className="mt-4 leading-relaxed text-white/70">
          코드나 기술적인 내용에 관한 이야기는 GitHub에서도 가능합니다.{' '}
          <a
            href={GITHUB_URL}
            className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            github.com/prgmr99
          </a>
        </p>
        <p className="mt-4 leading-relaxed text-white/70">
          개인정보 처리에 관한 요청도 같은 메일로 받습니다. 처리 기준은
          개인정보처리방침에 적어두었습니다.
        </p>
      </section>
    </article>
  );
}
