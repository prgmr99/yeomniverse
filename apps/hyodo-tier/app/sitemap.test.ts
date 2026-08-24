import { describe, expect, it } from 'vitest';
import { getBlogPosts } from '@/lib/blogData';
import { PARENT_RESULTS } from '@/lib/parentResultData';
import { RESULTS } from '@/lib/resultData';
import sitemap from './sitemap';

const urls = () => sitemap().map((entry) => entry.url);

describe('sitemap', () => {
  it('자식편 결과 유형이 모두 들어 있다', () => {
    const all = urls();
    for (const type of Object.keys(RESULTS)) {
      expect(all.some((url) => url.endsWith(`/result/${type}`))).toBe(true);
    }
  });

  // 유형 이름 롱테일 검색이 이 서비스의 주요 유입 경로다.
  it('부모편 결과 유형 8개가 모두 들어 있다', () => {
    const all = urls();
    for (const type of Object.keys(PARENT_RESULTS)) {
      expect(all.some((url) => url.endsWith(`/parent/result/${type}`))).toBe(
        true,
      );
    }
  });

  it('블로그 글이 모두 들어 있다', () => {
    const all = urls();
    for (const post of getBlogPosts()) {
      expect(all.some((url) => url.endsWith(`/blog/${post.slug}`))).toBe(true);
    }
  });

  it('중복된 URL이 없다', () => {
    const all = urls();
    expect(new Set(all).size).toBe(all.length);
  });
});
