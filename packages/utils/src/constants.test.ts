import { describe, expect, it } from "vitest";
import { type Effects, QUESTION_COUNT, QUESTIONS } from "./constants";

const EFFECT_KEYS = [
	"interest",
	"intimacy",
	"expression",
	"tsundere",
	"sns",
] as const;

// 각 축에서 누적 가능한 최댓값 (문항마다 가장 높은 선택지를 골랐을 때)
function maxAchievable(key: keyof Effects): number {
	return QUESTIONS.reduce(
		(sum, q) => sum + Math.max(...q.options.map((o) => o.effects[key] ?? 0)),
		0,
	);
}

describe("QUESTIONS", () => {
	it("QUESTION_COUNT가 실제 문항 수와 일치한다", () => {
		expect(QUESTIONS).toHaveLength(QUESTION_COUNT);
	});

	it("id가 1부터 빠짐없이 이어진다", () => {
		expect(QUESTIONS.map((q) => q.id)).toEqual(
			Array.from({ length: QUESTIONS.length }, (_, i) => i + 1),
		);
	});

	it("each question should have 4 options", () => {
		QUESTIONS.forEach((question) => {
			expect(question.options).toHaveLength(4);
		});
	});

	it("each option should have effects object", () => {
		QUESTIONS.forEach((question) => {
			question.options.forEach((option) => {
				expect(option.effects).toBeDefined();
				expect(typeof option.effects).toBe("object");
			});
		});
	});

	// 판정 로직이 요구하는 임계값에 문항 데이터가 도달하지 못하면
	// 해당 결과 유형은 조용히 죽는다 (쇼윈도 유형이 실제로 이렇게 죽어 있었다).
	it("모든 플래그가 판정 임계값에 도달할 수 있다", () => {
		expect(maxAchievable("sns")).toBeGreaterThanOrEqual(3);
		expect(maxAchievable("tsundere")).toBeGreaterThanOrEqual(3);
	});

	it("점수 축은 모두 양의 상한을 가진다", () => {
		for (const key of EFFECT_KEYS) {
			expect(maxAchievable(key)).toBeGreaterThan(0);
		}
	});
});
