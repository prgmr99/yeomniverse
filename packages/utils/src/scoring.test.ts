import { describe, expect, it } from "vitest";
import {
	CHILD_SCORE_RANGES,
	normalizeScore,
	normalizeScores,
	PARENT_SCORE_RANGES,
	SCORE_AXES,
} from "./scoring";

describe("점수 범위", () => {
	it("모든 축이 음수 하한과 양수 상한을 가진다", () => {
		for (const ranges of [CHILD_SCORE_RANGES, PARENT_SCORE_RANGES]) {
			for (const axis of SCORE_AXES) {
				expect(ranges[axis].max).toBeGreaterThan(0);
				expect(ranges[axis].min).toBeLessThan(0);
			}
		}
	});

	it("축마다 범위가 달라 공통 100점 만점을 쓸 수 없다", () => {
		const spans = SCORE_AXES.map(
			(a) => CHILD_SCORE_RANGES[a].max - CHILD_SCORE_RANGES[a].min,
		);
		expect(new Set(spans).size).toBeGreaterThan(1);
	});
});

describe("normalizeScore", () => {
	const range = { min: -100, max: 100 };

	it("하한은 0, 상한은 100으로 환산한다", () => {
		expect(normalizeScore(-100, range)).toBe(0);
		expect(normalizeScore(100, range)).toBe(100);
		expect(normalizeScore(0, range)).toBe(50);
	});

	it("범위를 벗어난 값은 0~100으로 잘라낸다", () => {
		expect(normalizeScore(-999, range)).toBe(0);
		expect(normalizeScore(999, range)).toBe(100);
	});

	it("범위가 없으면 0을 반환한다", () => {
		expect(normalizeScore(50, { min: 0, max: 0 })).toBe(0);
	});

	it("실제 최고점은 세 축 모두 100이 된다", () => {
		const best = normalizeScores(
			{
				interest: CHILD_SCORE_RANGES.interest.max,
				intimacy: CHILD_SCORE_RANGES.intimacy.max,
				expression: CHILD_SCORE_RANGES.expression.max,
			},
			CHILD_SCORE_RANGES,
		);
		expect(best).toEqual({ interest: 100, intimacy: 100, expression: 100 });
	});
});
