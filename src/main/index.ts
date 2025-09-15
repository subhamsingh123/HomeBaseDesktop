import { app, BrowserWindow, Menu, Tray, nativeImage, shell, globalShortcut, powerMonitor } from 'electron';
import path from 'node:path';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import { registerIpcHandlers } from './ipc-handlers';
import { buildTrayMenu } from './tray';

const store = new Store<{ settings: { autoStart: boolean; presence: 'online' | 'away' } }>();
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function getPreloadPath() {
  if (app.isPackaged) {
    return path.join(__dirname, '../preload/index.js');
  }
  return path.join(__dirname, '../../dist-electron/preload/index.js');
}

function getRendererUrl() {
  if (app.isPackaged) {
    return `file://${path.join(__dirname, '../../dist/index.html')}`;
  }
  return process.env['ELECTRON_RENDERER_URL'] || 'http://localhost:5173';
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      spellcheck: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  const startUrl = getRendererUrl();
  if (startUrl.startsWith('http')) {
    await mainWindow.loadURL(startUrl);
  } else {
    await mainWindow.loadURL(startUrl);
  }

  mainWindow.on('close', (e) => {
    if (app.isPackaged || process.platform === 'darwin') {
      e.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function setupAutoStart(enabled: boolean) {
  if (process.platform === 'darwin') {
    app.setLoginItemSettings({ openAtLogin: enabled });
  } else if (process.platform === 'win32') {
    app.setLoginItemSettings({ openAtLogin: enabled });
  }
}

function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    mainWindow?.webContents.send('voffice:hotkey:huddle');
  });
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    mainWindow?.webContents.send('voffice:hotkey:toggle-mute');
  });
}

function setupPowerMonitor() {
  powerMonitor.on('suspend', () => mainWindow?.webContents.send('voffice:system:suspend'));
  powerMonitor.on('resume', () => mainWindow?.webContents.send('voffice:system:resume'));
  powerMonitor.on('lock-screen', () => mainWindow?.webContents.send('voffice:system:lock'));
  powerMonitor.on('unlock-screen', () => mainWindow?.webContents.send('voffice:system:unlock'));
}

app.whenReady().then(async () => {
  const settings = store.get('settings') || { autoStart: false, presence: 'online' };
  setupAutoStart(settings.autoStart);
  await createWindow();

  tray = new Tray(nativeImage.createEmpty());
  tray.setToolTip('VOffice Desktop');
  tray.setContextMenu(buildTrayMenu({
    onTogglePresence: () => {
      const s = store.get('settings') || { autoStart: false, presence: 'online' };
      const next = s.presence === 'online' ? 'away' : 'online';
      store.set('settings', { ...s, presence: next });
      mainWindow?.webContents.send('voffice:presence:changed', next);
    },
    onOpen: () => mainWindow?.show(),
    onHide: () => mainWindow?.hide(),
    onStartQuickHuddle: () => mainWindow?.webContents.send('voffice:huddle:start-quick'),
    onQuit: () => {
      app.exit(0);
    },
    onToggleAutoStart: () => {
      const s = store.get('settings') || { autoStart: false, presence: 'online' };
      const enabled = !s.autoStart;
      store.set('settings', { ...s, autoStart: enabled });
      setupAutoStart(enabled);
    },
    getState: () => store.get('settings') || { autoStart: false, presence: 'online' }
  }));

  tray.on('click', () => {
    if (mainWindow?.isVisible()) mainWindow.hide();
    else mainWindow?.show();
  });

  registerIpcHandlers();
  registerShortcuts();
  setupPowerMonitor();

  autoUpdater.checkForUpdatesAndNotify().catch(() => {});

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow();
    else mainWindow?.show();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 