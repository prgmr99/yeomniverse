"use client";

import Script from "next/script";

type Props = {
	/** strict CSP를 쓰는 앱에서 넘긴다. 없으면 기존처럼 동작한다. */
	nonce?: string;
};

export default function GoogleAnalytics({ nonce }: Props = {}) {
	const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

	if (!measurementId) return null;

	return (
		<>
			<Script
				nonce={nonce}
				strategy="afterInteractive"
				src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
			/>
			<Script
				id="google-analytics"
				nonce={nonce}
				strategy="afterInteractive"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Google Analytics configuration script
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
				}}
			/>
		</>
	);
}
