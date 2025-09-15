import { Menu, MenuItemConstructorOptions } from 'electron';

type TrayOptions = {
  onTogglePresence: () => void;
  onOpen: () => void;
  onHide: () => void;
  onStartQuickHuddle: () => void;
  onQuit: () => void;
  onToggleAutoStart: () => void;
  getState: () => { autoStart: boolean; presence: 'online' | 'away' };
};

export function buildTrayMenu(opts: TrayOptions) {
  const state = opts.getState();
  const template: MenuItemConstructorOptions[] = [
    { label: `Presence: ${state.presence}`, enabled: false },
    { label: 'Toggle Presence', click: () => opts.onTogglePresence() },
    { type: 'separator' },
    { label: 'Open App', click: () => opts.onOpen() },
    { label: 'Hide App', click: () => opts.onHide() },
    { type: 'separator' },
    { label: 'Start Quick Huddle', click: () => opts.onStartQuickHuddle() },
    { type: 'separator' },
    { label: state.autoStart ? 'Disable Auto-Start' : 'Enable Auto-Start', click: () => opts.onToggleAutoStart() },
    { type: 'separator' },
    { label: 'Quit', role: 'quit', click: () => opts.onQuit() }
  ];
  return Menu.buildFromTemplate(template);
} 