import React, { useState, useEffect } from "react";

interface Settings {
  autoStart: boolean;
  presence: "online" | "away";
  notifications: boolean;
  hotkeys: {
    huddle: string;
    mute: string;
  };
}

export const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-96 max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button className="text-slate-300 hover:text-white" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localSettings.autoStart}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoStart: e.target.checked })
                }
                className="rounded"
              />
              <span>Auto-start with system</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Presence</label>
            <select
              value={localSettings.presence}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  presence: e.target.value as "online" | "away"
                })
              }
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localSettings.notifications}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, notifications: e.target.checked })
                }
                className="rounded"
              />
              <span>Enable notifications</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Huddle Hotkey</label>
            <input
              type="text"
              value={localSettings.hotkeys.huddle}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  hotkeys: { ...localSettings.hotkeys, huddle: e.target.value }
                })
              }
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded"
              placeholder="CmdOrCtrl+Shift+H"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mute Hotkey</label>
            <input
              type="text"
              value={localSettings.hotkeys.mute}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  hotkeys: { ...localSettings.hotkeys, mute: e.target.value }
                })
              }
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded"
              placeholder="CmdOrCtrl+Shift+M"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
