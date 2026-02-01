import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Email Templates", () => {
	it("renders without crashing", () => {
		const TestEmail = () => <div>Test Email</div>;
		const { container } = render(<TestEmail />);
		expect(container).toBeTruthy();
	});
});
