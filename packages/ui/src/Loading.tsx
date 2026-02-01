import { Pen } from "lucide-react";

export default function Loading() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-paper space-y-6">
			<div className="relative">
				<Pen className="w-16 h-16 text-grading animate-bounce" />
			</div>
			<div className="text-center space-y-2">
				<h2 className="text-2xl font-serif font-bold text-ink animate-pulse">
					채점 중입니다...
				</h2>
				<p className="text-sm font-sans text-ink/60">잠시만 기다려주세요</p>
			</div>
		</div>
	);
}
