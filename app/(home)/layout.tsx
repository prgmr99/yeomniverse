import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  alternates: {
    canonical: process.env.NEXT_PUBLIC_DOMAIN_URL,
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // FAQ Schema for better SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '결과는 어떤 기준으로 산출되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '총 14개의 문항을 통해 사용자의 답변 패턴을 분석합니다. 단순히 연락 빈도뿐만 아니라, 부모님의 취향을 얼마나 파악하고 있는지, 감정적인 교류는 어떠한지 등을 입체적으로 평가하여 알고리즘이 등급을 매깁니다.',
        },
      },
      {
        '@type': 'Question',
        name: '정말 1등급이 존재하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "네, 존재합니다. '전설의 유니콘 효자' 유형은 상위 1%에 해당하는 완벽한 밸런스를 가진 사용자에게만 부여됩니다. 하지만 등급보다 중요한 것은 이 테스트를 계기로 부모님께 전화 한 통 더 드리는 마음입니다.",
        },
      },
      {
        '@type': 'Question',
        name: '개인정보는 저장되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '아니요, 효도티어는 별도의 회원가입 없이 이용 가능하며, 입력하신 모든 답변 데이터는 결과 산출 후 즉시 휘발됩니다. 안심하고 테스트를 즐겨보세요.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
