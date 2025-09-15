export {};

declare global {
	interface Window {
		electronAPI: {
			getSystemIdleTime: () => Promise<number>;
			listScreens: (types?: Array<'screen' | 'window'>) => Promise<Array<{ id: string; name: string; thumbnail?: string }>>;
			showNotification: (title: string, body: string) => Promise<boolean>;
			onHotkeyHuddle: (cb: () => void) => void;
			onHotkeyToggleMute: (cb: () => void) => void;
			onPresenceChanged: (cb: (_evt: unknown, presence: 'online' | 'away') => void) => void;
			onSystemEvent: (channel: 'voffice:system:suspend' | 'voffice:system:resume' | 'voffice:system:lock' | 'voffice:system:unlock', cb: () => void) => void;
		};
	}
} 