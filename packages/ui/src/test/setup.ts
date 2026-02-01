import "@testing-library/jest-dom/vitest";

// Tailwind CSS v4 Note:
// JSDOM does not process CSS, so Tailwind classes exist in DOM but don't compute styles.
// For style assertions:
// - Use toHaveClass() for class presence: expect(el).toHaveClass('bg-blue-500')
// - Do NOT use getComputedStyle() - it returns empty/default values in jsdom
// - Use E2E tests (Playwright) for visual/style verification
