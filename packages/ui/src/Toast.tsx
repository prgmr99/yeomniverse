"use client";

import { useEffect } from "react";

export type ToastMessage = {
	message: string;
	tone?: "info" | "error";
};

type ToastProps = {
	toast: ToastMessage | null;
	onDismiss: () => void;
	/** 자동 소멸까지의 시간 (ms) */
	duration?: number;
};

/**
 * 자동 소멸 토스트.
 *
 * live region 컨테이너는 항상 렌더해 두고 내용만 토글한다.
 * 컨테이너까지 함께 마운트되면 스크린리더가 변경을 놓치는 경우가 있다.
 */
export default function Toast({
	toast,
	onDismiss,
	duration = 4000,
}: ToastProps) {
	useEffect(() => {
		if (!toast) return;
		const timer = setTimeout(onDismiss, duration);
		return () => clearTimeout(timer);
	}, [toast, onDismiss, duration]);

	// <output>은 암묵적으로 role="status" + aria-live="polite" 를 가진다
	return (
		<output className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
			{toast && (
				<div
					className={`animate-fade-in max-w-[22rem] rounded-xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
						toast.tone === "error"
							? "bg-grading text-white"
							: "bg-ink text-paper"
					}`}
				>
					{toast.message}
				</div>
			)}
		</output>
	);
}
