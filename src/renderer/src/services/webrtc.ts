export interface WebRTCConfig {
  signalingUrl: string;
  stunServers: string[];
  turnServers: string[];
}

export class WebRTCManager {
  private config: WebRTCConfig;

  constructor(config: WebRTCConfig) {
    this.config = config;
    console.log('WebRTCManager initialized with config:', config);
  }

  async initializeSignaling(): Promise<void> {
    console.log('Initializing signaling (mock)');
    return Promise.resolve();
  }

  async createPeerConnection(isInitiator: boolean): Promise<any> {
    console.log('Creating peer connection (mock)');
    return Promise.resolve({});
  }

  async startScreenShare(sourceId: string): Promise<MediaStream> {
    console.log('Starting screen share (mock)');
    throw new Error('Screen sharing not available in mock mode');
  }

  destroy(): void {
    console.log('Destroying WebRTC manager (mock)');
  }
}
