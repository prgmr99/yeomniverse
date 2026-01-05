import { Calendar, ChevronRight, Clock, Home } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getBlogPost, getBlogPosts } from '@/lib/blogData';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
    dateModified: post.date,
    image: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/og-image.png`,
    publisher: {
      '@type': 'Organization',
      name: '효도티어',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/icon-512.png`,
      },
    },
    keywords: post.keywords.join(', '),
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: process.env.NEXT_PUBLIC_DOMAIN_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '블로그',
        item: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <main className="min-h-screen bg-paper p-6 pb-20 animate-fade-in">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-ink/60 flex items-center gap-2">
          <Link href="/" className="hover:text-grading transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-grading transition-colors">
            블로그
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ink font-medium truncate">{post.title}</span>
        </nav>

        {/* Article Header */}
        <article className="bg-white rounded-xl border border-ink/10 shadow-sm p-6 mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-stone-100 text-ink/60 px-3 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-ink mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-ink/50 mb-6 pb-6 border-b border-ink/10">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
            <span>by {post.author}</span>
          </div>

          {/* Content */}
          <div
            className="prose prose-stone max-w-none
              prose-headings:font-bold prose-headings:text-ink
              prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:border-b prose-h2:border-ink/10 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
              prose-p:text-ink/80 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-ink prose-strong:font-bold
              prose-ul:my-4 prose-li:text-ink/80 prose-li:mb-2
              prose-a:text-grading prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-grading prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-ink/60
            "
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, '<br>'),
            }}
          />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-ink mb-4">관련 글</h2>
            <div className="grid gap-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="block bg-white p-4 rounded-lg border border-ink/10 hover:border-grading hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-ink mb-1 group-hover:text-grading">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-ink/60 line-clamp-2">
                    {relatedPost.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-xl text-center border border-ink/10">
          <h3 className="text-2xl font-bold text-ink mb-3">
            나의 효도 등급은?
          </h3>
          <p className="text-sm text-ink/70 mb-6">
            효도티어 테스트로 당신의 효도 스타일을 확인하고
            <br />
            맞춤 조언을 받아보세요!
          </p>
          <Link
            href="/"
            className="inline-block bg-grading text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-all text-lg"
          >
            효도티어 테스트 시작하기 →
          </Link>
        </div>
      </main>

      <Script
        id="article-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
