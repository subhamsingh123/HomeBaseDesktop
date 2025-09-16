import React, { useEffect, useRef, useState } from "react";
import { ScreenPickerModal } from "./components/ScreenPickerModal";
import { SettingsModal } from "./components/SettingsModal";

interface Settings {
  autoStart: boolean;
  presence: "online" | "away";
  notifications: boolean;
  hotkeys: { huddle: string; mute: string };
}

export const App: React.FC = () => {
  const [idleSeconds, setIdleSeconds] = useState<number>(0);
  const [sources, setSources] = useState<Array<{ id: string; name: string; thumbnail?: string }>>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInHuddle, setIsInHuddle] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [presence, setPresence] = useState<"online" | "away">("online");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [settings, setSettings] = useState<Settings>({
    autoStart: false,
    presence: "online",
    notifications: true,
    hotkeys: { huddle: "CmdOrCtrl+Shift+H", mute: "CmdOrCtrl+Shift+M" }
  });

  console.log('App component rendering');

  useEffect(() => {
    console.log('Setting up idle timer');
    const t = setInterval(async () => {
      try {
        if (window.electronAPI?.getSystemIdleTime) {
          const v = await window.electronAPI.getSystemIdleTime();
          setIdleSeconds(v);
        } else {
          setIdleSeconds(Math.floor(Math.random() * 60)); // Mock data for testing
        }
      } catch (error) {
        console.error('Error getting idle time:', error);
        setIdleSeconds(Math.floor(Math.random() * 60)); // Mock data for testing
      }
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    console.log('Setting up event listeners');
    try {
      if (window.electronAPI) {
        window.electronAPI.onHotkeyHuddle?.(() => (isInHuddle ? leaveHuddle() : startHuddle()));
        window.electronAPI.onHotkeyToggleMute?.(() => toggleMute());
        window.electronAPI.onPresenceChanged?.((_evt, p) => setPresence(p));
        window.electronAPI.onSystemEvent?.("voffice:system:suspend", () => setPresence("away"));
        window.electronAPI.onSystemEvent?.("voffice:system:resume", () => setPresence("online"));
      }
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }, [isInHuddle]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream as any;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  const startPick = async () => {
    console.log('Starting screen pick');
    setShowPicker(true);
    try {
      if (window.electronAPI?.listScreens) {
        const list = await window.electronAPI.listScreens(["screen", "window"]);
        setSources(list);
      } else {
        // Mock data for testing
        setSources([
          { id: 'screen:0', name: 'Screen 1', thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PC9zdmc+' },
          { id: 'window:1', name: 'Chrome', thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PC9zdmc+' }
        ]);
      }
    } catch (error) {
      console.error('Error listing screens:', error);
    }
  };

  const handlePick = async (sourceId: string) => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: sourceId } as any } as MediaTrackConstraints
      } as any);
      setStream(media);
      setShowPicker(false);
    } catch {
      alert("Failed to capture source - this is expected in browser mode");
    }
  };

  const startHuddle = async () => {
    console.log('Starting huddle');
    setIsInHuddle(true);
    try {
      if (window.electronAPI?.showNotification) {
        await window.electronAPI.showNotification("VOffice", "Huddle started");
      } else {
        alert("Huddle started (mock)");
      }
    } catch {
      alert("Huddle started (mock)");
    }
  };

  const leaveHuddle = () => {
    console.log('Leaving huddle');
    setIsInHuddle(false);
    setStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (stream) stream.getAudioTracks().forEach(t => (t.enabled = !next));
  };

  const onSaveSettings = (s: Settings) => setSettings(s);

  const testNotification = async () => {
    try {
      if (window.electronAPI?.showNotification) {
        await window.electronAPI.showNotification("VOffice", "Test notification");
      } else {
        alert("Test notification (mock)");
      }
    } catch {
      alert("Test notification (mock)");
    }
  };

  return (
    <div className="p-4 space-y-4 min-h-screen bg-slate-950 text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">VOffice Desktop</h1>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${presence === "online" ? "text-green-400" : "text-yellow-400"}`}>{presence}</span>
          <button className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600" onClick={() => setShowSettings(true)}>Settings</button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>Idle: {idleSeconds}s</div>
        <div className="flex gap-4"><span>Huddle: {isInHuddle ? "Active" : "Inactive"}</span><span>Muted: {isMuted ? "Yes" : "No"}</span></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Screen Sharing</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50" onClick={startPick} disabled={isInHuddle}>
              {stream ? "Change Source" : "Share Screen"}
            </button>
            {stream && (
              <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-700" onClick={() => { setStream(null); if (videoRef.current) videoRef.current.srcObject = null; }}>
                Stop Sharing
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-medium">Huddle</h2>
          <div className="flex gap-2">
            <button className={`px-4 py-2 rounded hover:opacity-90 ${isInHuddle ? "bg-red-600" : "bg-green-600"}`} onClick={isInHuddle ? leaveHuddle : startHuddle}>
              {isInHuddle ? "Leave Huddle" : "Start Huddle"}
            </button>
            <button className={`px-4 py-2 rounded hover:opacity-90 ${isMuted ? "bg-yellow-600" : "bg-gray-600"}`} onClick={toggleMute}>
              {isMuted ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
      </div>

      {stream && <video ref={videoRef} muted autoPlay className="w-full max-w-4xl border border-slate-700 rounded" />}

      <div className="flex gap-2">
        <button className="px-3 py-2 bg-emerald-600 rounded hover:bg-emerald-700" onClick={testNotification}>
          Test Notification
        </button>
        <button className="px-3 py-2 bg-purple-600 rounded hover:bg-purple-700" onClick={() => setPresence(presence === "online" ? "away" : "online")}>
          Toggle Presence
        </button>
      </div>

      {showPicker && <ScreenPickerModal sources={sources} onPick={handlePick} onClose={() => setShowPicker(false)} />}
      {showSettings && <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} settings={settings} onSave={onSaveSettings} />}

      <div className="text-xs text-slate-500">
        <div>Hotkeys: {settings.hotkeys.huddle} (Huddle), {settings.hotkeys.mute} (Mute)</div>
        <div>Right-click tray icon for more options</div>
        <div className="mt-2 p-2 bg-slate-800 rounded text-slate-300">
          <strong>Debug Info:</strong>
          <br />• Electron API Available: {window.electronAPI ? 'Yes' : 'No'}
          <br />• Screen Capture: {navigator.mediaDevices ? 'Available' : 'Not Available'}
          <br />• Environment: {import.meta.env?.MODE || 'development'}
        </div>
      </div>
    </div>
  );
};
