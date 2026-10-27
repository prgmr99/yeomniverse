import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { POSTS } from '@/lib/writing';

const title = '글';
const description =
  '도구를 만들며 부딪힌 문제와 그때 내린 판단을 기록합니다. 공공데이터 전처리, 웹 성능과 보안, 검색 노출 같은 주제를 다룹니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/writing` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/writing`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
  },
};

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-');
  return `${year}. ${month}. ${day}`;
}

export default function WritingIndexPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
        글
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-white/80">
        도구를 만들며 부딪힌 문제와 그때 내린 판단을 남겨둡니다. 결론보다 막혔던
        지점을 적으려고 합니다.
      </p>

      <ul className="mt-12 space-y-8">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-7"
          >
            <p className="font-mono text-xs text-white/35">
              {formatDate(post.date)}
            </p>

            <h2 className="mt-3 text-2xl font-bold text-white">
              <Link
                href={`/writing/${post.slug}`}
                className="underline decoration-white/20 underline-offset-4 transition hover:decoration-white"
              >
                {post.title}
              </Link>
            </h2>

            <p className="mt-4 leading-relaxed text-white/70">
              {post.description}
            </p>

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
          </li>
        ))}
      </ul>
    </div>
  );
}
