import { contextBridge, ipcRenderer } from 'electron';

interface Source {
  id: string;
  name: string;
  thumbnail?: string;
}

const electronAPI = {
  getSystemIdleTime: async (): Promise<number> => ipcRenderer.invoke('voffice:system:get-idle-time'),
  listScreens: async (types: Array<'screen' | 'window'> = ['screen', 'window']): Promise<Array<Source>> =>
    ipcRenderer.invoke('voffice:system:list-sources', { types }),
  showNotification: async (title: string, body: string): Promise<boolean> =>
    ipcRenderer.invoke('voffice:system:notify', { title, body }),
  onHotkeyHuddle: (cb: () => void) => ipcRenderer.on('voffice:hotkey:huddle', cb),
  onHotkeyToggleMute: (cb: () => void) => ipcRenderer.on('voffice:hotkey:toggle-mute', cb),
  onPresenceChanged: (cb: (_evt: unknown, presence: 'online' | 'away') => void) =>
    ipcRenderer.on('voffice:presence:changed', cb),
  onSystemEvent: (channel: 'voffice:system:suspend' | 'voffice:system:resume' | 'voffice:system:lock' | 'voffice:system:unlock', cb: () => void) =>
    ipcRenderer.on(channel, cb)
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
