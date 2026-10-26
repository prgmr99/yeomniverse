import type { Metadata } from 'next';
import {
  CONTACT_EMAIL,
  POLICY_EFFECTIVE_DATE,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site';

const title = '개인정보처리방침';
const description =
  'Yeomniverse의 개인정보처리방침입니다. 수집하는 정보, Google AdSense와 분석 도구의 쿠키 사용, 쿠키 거부 방법, 문의 경로를 안내합니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/privacy`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function PrivacyPage() {
  return (
    <article className="[&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:leading-relaxed [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-white/70">
      <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
        개인정보처리방침
      </h1>
      <p className="mt-4 text-sm text-white/45">
        시행일: {POLICY_EFFECTIVE_DATE}
      </p>

      <p>
        Yeomniverse(이하 &quot;본 사이트&quot;)는 이용자의 개인정보를 중요하게
        생각하며, 수집을 최소화하는 것을 원칙으로 합니다. 본 방침은
        yeomniverse.com에서 제공하는 서비스에 적용됩니다.
      </p>

      <h2>1. 수집하는 정보</h2>
      <p>
        본 사이트는 회원가입 절차가 없으며, 이름·연락처·주소와 같은 개인을
        식별할 수 있는 정보를 직접 입력받거나 서버에 저장하지 않습니다.
      </p>
      <p>
        다만 웹사이트 운영과 광고 게재를 위해 아래 정보가 자동으로 생성되어
        수집될 수 있습니다.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-white/70">
        <li>접속 기록, 방문 일시, 방문 페이지</li>
        <li>브라우저 종류와 버전, 운영체제, 화면 해상도</li>
        <li>IP 주소에서 추정된 대략적인 지역 정보</li>
        <li>유입 경로(어떤 링크를 통해 들어왔는지)</li>
      </ul>
      <p>
        이 정보는 개별 이용자를 식별하는 목적으로 사용되지 않으며, 통계와 광고
        게재를 위해 집계된 형태로 처리됩니다.
      </p>

      <h2>2. 쿠키의 사용</h2>
      <p>
        본 사이트는 쿠키(cookie)를 사용합니다. 쿠키는 웹사이트가 이용자의
        브라우저에 저장하는 작은 텍스트 파일로, 방문 기록과 설정을 기억하는 데
        쓰입니다.
      </p>
      <p>
        이용자는 쿠키 저장을 거부할 수 있습니다. 브라우저의 설정에서 쿠키를
        차단하거나 이미 저장된 쿠키를 삭제할 수 있으며, 이 경우 광고가 맞춤형이
        아닌 일반 광고로 표시될 수 있습니다. 본 사이트의 기능 자체는 쿠키를
        차단해도 정상적으로 이용할 수 있습니다.
      </p>

      <h2>3. 광고 서비스 (Google AdSense)</h2>
      <p>
        본 사이트는 Google AdSense를 통해 광고를 게재합니다. 이와 관련하여 다음
        사항을 안내합니다.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-white/70">
        <li>
          Google을 포함한 제3자 광고 공급업체는 쿠키를 사용하여 이용자의 이
          사이트 또는 다른 사이트 방문 기록을 바탕으로 광고를 게재합니다.
        </li>
        <li>
          Google은 광고 쿠키를 사용함으로써 이용자에게 맞춤형 광고를 제공할 수
          있습니다.
        </li>
        <li>
          이용자는{' '}
          <a
            href="https://www.google.com/settings/ads"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google 광고 설정
          </a>
          에서 맞춤 광고를 사용 중지할 수 있습니다.
        </li>
        <li>
          제3자 광고 공급업체의 쿠키 사용은{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google의 광고 및 쿠키 정책
          </a>
          을 따릅니다.
        </li>
      </ul>

      <h2>4. 분석 도구</h2>
      <p>
        본 사이트는 방문 통계를 확인하기 위해 Google Analytics와 Vercel
        Analytics를 사용합니다. 두 도구 모두 어떤 페이지가 얼마나 조회되는지를
        집계된 형태로 보여주며, 개별 이용자의 신원을 확인하는 데 사용하지
        않습니다.
      </p>
      <p>
        Google Analytics의 데이터 수집을 원하지 않는 경우{' '}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          rel="noopener noreferrer"
          target="_blank"
        >
          Google Analytics 차단 브라우저 부가기능
        </a>
        을 설치하여 거부할 수 있습니다.
      </p>

      <h2>5. 하위 서비스의 개인정보 처리</h2>
      <p>
        Yeomniverse에서 소개하는 각 서비스는 별도의 도메인 또는 하위 도메인에서
        독립적으로 운영됩니다. 서비스에 따라 수집하는 정보와 처리 방식이 다를 수
        있으며, 해당 서비스를 이용할 때는 그 서비스의 개인정보처리방침이 함께
        적용됩니다.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-white/70">
        <li>
          <a
            href="https://hyodo-tier.yeomniverse.com/privacy"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            효도티어 개인정보처리방침
          </a>{' '}
          — 테스트 응답을 서버에 저장하지 않습니다.
        </li>
        <li>
          <a
            href="https://finbrief.yeomniverse.com/privacy"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            FinBrief 개인정보처리방침
          </a>{' '}
          — 브리핑 발송을 위해 구독 정보를 처리합니다.
        </li>
      </ul>

      <h2>6. 개인정보의 제3자 제공</h2>
      <p>
        본 사이트는 이용자의 개인정보를 제3자에게 판매하거나 대여하지 않습니다.
        위에 명시한 광고 및 분석 서비스 제공업체를 통한 처리를 제외하고, 별도의
        제3자 제공은 이루어지지 않습니다.
      </p>

      <h2>7. 만 14세 미만 아동</h2>
      <p>
        본 사이트는 만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를
        의도적으로 수집하지 않습니다.
      </p>

      <h2>8. 이용자의 권리</h2>
      <p>
        이용자는 본 사이트에서 처리되는 자신의 정보에 대해 열람, 정정, 삭제,
        처리 정지를 요구할 수 있습니다. 아래 문의처로 연락하시면 확인 후
        조치합니다.
      </p>

      <h2>9. 문의처</h2>
      <p>개인정보 처리에 관한 문의나 요청은 아래로 보내주시기 바랍니다.</p>
      <p>
        이메일:{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
        >
          {CONTACT_EMAIL}
        </a>
      </p>

      <h2>10. 방침의 변경</h2>
      <p>
        본 방침의 내용이 변경되는 경우 이 페이지를 통해 공지하며, 상단의
        시행일을 함께 갱신합니다.
      </p>
    </article>
  );
}
