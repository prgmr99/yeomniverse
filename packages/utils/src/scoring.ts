import { QUESTIONS, type Question } from "./constants";
import { PARENT_QUESTIONS } from "./parentConstants";

export type ScoreAxis = "interest" | "intimacy" | "expression";

export const SCORE_AXES: readonly ScoreAxis[] = [
	"interest",
	"intimacy",
	"expression",
];

export type ScoreRange = { min: number; max: number };
export type ScoreRanges = Record<ScoreAxis, ScoreRange>;
export type RawScores = Record<ScoreAxis, number>;

// 각 축에서 실제로 도달 가능한 최저/최고 점수 (문항마다 최저/최고 선택지를 골랐을 때)
function computeRanges(questions: Question[]): ScoreRanges {
	const ranges = {} as ScoreRanges;

	for (const axis of SCORE_AXES) {
		ranges[axis] = questions.reduce(
			(acc, question) => {
				const values = question.options.map((o) => o.effects[axis] ?? 0);
				return {
					min: acc.min + Math.min(...values),
					max: acc.max + Math.max(...values),
				};
			},
			{ min: 0, max: 0 },
		);
	}

	return ranges;
}

export const CHILD_SCORE_RANGES = computeRanges(QUESTIONS);
export const PARENT_SCORE_RANGES = computeRanges(PARENT_QUESTIONS);

/**
 * 원점수를 0~100으로 환산한다.
 *
 * 축마다 도달 가능한 범위가 다르고 음수도 나올 수 있어서(친밀도는 -115까지)
 * 원점수를 그대로 100점 만점 막대에 그리면 고득점은 포화되고 음수는 잘린다.
 */
export function normalizeScore(raw: number, range: ScoreRange): number {
	const span = range.max - range.min;
	if (span <= 0) return 0;

	const ratio = (raw - range.min) / span;
	return Math.round(Math.min(Math.max(ratio, 0), 1) * 100);
}

export function normalizeScores(
	raw: RawScores,
	ranges: ScoreRanges,
): RawScores {
	return {
		interest: normalizeScore(raw.interest, ranges.interest),
		intimacy: normalizeScore(raw.intimacy, ranges.intimacy),
		expression: normalizeScore(raw.expression, ranges.expression),
	};
}
