import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loading from "./Loading";

describe("Loading", () => {
	it("renders loading text", () => {
		render(<Loading />);
		expect(screen.getByText("채점 중입니다...")).toBeInTheDocument();
	});

	it("renders subtitle text", () => {
		render(<Loading />);
		expect(screen.getByText("잠시만 기다려주세요")).toBeInTheDocument();
	});

	it("renders with correct structure", () => {
		const { container } = render(<Loading />);
		expect(container.firstChild).toHaveClass("min-h-screen");
	});

	it("contains Pen icon", () => {
		const { container } = render(<Loading />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});
});
