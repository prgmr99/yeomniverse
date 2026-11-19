import Link from "next/link";

export default function Footer() {
	return (
		<footer className="w-full px-4 pt-10 pb-16 mt-16 border-t border-rule text-center text-ink-faint text-xs space-y-7">
			{/* 빠른 링크 */}
			<div>
				<div className="flex justify-center flex-wrap items-center gap-x-3 gap-y-2">
					<Link href="/" className="hover:text-ink transition-colors">
						테스트 시작
					</Link>
					<span aria-hidden="true" className="text-rule">
						|
					</span>
					<Link href="/blog" className="hover:text-ink transition-colors">
						효도 블로그
					</Link>
					<span aria-hidden="true" className="text-rule">
						|
					</span>
					<Link href="/about" className="hover:text-ink transition-colors">
						서비스 소개
					</Link>
					<span aria-hidden="true" className="text-rule">
						|
					</span>
					<a
						href="https://yeomniverse.com"
						className="hover:text-ink transition-colors"
					>
						Yeomniverse
					</a>
				</div>
			</div>

			{/* 정책 링크 */}
			<div className="flex justify-center items-center gap-5">
				<Link href="/terms" className="hover:text-ink transition-colors">
					이용약관
				</Link>
				<span aria-hidden="true" className="text-rule">
					|
				</span>
				<Link
					href="/privacy"
					className="hover:text-ink transition-colors font-bold"
				>
					개인정보처리방침
				</Link>
			</div>

			<p className="leading-relaxed">
				본 서비스는 재미를 위한 심리테스트이며, <br />
				실제 결과와 다를 수 있습니다.
			</p>
			<p className="font-serif">
				&copy; {new Date().getFullYear()} Hyo-Tier Committee. All rights
				reserved.
			</p>
		</footer>
	);
}
