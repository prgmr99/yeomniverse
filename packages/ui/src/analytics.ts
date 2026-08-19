type GtagFn = (
	command: "event",
	eventName: string,
	params?: Record<string, unknown>,
) => void;

declare global {
	interface Window {
		gtag?: GtagFn;
	}
}

/**
 * GA4 커스텀 이벤트 전송.
 *
 * GA 스크립트가 아직 로드되지 않았거나(광고 차단 포함) 서버에서 호출되면
 * 조용히 무시한다 — 계측 때문에 사용자 흐름이 끊기면 안 된다.
 */
export function trackEvent(
	eventName: string,
	params?: Record<string, unknown>,
): void {
	if (typeof window === "undefined") return;
	window.gtag?.("event", eventName, params);
}
