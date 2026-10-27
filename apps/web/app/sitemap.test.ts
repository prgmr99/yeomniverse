import { describe, expect, it } from 'vitest';
import { SERVICES } from '@/lib/services';
import { SITE_URL } from '@/lib/site';
import { POSTS } from '@/lib/writing';
import sitemap from './sitemap';

describe('sitemap', () => {
  const urls = sitemap().map((entry) => entry.url);

  it('루트와 정책·소개·문의 페이지를 모두 포함한다', () => {
    expect(urls).toEqual(
      expect.arrayContaining([
        SITE_URL,
        `${SITE_URL}/about`,
        `${SITE_URL}/contact`,
        `${SITE_URL}/privacy`,
        `${SITE_URL}/terms`,
        `${SITE_URL}/writing`,
      ]),
    );
  });

  it('글이 추가되면 상세 페이지도 함께 올라간다', () => {
    for (const post of POSTS) {
      expect(urls).toContain(`${SITE_URL}/writing/${post.slug}`);
    }
  });

  it('서비스가 추가되면 상세 페이지도 함께 올라간다', () => {
    for (const service of SERVICES) {
      expect(urls).toContain(`${SITE_URL}/services/${service.slug}`);
    }
  });

  it('절대 URL만 담고 중복이 없다', () => {
    for (const url of urls) {
      expect(url.startsWith('https://')).toBe(true);
    }
    expect(new Set(urls).size).toBe(urls.length);
  });
});
