import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PARENT_RESULTS } from '@/lib/parentResultData';
import ParentResultView from './ParentResultView';

/**
 * /parent/result/[type] 유형 랜딩 — 검색으로 들어온, 시험을 본 적 없는 방문자가 보는 화면.
 * 응시 기록이 없으므로 점수는 감춰야 하고, 응시로 가는 길이 보여야 한다.
 */
describe('ParentResultView (유형 랜딩)', () => {
  const renderLanding = (type: string) =>
    render(<ParentResultView forcedResultId={type} />);

  it('경로로 받은 유형의 성적표를 보여준다', () => {
    renderLanding('SHOW_WINDOW_PARENT');
    const result = PARENT_RESULTS.SHOW_WINDOW_PARENT;

    expect(screen.getByText(result.title)).toBeInTheDocument();
    expect(screen.getByText(`${result.grade}등급`)).toBeInTheDocument();
  });

  // 원점수 0을 환산하면 0이 아닌 값이 나와서, 감추지 않으면
  // 응시하지도 않은 점수가 성적표처럼 보인다. (lib/scoreDisplay.test.ts 참고)
  it('응시 기록이 없으면 상세 점수를 감춘다', () => {
    renderLanding('LODGER_PARENT');

    // Tailwind가 적용되지 않는 jsdom에서는 클래스로 확인한다
    expect(screen.getByText('상세 점수').parentElement).toHaveClass('hidden');
  });

  it('방문자에게 응시 경로를 준다', () => {
    renderLanding('UNICORN_PARENT');

    expect(screen.getByRole('link', { name: /나도 응시하기/ })).toHaveAttribute(
      'href',
      '/parent',
    );
  });

  it('응시 이력이 없으므로 "재시험"은 보이지 않는다', () => {
    renderLanding('UNICORN_PARENT');
    expect(screen.queryByText('재시험')).not.toBeInTheDocument();
  });

  it('8유형 전부 렌더된다', () => {
    for (const [id, result] of Object.entries(PARENT_RESULTS)) {
      const { unmount } = renderLanding(id);
      expect(screen.getByText(result.title)).toBeInTheDocument();
      unmount();
    }
  });
});
