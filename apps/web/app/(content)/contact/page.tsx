import { Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { SERVICES } from '@/lib/services';
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
            <strong className="text-white">어떤 서비스인지</strong> —{' '}
            {SERVICES.map((service) => service.title).join(', ')} 중 어느 것인지
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
        <h2 className="text-2xl font-bold text-white">
          메일보다 빠른 창구가 있는 경우
        </h2>
        <p className="mt-4 leading-relaxed text-white/70">
          어떤 요청은 서비스 안에 전용 경로가 있고, 그쪽이 더 빠릅니다.
        </p>
        <ul className="mt-6 space-y-3 text-white/70">
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed">
            <strong className="text-white">치잡의 부적절한 리뷰</strong> —
            공개된 리뷰마다 신고 버튼이 있습니다. 어느 리뷰인지 특정된 채로
            들어오므로 메일보다 확인이 빠릅니다.
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed">
            <strong className="text-white">병원 정보가 실제와 다를 때</strong> —
            치잡의 병원 정보는 건강보험심사평가원 공공데이터를 하루 한 번 받아
            씁니다. 원본이 바뀌면 다음 날 따라오므로, 심평원 쪽이 이미
            고쳐졌다면 기다리시면 됩니다. 원본부터 틀렸다면 메일로 알려주세요.
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed">
            <strong className="text-white">개인정보 열람·삭제 요청</strong> — 각
            서비스의 개인정보처리방침에 적힌 책임자 연락처로 보내주시면 그쪽
            기준에 따라 처리합니다. 이 메일로 보내셔도 됩니다.
          </li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">인용하고 싶다면</h2>
        <p className="mt-4 leading-relaxed text-white/70">
          치잡의 전국 치과 통계는 따로 허락을 받지 않아도 인용하실 수 있습니다.
          출처를 치잡으로 표기해 주시면 됩니다. 원본 공공데이터의 권리는 제공
          기관에 있으니 그쪽 이용 조건도 함께 확인해 주세요. 다만 통계는 하루
          단위로 갱신되므로, 기준 시점을 함께 적어 두시는 편이 나중에 숫자가
          달라져도 혼선이 없습니다.
        </p>
        <p className="mt-4 leading-relaxed text-white/70">
          Argus의 정세 항목은 공개된 보도를 위치와 분류로 재배치한 것이라 1차
          출처가 아닙니다. 인용하실 때는 Argus가 아니라 원 보도를 확인하고
          그쪽을 적어주시기 바랍니다.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">답하기 어려운 것</h2>
        <p className="mt-4 leading-relaxed text-white/70">
          미리 말씀드리는 편이 서로의 시간을 아낄 것 같습니다. 여기 있는
          도구들은 투자 자문이나 법률 자문을 하지 않고, 부동산 중개나 대출
          중개도 하지 않습니다. &ldquo;이 집을 계약해도 되는지&rdquo;, &ldquo;이
          병원에 들어가도 되는지&rdquo;, &ldquo;이 종목을 사야 하는지&rdquo;
          같은 판단은 드릴 수 없습니다.
        </p>
        <p className="mt-4 leading-relaxed text-white/70">
          대신 그 판단에 필요한 근거를 어디서 확인하면 되는지는 알려드릴 수
          있습니다. 도구가 어떤 데이터를 보고 그 숫자를 냈는지, 무엇을 빼고
          계산했는지 같은 것들입니다. 그런 질문이라면 얼마든지 보내주세요.
        </p>
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
