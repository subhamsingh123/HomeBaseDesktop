import React, { useEffect, useRef, useState } from "react";
import { ScreenPickerModal } from "./components/ScreenPickerModal";
import { SettingsModal } from "./components/SettingsModal";
import { WebRTCManager } from "./services/webrtc";

interface Settings {
  autoStart: boolean;
  presence: "online" | "away";
  notifications: boolean;
  hotkeys: {
    huddle: string;
    mute: string;
  };
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
  const [webrtcManager, setWebrtcManager] = useState<WebRTCManager | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [settings, setSettings] = useState<Settings>({
    autoStart: false,
    presence: "online",
    notifications: true,
    hotkeys: {
      huddle: "CmdOrCtrl+Shift+H",
      mute: "CmdOrCtrl+Shift+M"
    }
  });
