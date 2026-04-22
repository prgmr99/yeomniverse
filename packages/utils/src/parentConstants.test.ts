import { describe, expect, it } from "vitest";
import { PARENT_QUESTIONS } from "./parentConstants";

describe("PARENT_QUESTIONS", () => {
	it("should have 14 questions", () => {
		expect(PARENT_QUESTIONS).toHaveLength(14);
	});

	it("should have unique question IDs", () => {
		const ids = PARENT_QUESTIONS.map((q) => q.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
	});

	it("each question should have 4 options", () => {
		PARENT_QUESTIONS.forEach((question) => {
			expect(question.options).toHaveLength(4);
		});
	});

	it("each option should have effects object", () => {
		PARENT_QUESTIONS.forEach((question) => {
			question.options.forEach((option) => {
				expect(option.effects).toBeDefined();
				expect(typeof option.effects).toBe("object");
			});
		});
	});
});
