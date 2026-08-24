import { describe, expect, it } from 'vitest';
import { PARENT_RESULTS } from './parentResultData';
import { buildParentResultMetadata } from './parentResultMetadata';

describe('buildParentResultMetadata', () => {
  it('유형을 모르면 기본 메타데이터를 준다', () => {
    for (const input of [undefined, '', 'NOT_A_TYPE']) {
      const meta = buildParentResultMetadata(input);
      expect(meta.title).toBe('나의 효도 등급 결과 (부모편)');
      expect(meta.openGraph).toBeUndefined();
    }
  });

  it('유형별로 제목·등급·설명이 달라진다', () => {
    const meta = buildParentResultMetadata('UNICORN_PARENT');
    const result = PARENT_RESULTS.UNICORN_PARENT;

    expect(meta.title).toBe(`나는 ${result.title}! (${result.grade}등급)`);
    expect(meta.description).toContain(result.subtitle);
  });

  // 이 서비스가 자식편에서 이미 겪은 버그다 — 유형이 경로에 없으면
  // 공유된 링크가 전부 같은 OG 이미지로 노출된다.
  it('8유형 모두 서로 다른 canonical과 OG 이미지를 가진다', () => {
    const ids = Object.keys(PARENT_RESULTS);
    expect(ids).toHaveLength(8);

    const canonicals = new Set<string>();
    const ogImages = new Set<string>();

    for (const id of ids) {
      const meta = buildParentResultMetadata(id);
      const canonical = String(meta.alternates?.canonical);
      const ogImage = String(
        (meta.openGraph as { images?: { url: string }[] })?.images?.[0]?.url,
      );

      expect(canonical).toContain(`/parent/result/${id}`);
      expect(ogImage).toContain(`result=${id}`);
      // 자식편 OG로 새면 부모 유형이 자식 캐릭터로 그려진다
      expect(ogImage).toContain('mode=parent');

      canonicals.add(canonical);
      ogImages.add(ogImage);
    }

    expect(canonicals.size).toBe(8);
    expect(ogImages.size).toBe(8);
  });

  it('canonical이 부모편 경로를 가리킨다', () => {
    const canonical = String(
      buildParentResultMetadata('LODGER_PARENT').alternates?.canonical,
    );
    expect(canonical).toMatch(/\/parent\/result\/LODGER_PARENT$/);
  });
});
