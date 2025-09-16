# VOffice Desktop - Project Documentation for Java Developers

## Overview

VOffice Desktop is a **desktop application** built using **Electron** (similar to how JavaFX or Swing works for Java desktop apps) combined with **React** (a JavaScript UI library) and **TypeScript** (JavaScript with static typing, similar to Java's type system).

Think of it as a **hybrid application** where:
- The **main process** (like Java's main method) runs the desktop app logic
- The **renderer process** (like JavaFX Scene) displays the user interface
- **IPC (Inter-Process Communication)** allows them to talk to each other (like Java's event system)

## Architecture Comparison to Java

### Java Desktop App Structure
```
Main Class (main method)
├── UI Components (JavaFX/Swing)
├── Event Handlers
├── Business Logic
└── Data Models
```

### VOffice Desktop Structure
```
Main Process (Node.js/Electron)
├── BrowserWindow (like JavaFX Stage)
├── IPC Handlers (like Event Handlers)
├── Tray Management (like System Tray)
└── Renderer Process (React UI - like JavaFX Scene)
    ├── Components (like JavaFX Controls)
    ├── State Management (like JavaFX Properties)
    └── Event Handling (like JavaFX Event Handlers)
```

## Project Structure Explained

### 1. Root Configuration Files

#### `package.json` (like `pom.xml` or `build.gradle`)
- **Purpose**: Dependency management and build scripts
- **Key sections**:
  - `dependencies`: Runtime libraries (like Maven dependencies)
  - `devDependencies`: Development tools (like Maven dev dependencies)
  - `scripts`: Build commands (like Maven goals)
  - `build`: Electron packaging configuration (like Maven assembly plugin)

#### `tsconfig.json` (like Java compiler settings)
- **Purpose**: TypeScript compiler configuration
- **Key settings**:
  - `target: "ES2022"`: Compile to modern JavaScript (like Java 17+)
  - `strict: true`: Enable strict type checking (like Java's type safety)
  - `jsx: "react-jsx"`: Enable React JSX syntax

#### `electron.vite.config.ts` (like Maven build configuration)
- **Purpose**: Build configuration for Electron + Vite
- **Three build targets**:
  - `main`: Main process (like Java main class)
  - `preload`: Security bridge (like Java security manager)
  - `renderer`: UI process (like JavaFX application)

### 2. Main Process (`src/main/`)

#### `index.ts` (like Java's main method)
```typescript
// Similar to Java's main method
app.whenReady().then(async () => {
  // Initialize app (like JavaFX Application.start())
  await createWindow();
  setupTray();
  registerShortcuts();
});
```

**Key responsibilities**:
- **App lifecycle management** (like JavaFX Application)
- **Window creation** (like JavaFX Stage)
- **System tray integration** (like Java SystemTray)
- **Global shortcuts** (like Java KeyListener)
- **Auto-updater** (like Java WebStart or custom updater)

#### `ipc-handlers.ts` (like Java Event Handlers)
```typescript
// Similar to Java event handling
ipcMain.handle('voffice:system:get-idle-time', () => {
  return powerMonitor.getSystemIdleTime();
});
```

**Key responsibilities**:
- **IPC communication** (like Java's EventBus or Observer pattern)
- **System API access** (like Java's System class)
- **Desktop capture** (like Java's Robot class for screenshots)
- **Notifications** (like Java's SystemTray notifications)

#### `tray.ts` (like Java SystemTray)
```typescript
// Similar to Java's SystemTray
export function buildTrayMenu(opts: TrayOptions) {
  const template: MenuItemConstructorOptions[] = [
    { label: 'Open App', click: () => opts.onOpen() },
    { label: 'Quit', role: 'quit' }
  ];
  return Menu.buildFromTemplate(template);
}
```

### 3. Preload Process (`src/preload/`)

#### `index.ts` (like Java Security Manager)
```typescript
// Similar to Java's security bridge
const electronAPI = {
  getSystemIdleTime: () => ipcRenderer.invoke('voffice:system:get-idle-time'),
  // ... other safe APIs
};
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
```

**Purpose**: Security bridge between main and renderer processes
- **Context isolation**: Prevents direct Node.js access (like Java sandbox)
- **API exposure**: Only safe methods are exposed (like Java's public API)

### 4. Renderer Process (`src/renderer/`)

#### `index.html` (like JavaFX FXML)
```html
<!-- Similar to JavaFX FXML files -->
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

#### `main.tsx` (like JavaFX Application start)
```typescript
// Similar to JavaFX Application.launch()
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
```

#### `App.tsx` (like JavaFX Main Controller)
```typescript
// Similar to JavaFX Controller class
export const App: React.FC = () => {
  const [state, setState] = useState(initialValue); // Like JavaFX Properties
  
  useEffect(() => {
    // Like JavaFX event handlers
  }, []);
  
  return (
    <div>
      {/* Like JavaFX FXML content */}
    </div>
  );
};
```

**Key React concepts for Java developers**:
- **Components**: Like JavaFX Custom Controls
- **State**: Like JavaFX Properties (observable values)
- **Props**: Like constructor parameters
- **useEffect**: Like JavaFX event handlers
- **useState**: Like JavaFX SimpleStringProperty

#### Components (`src/renderer/src/components/`)

##### `ScreenPickerModal.tsx` (like JavaFX Dialog)
```typescript
// Similar to JavaFX Dialog
export const ScreenPickerModal: React.FC<{
  sources: Source[];
  onPick: (sourceId: string) => void;
  onClose: () => void;
}> = ({ sources, onPick, onClose }) => {
  return (
    <div className="modal">
      {/* Modal content */}
    </div>
  );
};
```

##### `SettingsModal.tsx` (like JavaFX Settings Dialog)
```typescript
// Similar to JavaFX Settings Controller
export const SettingsModal: React.FC<{
  isOpen: boolean;
  settings: Settings;
  onSave: (settings: Settings) => void;
}> = ({ isOpen, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  // Like JavaFX form handling
};
```

### 5. Services (`src/renderer/src/services/`)

#### `webrtc.ts` (like Java Service Layer)
```typescript
// Similar to Java Service class
export class WebRTCManager {
  private config: WebRTCConfig;
  
  constructor(config: WebRTCConfig) {
    this.config = config;
  }
  
  async createPeerConnection(): Promise<Record<string, unknown>> {
    // WebRTC logic
  }
}
```

### 6. Types (`src/renderer/src/types/`)

#### `electron.d.ts` (like Java Interface)
```typescript
// Similar to Java interface
declare global {
  interface Window {
    electronAPI: {
      getSystemIdleTime: () => Promise<number>;
      // ... other methods
    };
  }
}
```

## How the Application Runs

### 1. Development Mode (`npm run dev`)

**Step 1: Main Process Starts**
```bash
# Like running Java main method
node dist-electron/main/index.js
```

**Step 2: Renderer Process Starts**
```bash
# Like starting JavaFX application
vite dev server on http://localhost:5173
```

**Step 3: Electron Creates Window**
```typescript
// Like JavaFX Stage creation
mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    preload: getPreloadPath(), // Security bridge
    contextIsolation: true,    // Security
    nodeIntegration: false     // Security
  }
});
```

**Step 4: UI Loads**
```typescript
// Like JavaFX Scene loading
await mainWindow.loadURL('http://localhost:5173');
```

### 2. Production Mode (`npm run build`)

**Step 1: Build All Processes**
```bash
# Like Maven package
electron-vite build
```

**Step 2: Package Application**
```bash
# Like Maven assembly
electron-builder
```

## Key Technologies Explained

### 1. Electron (Desktop Framework)
- **Similar to**: JavaFX, Swing
- **Purpose**: Cross-platform desktop apps using web technologies
- **Architecture**: Multi-process (main + renderer)
- **Security**: Context isolation, preload scripts

### 2. React (UI Library)
- **Similar to**: JavaFX Scene Builder, Swing components
- **Purpose**: Component-based UI development
- **Key concepts**:
  - **Components**: Reusable UI pieces (like JavaFX Custom Controls)
  - **State**: Observable data (like JavaFX Properties)
  - **Props**: Component parameters (like constructor args)
  - **Hooks**: State and lifecycle management (like JavaFX event handlers)

### 3. TypeScript (Typed JavaScript)
- **Similar to**: Java's type system
- **Purpose**: Static typing for JavaScript
- **Key features**:
  - **Interfaces**: Like Java interfaces
  - **Types**: Like Java generics
  - **Enums**: Like Java enums
  - **Strict typing**: Like Java's compile-time type checking

### 4. Vite (Build Tool)
- **Similar to**: Maven, Gradle
- **Purpose**: Fast development server and build tool
- **Features**:
  - **Hot reload**: Like JavaFX Scene Builder live preview
  - **Fast builds**: Like Maven incremental compilation
  - **Module bundling**: Like Maven assembly plugin

### 5. Tailwind CSS (Styling)
- **Similar to**: JavaFX CSS, Swing Look & Feel
- **Purpose**: Utility-first CSS framework
- **Usage**: Like JavaFX CSS classes

## Development Workflow

### 1. Setup (like Maven project setup)
```bash
# Like mvn clean install
npm install
```

### 2. Development (like running JavaFX app)
```bash
# Like mvn javafx:run
npm run dev
```

### 3. Building (like Maven package)
```bash
# Like mvn package
npm run build
```

### 4. Distribution (like Maven assembly)
```bash
# Like mvn assembly:single
npm run dist
```

## Common Patterns

### 1. State Management (like JavaFX Properties)
```typescript
// JavaFX equivalent: SimpleStringProperty
const [presence, setPresence] = useState<"online" | "away">("online");

// JavaFX equivalent: property.addListener()
useEffect(() => {
  // React to state changes
}, [presence]);
```

### 2. Event Handling (like JavaFX Event Handlers)
```typescript
// JavaFX equivalent: setOnAction()
const handleClick = () => {
  setPresence("away");
};

// JavaFX equivalent: button.setOnAction(handleClick)
<button onClick={handleClick}>Toggle Presence</button>
```

### 3. Component Communication (like JavaFX Controller communication)
```typescript
// JavaFX equivalent: Controller injection
<SettingsModal 
  isOpen={showSettings} 
  onClose={() => setShowSettings(false)}
  settings={settings}
  onSave={onSaveSettings}
/>
```

### 4. Async Operations (like Java CompletableFuture)
```typescript
// JavaFX equivalent: Task<Void>
const startHuddle = async () => {
  try {
    await window.electronAPI.showNotification("VOffice", "Huddle started");
  } catch (error) {
    console.error(error);
  }
};
```

## Security Model

### 1. Context Isolation
- **Purpose**: Prevent renderer from accessing Node.js APIs
- **Similar to**: Java Security Manager
- **Implementation**: Preload scripts expose only safe APIs

### 2. IPC Communication
- **Purpose**: Secure communication between processes
- **Similar to**: Java RMI or message passing
- **Pattern**: Request-response with type safety

### 3. Content Security Policy
- **Purpose**: Prevent XSS attacks
- **Similar to**: Java security policies
- **Implementation**: HTML meta tags and Electron security flags

## Testing

### 1. Unit Tests (like JUnit)
```typescript
// Similar to JUnit tests
describe('VOffice Desktop App', () => {
  it('should handle screen capture', () => {
    const mockSources = [{ id: 'screen:0', name: 'Screen 1' }];
    expect(mockSources).toHaveLength(1);
  });
});
```

### 2. Test Configuration
- **Jest**: Like JUnit test runner
- **ts-jest**: Like JUnit with TypeScript support
- **Coverage**: Like JaCoCo coverage reports

## Build and Deployment

### 1. Development Build
```bash
# Like mvn compile
npm run build
```

### 2. Production Package
```bash
# Like mvn package
npm run dist
```

### 3. Platform-specific Builds
- **macOS**: DMG and ZIP files
- **Windows**: NSIS installer and ZIP
- **Linux**: AppImage and DEB packages

## Common Issues and Solutions

### 1. TypeScript Errors
- **Problem**: Type mismatches
- **Solution**: Add proper type annotations (like Java generics)

### 2. ESLint Warnings
- **Problem**: Code style violations
- **Solution**: Follow linting rules (like Checkstyle)

### 3. Build Failures
- **Problem**: Missing dependencies or configuration
- **Solution**: Check package.json and config files (like Maven POM)

### 4. Runtime Errors
- **Problem**: IPC communication failures
- **Solution**: Check preload script and main process handlers

## Conclusion

VOffice Desktop is a modern desktop application that combines the power of web technologies with the security and performance of native desktop apps. For Java developers, it's similar to building a JavaFX application but with:

- **React components** instead of JavaFX controls
- **TypeScript** instead of Java (but with similar type safety)
- **Electron** instead of JavaFX runtime
- **Vite** instead of Maven/Gradle
- **IPC** instead of Java event system

The architecture follows similar patterns to Java desktop applications, making it relatively easy for Java developers to understand and contribute to the project.
