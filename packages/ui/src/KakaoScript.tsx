"use client";

import Script from "next/script";

// Types are declared in types/kakao.d.ts

export default function KakaoScript() {
	return (
		<Script
			src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
			integrity="sha384-kDljxUXHaJ9xAb2AzRd59KxjrFjzHa5TAoFQ6GbYTCAG0bjM55XohjjDT7tDDC01"
			crossOrigin="anonymous"
			onLoad={() => {
				const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
				const kakao = (
					window as unknown as {
						Kakao?: {
							init: (key: string) => void;
							isInitialized: () => boolean;
						};
					}
				).Kakao;
				if (kakao && !kakao.isInitialized() && kakaoKey) {
					kakao.init(kakaoKey);
				}
			}}
		/>
	);
}
