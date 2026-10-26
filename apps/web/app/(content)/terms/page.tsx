import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CONTACT_EMAIL,
  POLICY_EFFECTIVE_DATE,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site';

const title = '이용약관';
const description =
  'Yeomniverse 이용약관입니다. 서비스 제공 범위, 이용자의 책임, 면책 조항, 지적재산권, 약관 변경에 관한 사항을 안내합니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/terms`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function TermsPage() {
  return (
    <article className="[&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:leading-relaxed [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-white/70">
      <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
        이용약관
      </h1>
      <p className="mt-4 text-sm text-white/45">
        시행일: {POLICY_EFFECTIVE_DATE}
      </p>

      <h2>1. 목적</h2>
      <p>
        본 약관은 Yeomniverse(이하 &quot;본 사이트&quot;)가 제공하는 서비스의
        이용 조건과 절차, 이용자와 운영자의 권리·의무를 정하는 것을 목적으로
        합니다.
      </p>

      <h2>2. 서비스의 성격</h2>
      <p>
        본 사이트는 개인이 제작·운영하는 웹 서비스 모음입니다. 각 서비스는
        무료로 제공되며, 회원가입 없이 이용할 수 있는 것을 기본으로 합니다.
      </p>
      <p>
        본 사이트에서 제공하는 심리테스트, 시뮬레이터, 정보 요약 등은 참고와
        오락을 목적으로 합니다. 전문적인 상담, 진단, 자문을 대체하지 않습니다.
      </p>

      <h2>3. 투자 관련 정보에 대한 고지</h2>
      <p>
        FinBrief의 뉴스 요약과 지표, NeuroTrade의 시뮬레이션 결과, Argus의 정세
        정보를 포함한 본 사이트의 모든 금융·시장 관련 정보는 참고 자료이며 투자
        자문이나 투자 권유가 아닙니다.
      </p>
      <p>
        본 사이트는 금융투자업자가 아니며, 특정 종목의 매수·매도를 추천하지
        않습니다. 제공된 정보에 근거한 투자 판단과 그 결과에 대한 책임은 이용자
        본인에게 있습니다.
      </p>

      <h2>4. 이용자의 책임</h2>
      <p>이용자는 본 사이트를 이용하면서 다음 행위를 하지 않아야 합니다.</p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-white/70">
        <li>
          서비스의 정상적인 운영을 방해하는 행위(과도한 자동화 요청, 비정상적인
          트래픽 발생 등)
        </li>
        <li>서비스의 취약점을 악용하거나 무단으로 접근을 시도하는 행위</li>
        <li>타인의 권리를 침해하거나 법령을 위반하는 목적으로 이용하는 행위</li>
        <li>
          운영자의 허락 없이 서비스의 콘텐츠를 상업적 목적으로 복제·배포하는
          행위
        </li>
      </ul>

      <h2>5. 서비스의 변경과 중단</h2>
      <p>
        본 사이트는 개인이 운영하는 서비스로서, 운영자의 판단에 따라 서비스의
        내용을 변경하거나 제공을 중단할 수 있습니다. 중단이 예정된 경우 가능한
        범위에서 사전에 안내합니다.
      </p>
      <p>
        또한 서버 점검, 외부 서비스 장애, 천재지변 등 운영자의 통제를 벗어난
        사유로 서비스가 일시적으로 중단될 수 있습니다.
      </p>

      <h2>6. 면책</h2>
      <p>
        본 사이트는 제공되는 정보의 정확성과 완전성을 보장하지 않습니다. 특히
        외부 출처에서 수집한 뉴스와 지표는 원 출처의 오류나 지연을 그대로 반영할
        수 있습니다.
      </p>
      <p>
        무료로 제공되는 서비스의 이용 또는 이용 불가로 인해 발생한 손해에 대해,
        운영자의 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.
      </p>

      <h2>7. 외부 링크</h2>
      <p>
        본 사이트는 외부 사이트로 연결되는 링크와 제3자 광고를 포함합니다. 외부
        사이트의 콘텐츠와 운영에 대해서는 책임을 지지 않으며, 해당 사이트의
        약관과 정책이 적용됩니다.
      </p>

      <h2>8. 지적재산권</h2>
      <p>
        본 사이트에 게시된 텍스트, 이미지, 디자인, 코드에 대한 권리는 운영자에게
        있습니다. 출처를 밝힌 인용을 넘어서는 복제·배포·2차 가공은 사전 동의가
        필요합니다.
      </p>

      <h2>9. 개인정보</h2>
      <p>
        개인정보의 처리에 관한 사항은{' '}
        <Link
          href="/privacy"
          className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
        >
          개인정보처리방침
        </Link>
        에 따릅니다.
      </p>

      <h2>10. 약관의 변경</h2>
      <p>
        본 약관이 변경되는 경우 이 페이지를 통해 공지하며, 상단의 시행일을
        갱신합니다. 변경 이후에도 서비스를 계속 이용하는 경우 변경된 약관에
        동의한 것으로 봅니다.
      </p>

      <h2>11. 문의</h2>
      <p>
        본 약관에 관한 문의는{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
        >
          {CONTACT_EMAIL}
        </a>
        로 보내주시기 바랍니다.
      </p>
    </article>
  );
}
