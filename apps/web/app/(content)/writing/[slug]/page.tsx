import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { getPost, POSTS, type WritingBlock } from '@/lib/writing';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { title: '글을 찾을 수 없습니다' };

  const url = `${SITE_URL}/writing/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-');
  return `${year}. ${month}. ${day}`;
}

function Block({ block }: { block: WritingBlock }) {
  if (block.type === 'p') {
    return <p className="leading-relaxed text-white/70">{block.text}</p>;
  }

  if (block.type === 'list') {
    return (
      <ul className="list-disc space-y-2 pl-6 text-white/70">
        {block.items.map((item) => (
          <li key={item} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'code') {
    return (
      <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-relaxed text-white/75">
        <code>{block.code}</code>
      </pre>
    );
  }

  // note — 본문 흐름에서 한 번 멈추고 짚는 내용
  return (
    <aside className="rounded-2xl border-l-2 border-white/30 bg-white/[0.03] py-4 pr-5 pl-5">
      <p className="leading-relaxed text-white/70">{block.text}</p>
    </aside>
  );
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const others = POSTS.filter((item) => item.slug !== post.slug);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'ko-KR',
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/writing/${post.slug}`,
  };

  return (
    <article>
      <p className="font-mono text-xs text-white/35">{formatDate(post.date)}</p>

      <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
        {post.title}
      </h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-white/45"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-8 text-lg leading-relaxed text-white/80">{post.lead}</p>

      {post.sections.map((section) => (
        <section key={section.heading} className="mt-14">
          <h2 className="text-2xl font-bold text-white">{section.heading}</h2>
          <div className="mt-4 space-y-4">
            {section.blocks.map((block, index) => (
              <Block key={`${section.heading}-${index}`} block={block} />
            ))}
          </div>
        </section>
      ))}

      {others.length > 0 && (
        <section className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white">다른 글</h2>
          <ul className="mt-5 space-y-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/writing/${item.slug}`}
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
                >
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    {item.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Script
        id={`article-schema-${post.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </article>
  );
}
