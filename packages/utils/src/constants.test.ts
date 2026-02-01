import { describe, expect, it } from "vitest";
import { QUESTIONS } from "./constants";

describe("QUESTIONS", () => {
	it("should have 14 questions", () => {
		expect(QUESTIONS).toHaveLength(14);
	});

	it("should have unique question IDs", () => {
		const ids = QUESTIONS.map((q) => q.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
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
});
