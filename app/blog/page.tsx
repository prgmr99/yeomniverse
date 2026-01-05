import { BookOpen, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/blogData';

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="min-h-screen bg-paper p-6 pb-20 animate-fade-in">
      {/* 헤더 */}
      <header className="mb-8 border-b-2 border-ink pb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-8 h-8 text-grading" />
          <h1 className="text-3xl font-black text-ink">효도 블로그</h1>
        </div>
        <p className="text-sm text-ink/60 font-sans">
          부모님과의 관계를 개선하는 효도 팁과 가이드
        </p>
      </header>

      {/* CTA 배너 */}
      <div className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border border-ink/10">
        <h2 className="text-lg font-bold text-ink mb-2">
          💝 나의 효도 등급은?
        </h2>
        <p className="text-sm text-ink/70 mb-4">
          효도티어 테스트로 당신의 효도 스타일을 확인하세요
        </p>
        <Link
          href="/"
          className="inline-block bg-ink text-white px-6 py-2 rounded-lg font-bold hover:bg-grading transition-all"
        >
          테스트 시작하기 →
        </Link>
      </div>

      {/* 블로그 게시물 목록 */}
      <section className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-white p-6 rounded-xl border border-ink/10 shadow-sm hover:shadow-md hover:border-grading transition-all group"
          >
            {/* 태그 */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-stone-100 text-ink/60 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 제목 */}
            <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-grading transition-colors">
              {post.title}
            </h3>

            {/* 설명 */}
            <p className="text-sm text-ink/70 mb-4 line-clamp-2">
              {post.description}
            </p>

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-xs text-ink/50">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString('ko-KR')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* 하단 CTA */}
      <div className="mt-12 text-center p-8 bg-stone-100 rounded-xl">
        <h3 className="text-xl font-bold text-ink mb-2">효도, 어렵지 않아요</h3>
        <p className="text-sm text-ink/60 mb-4">
          지금 바로 효도티어 테스트로 나의 효도 스타일을 확인하고,
          <br />
          개선 방법을 찾아보세요!
        </p>
        <Link
          href="/"
          className="inline-block bg-grading text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-all"
        >
          효도티어 테스트 시작 →
        </Link>
      </div>
    </main>
  );
}
