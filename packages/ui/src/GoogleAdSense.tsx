"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

// Yeomniverse 전체 사이트가 공유하는 AdSense 퍼블리셔 ID (공개 값, ads.txt와 동일)
const DEFAULT_ADSENSE_CLIENT = "ca-pub-7476208540300201";

type Props = {
	/** strict CSP를 쓰는 앱에서 넘긴다. 없으면 기존처럼 동작한다. */
	nonce?: string;
};

export default function GoogleAdSense({ nonce }: Props = {}) {
	const pathname = usePathname();

	// 퀴즈 페이지(/quiz)에서는 광고 노출 제외 (정책 위반 방지)
	if (pathname?.startsWith("/quiz")) {
		return null;
	}

	const pId =
		process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT || DEFAULT_ADSENSE_CLIENT;

	return (
		<Script
			async
			src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
			crossOrigin="anonymous"
			nonce={nonce}
			strategy="afterInteractive"
		/>
	);
}
