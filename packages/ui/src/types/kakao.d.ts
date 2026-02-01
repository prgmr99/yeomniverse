declare global {
	interface Window {
		Kakao?: {
			init: (appKey: string) => void;
			isInitialized: () => boolean;
			Share?: {
				sendDefault: (settings: unknown) => void;
			};
		};
	}
}

export {};
