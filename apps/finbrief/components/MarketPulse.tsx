"use client";

import FearGreedGauge from "@/components/FearGreedGauge";
import {
	ScrollReveal,
	StaggerContainer,
	StaggerItem,
} from "@/components/landing";
import OneWayGauge from "@/components/OneWayGauge";
import type { BriefingData } from "@/lib/briefing";

interface MarketPulseProps {
	data: BriefingData | null;
	isLoading: boolean;
}

const SAMPLE_FEAR_GREED = { score: 72, rating: "Greed" };
const SAMPLE_ONE_WAY = {
	score: 65,
	direction: "bull" as const,
	label: "Strong One-Way Trend",
};

export default function MarketPulse({ data, isLoading }: MarketPulseProps) {
	const fearGreed = data?.fearGreed ?? SAMPLE_FEAR_GREED;
	const oneWay = data?.oneWay ?? SAMPLE_ONE_WAY;

	if (isLoading) {
		return (
			<section
				className="px-6 bg-finbrief-black"
				style={{ padding: "clamp(80px, 12vh, 150px) 24px" }}
			>
				<div className="max-w-[980px] mx-auto">
					<div className="text-center mb-10">
						<p className="text-finbrief-gray-500 text-base font-medium tracking-wide uppercase mb-4">
							MARKET PULSE
						</p>
						<h2
							className="text-finbrief-white font-semibold"
							style={{ fontSize: "36px" }}
						>
							Today's Market at a Glance
						</h2>
					</div>
					<div className="grid md:grid-cols-2 gap-6">
						{/* Skeleton cards */}
						<div className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-pulse">
							<div className="h-4 bg-white/10 rounded w-1/3 mb-6" />
							<div className="h-14 bg-white/10 rounded w-1/2 mb-6" />
							<div className="h-3 bg-white/10 rounded w-full mb-3" />
							<div className="h-3 bg-white/10 rounded w-full" />
						</div>
						<div className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-pulse">
							<div className="h-4 bg-white/10 rounded w-1/3 mb-6" />
							<div className="h-14 bg-white/10 rounded w-1/2 mb-6" />
							<div className="h-3 bg-white/10 rounded w-full mb-3" />
							<div className="h-3 bg-white/10 rounded w-full" />
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			className="px-6 bg-finbrief-black"
			style={{ padding: "clamp(80px, 12vh, 150px) 24px" }}
		>
			<div className="max-w-[980px] mx-auto">
				<ScrollReveal className="text-center mb-10">
					<p className="text-finbrief-gray-500 text-base font-medium tracking-wide uppercase mb-4">
						MARKET PULSE
					</p>
					<h2
						className="text-finbrief-white font-semibold"
						style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
					>
						Today's Market at a Glance
					</h2>
				</ScrollReveal>

				<StaggerContainer
					staggerDelay={0.2}
					className="grid md:grid-cols-2 gap-6 items-stretch"
				>
					<StaggerItem className="h-full">
						<FearGreedGauge score={fearGreed.score} rating={fearGreed.rating} />
					</StaggerItem>
					<StaggerItem className="h-full">
						<OneWayGauge
							score={oneWay.score}
							direction={oneWay.direction}
							label={oneWay.label}
							components={data?.oneWay?.components}
						/>
					</StaggerItem>
				</StaggerContainer>

				<ScrollReveal delay={0.4} className="text-center mt-8">
					<p className="text-finbrief-gray-500 text-sm">
						Updated daily with your morning briefing
					</p>
				</ScrollReveal>
			</div>
		</section>
	);
}
