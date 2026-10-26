import { ArrowUpRight, Lock } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getService, SERVICES } from '@/lib/services';
import { SITE_NAME, SITE_URL } from '@/lib/site';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return { title: '서비스를 찾을 수 없습니다' };
  }

  const url = `${SITE_URL}/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const others = SERVICES.filter((item) => item.slug !== service.slug);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Yeomniverse',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: service.title,
        item: `${SITE_URL}/services/${service.slug}`,
      },
    ],
  };

  return (
    <article>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
        {service.index}
      </p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
        {service.title}
      </h1>
      <p className="mt-2 text-sm font-medium text-white/50">
        {service.subtitle}
      </p>
      <p className="mt-6 text-lg leading-relaxed text-white/80">
        {service.lead}
      </p>

      {service.access === 'public' ? (
        <div className="mt-8">
          <a
            href={service.url}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            rel="noopener noreferrer"
            target="_blank"
          >
            {service.title} 사용하기
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          {service.accessNote && (
            <p className="mt-3 text-sm text-white/45">{service.accessNote}</p>
          )}
        </div>
      ) : (
        <p className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 text-sm text-white/60">
          <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
          현재 비공개로 운영 중이라 바로 사용할 수는 없습니다. 아래는 이 도구가
          무엇을 어떻게 재는지에 대한 설명입니다.
        </p>
      )}

      {service.sections.map((section) => (
        <section key={section.heading} className="mt-14">
          <h2 className="text-2xl font-bold text-white">{section.heading}</h2>
          <div className="mt-4 space-y-4">
            {section.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="leading-relaxed text-white/70"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">주요 기능</h2>
        <dl className="mt-6 space-y-5">
          {service.features.map((feature) => (
            <div
              key={feature.term}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <dt className="font-semibold text-white">{feature.term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-white/60">
                {feature.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">사용법</h2>
        <ol className="mt-6 space-y-6">
          {service.howTo.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 font-mono text-xs text-white/60"
              >
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">자주 묻는 질문</h2>
        <div className="mt-6 space-y-6">
          {service.faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-semibold text-white">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {service.relatedLinks.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white">관련 링크</h2>
          <ul className="mt-6 space-y-3">
            {service.relatedLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group flex items-baseline gap-2 text-white/80 transition-colors hover:text-white"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="font-semibold underline decoration-white/20 underline-offset-4 group-hover:decoration-white">
                    {link.label}
                  </span>
                  <span className="text-sm text-white/45">{link.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16 border-t border-white/10 pt-10">
        <h2 className="text-lg font-bold text-white">다른 서비스</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/services/${item.slug}`}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  {item.tagline}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Script
        id={`faq-schema-${service.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id={`breadcrumb-schema-${service.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </article>
  );
}
