import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '효도티어 개인정보처리방침',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="w-full max-w-[480px] mx-auto min-h-screen p-6 font-sans text-sm leading-relaxed text-stone-800">
      <h1 className="text-2xl font-serif font-bold mb-8 pb-4 border-b-2 border-stone-800">
        개인정보처리방침
      </h1>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">1. 개인정보의 처리 목적</h2>
        <p className="mb-2 text-stone-600">
          &apos;효도티어&apos;(이하 &apos;서비스&apos;)는 다음의 목적을 위하여
          개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의
          용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보
          보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할
          예정입니다.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-stone-600">
          <li>서비스 제공 및 콘텐츠 이용</li>
          <li>접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계</li>
          <li>구글 애드센스 광고 게재</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">
          2. 개인정보의 처리 및 보유 기간
        </h2>
        <p className="text-stone-600">
          본 서비스는 별도의 회원가입 없이 이용 가능하며, 이용자의 개인정보를
          서버에 저장하지 않습니다. 단, 서비스 이용 과정에서 쿠키(Cookie) 등
          자동 생성 정보가 수집될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">
          3. 쿠키(Cookie)의 운용 및 거부
        </h2>
        <p className="mb-2 text-stone-600">
          본 서비스는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를
          저장하고 수시로 불러오는 &apos;쿠키(cookie)&apos;를 사용합니다.
        </p>
        <p className="mb-2 text-stone-600">
          쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터
          브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의
          하드디스크에 저장되기도 합니다.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-stone-600">
          <li>
            <strong>쿠키의 사용 목적:</strong> 이용자가 방문한 각 서비스와 웹
            사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을
            파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
          </li>
          <li>
            <strong>쿠키의 설치·운영 및 거부:</strong> 웹브라우저 상단의 도구
            &gt; 인터넷 옵션 &gt; 개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을
            거부할 수 있습니다.
          </li>
          <li>
            쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수
            있습니다.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">4. 광고 서비스 이용</h2>
        <p className="text-stone-600">
          본 서비스는 Google AdSense를 통해 광고를 게재합니다. Google은 쿠키를
          사용하여 사용자가 본 서비스나 다른 웹사이트를 방문한 기록을 바탕으로
          광고를 제공할 수 있습니다. 사용자는 Google 광고 설정에서 맞춤형 광고를
          해제할 수 있습니다.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold mb-3">5. 문의처</h2>
        <p className="text-stone-600">
          서비스 이용과 관련하여 궁금한 사항이 있으시면 아래의 연락처로 문의
          주시기 바랍니다.
        </p>
        <p className="mt-2 font-bold">이메일: contact@hyo-tier.com</p>
      </section>
    </main>
  );
}
