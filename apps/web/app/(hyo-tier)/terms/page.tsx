import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
  description: '효도티어 이용약관',
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="w-full max-w-[480px] mx-auto min-h-screen p-6 font-sans text-sm leading-relaxed text-stone-800">
      <h1 className="text-2xl font-serif font-bold mb-8 pb-4 border-b-2 border-stone-800">
        이용약관
      </h1>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">제1조 (목적)</h2>
        <p className="text-stone-600">
          본 약관은 &apos;효도티어&apos;(이하 &apos;서비스&apos;)가 제공하는
          모든 서비스의 이용조건 및 절차, 이용자와 서비스의 권리, 의무,
          책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">제2조 (서비스의 제공)</h2>
        <p className="text-stone-600">
          본 서비스는 별도의 회원가입 없이 누구나 무료로 이용할 수 있는
          심리테스트 및 퀴즈 콘텐츠를 제공합니다. 서비스의 내용은 운영자의
          사정에 따라 변경되거나 중단될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">제3조 (면책조항)</h2>
        <ul className="list-disc pl-5 space-y-1 text-stone-600">
          <li>
            본 서비스에서 제공하는 결과는 재미를 위한 것이며, 과학적/의학적
            근거를 보장하지 않습니다.
          </li>
          <li>
            서비스 이용으로 인해 발생한 정신적, 물질적 손해에 대해 운영자는
            책임을 지지 않습니다.
          </li>
          <li>
            천재지변, 시스템 장애 등 불가항력적인 사유로 서비스가 중단되는 경우
            책임을 지지 않습니다.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">제4조 (저작권의 귀속)</h2>
        <p className="text-stone-600">
          서비스 내에서 제공되는 모든 콘텐츠(텍스트, 이미지, 로고 등)의 저작권은
          &apos;효도티어 위원회&apos;에 귀속됩니다. 이용자는 서비스를
          이용함으로써 얻은 정보를 운영자의 사전 승낙 없이 복제, 송신, 출판,
          배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게
          이용하게 하여서는 안 됩니다.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold mb-3">제5조 (약관의 개정)</h2>
        <p className="text-stone-600">
          운영자는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을
          개정할 수 있습니다.
        </p>
      </section>
    </main>
  );
}
