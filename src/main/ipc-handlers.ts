import { ipcMain, Notification, desktopCapturer, powerMonitor } from 'electron';

interface SourceWithDisplayId {
  id: string;
  displayId?: string;
  name: string;
  appIcon?: string;
  thumbnail?: string;
}

export function registerIpcHandlers() {
  ipcMain.handle('voffice:system:get-idle-time', () => {
    return powerMonitor.getSystemIdleTime();
  });

  ipcMain.handle('voffice:system:list-sources', async (_evt, opts: { types: Array<'screen' | 'window'> }) => {
    const sources = await desktopCapturer.getSources({
      types: opts?.types ?? ['screen', 'window'],
      fetchWindowIcons: true,
      thumbnailSize: { width: 320, height: 200 }
    });
    return sources.map((s): SourceWithDisplayId => ({
      id: s.id,
      displayId: (s as unknown as { display_id?: string }).display_id || undefined,
      name: s.name,
      appIcon: s.appIcon ? s.appIcon.toDataURL() : undefined,
      thumbnail: s.thumbnail ? s.thumbnail.toDataURL() : undefined
    }));
  });

  ipcMain.handle('voffice:system:notify', (_evt, payload: { title: string; body: string }) => {
    const n = new Notification({ title: payload.title, body: payload.body });
    n.show();
    return true;
  });
}
