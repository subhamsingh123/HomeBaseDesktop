# VOffice Desktop Client

A production-grade **Desktop Client** for the Virtual Office Layer built with Electron + React + TypeScript. This app provides the best desktop experience with always-on presence, native screen capture, notifications, system idle detection, hotkeys, and WebRTC huddle features.

## 🚀 Features

### Core Desktop Features
- ✅ **Always-on Tray Icon** - System tray with presence indicator and quick actions
- ✅ **Native Screen Capture** - Multi-monitor and window selection for screen sharing
- ✅ **Global Hotkeys** - System-wide shortcuts for huddle and mute controls
- ✅ **Auto-start** - Optional system startup integration
- ✅ **Native Notifications** - OS-level notifications with deep linking
- ✅ **System Idle Detection** - Automatic presence management based on activity
- ✅ **Settings UI** - Comprehensive user preferences

### WebRTC & Communication
- ✅ **WebRTC Signaling** - Real-time peer-to-peer connections
- ✅ **Screen Sharing** - Native desktop capture with source selection
- ✅ **Huddle Management** - Start/join/leave huddles with hotkeys
- ✅ **Audio Controls** - Mute/unmute with system integration

### Security & Performance
- ✅ **Secure Preload** - Context isolation with safe API exposure
- ✅ **Hardware Acceleration** - Optimized for WebRTC performance
- ✅ **Memory Management** - Efficient resource usage
- ✅ **Auto-updater** - Seamless application updates

## 🛠️ Tech Stack

- **Electron** - Desktop app framework
- **React 18** - UI library with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **WebRTC** - Real-time communication
- **electron-store** - Local data persistence
- **electron-updater** - Auto-update functionality

## 📦 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **macOS**: Grant Screen Recording, Microphone, and Notifications permissions when prompted

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Build the application
npm run build

# Create installers for all platforms
npm run dist
```

## 🎮 Usage

### Quick Start
1. Run `npm run dev` to start the development environment
2. The app will launch with a system tray icon
3. Right-click the tray icon for quick actions
4. Use the main window for screen sharing and huddle management

### Hotkeys
- **Cmd/Ctrl+Shift+H** - Toggle huddle (start/leave)
- **Cmd/Ctrl+Shift+M** - Toggle mute

### Screen Sharing
1. Click "Share Screen" to open the source picker
2. Select a monitor or window from the grid
3. The selected source will be captured and displayed
4. Use "Stop Sharing" to end the capture

### Settings
- Click "Settings" to open preferences
- Configure auto-start, notifications, and hotkeys
- Toggle presence between online/away

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# API Configuration
DESKTOP_API_BASE_URL=https://api.example.com
DESKTOP_SIGNALING_WS_URL=wss://api.example.com/ws/signaling

# WebRTC Servers
DESKTOP_STUN_SERVERS=stun:stun.l.google.com:19302
DESKTOP_TURN_SERVERS=turn:turn.example.com:3478
```

### Build Configuration
The app uses `electron-builder` for packaging. Configuration is in `package.json`:

```json
{
  "build": {
    "appId": "com.example.voffice.desktop",
    "productName": "VOffice Desktop",
    "mac": {
      "category": "public.app-category.productivity",
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "zip"]
    },
    "linux": {
      "target": ["AppImage", "deb"]
    }
  }
}
```

## 🏗️ Project Structure

```
src/
├── main/                    # Electron main process
│   ├── index.ts            # App entry point
│   ├── tray.ts             # System tray functionality
│   └── ipc-handlers.ts     # IPC communication
├── preload/                # Secure preload script
│   └── index.ts           # API bridge
└── renderer/               # React renderer process
    ├── src/
    │   ├── components/     # UI components
    │   ├── services/       # WebRTC and API services
    │   ├── types/          # TypeScript definitions
    │   └── styles/         # CSS and Tailwind
    └── index.html          # Entry point
```

## 🔒 Security Features

- **Context Isolation** - Renderer cannot access Node.js directly
- **Preload Script** - Only exposes safe APIs via contextBridge
- **CSP Headers** - Content Security Policy for XSS protection
- **Sandbox Mode** - Restricted renderer process
- **No Node Integration** - Disabled in renderer for security

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run dist
```

### Platform-specific Builds
```bash
# macOS only
npm run dist -- --mac

# Windows only
npm run dist -- --win

# Linux only
npm run dist -- --linux
```

## 🐛 Troubleshooting

### Common Issues

1. **Missing Vite React plugin**
   ```bash
   npm install -D @vitejs/plugin-react
   ```

2. **Electron dependencies not built**
   ```bash
   npm run postinstall
   ```

3. **Port conflict on 5173**
   - Set `PORT=5174` then re-run `npm run dev`

4. **macOS app cannot be opened**
   ```bash
   xattr -dr com.apple.quarantine VOffice\ Desktop.app
   ```

5. **Permission denied errors**
   - Grant Screen Recording, Microphone, and Notifications permissions in System Settings

### Debug Mode
```bash
# Enable debug logging
DEBUG=electron* npm run dev
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run dist` - Create installers
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ for the Virtual Office Layer**
