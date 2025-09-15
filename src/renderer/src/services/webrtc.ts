import SimplePeer from "simple-peer";

export interface WebRTCConfig {
  signalingUrl: string;
  stunServers: string[];
  turnServers: string[];
}

export class WebRTCManager {
  private peer: SimplePeer.Instance | null = null;
  private config: WebRTCConfig;
  private signalingSocket: WebSocket | null = null;

  constructor(config: WebRTCConfig) {
    this.config = config;
  }

  async initializeSignaling(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.signalingSocket = new WebSocket(this.config.signalingUrl);
      
      this.signalingSocket.onopen = () => {
        console.log("Signaling connected");
        resolve();
      };
      
      this.signalingSocket.onerror = (error) => {
        console.error("Signaling error:", error);
        reject(error);
      };
    });
  }

  async createPeerConnection(isInitiator: boolean): Promise<SimplePeer.Instance> {
    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      config: {
        iceServers: [
          ...this.config.stunServers.map(url => ({ urls: url })),
          ...this.config.turnServers.map(url => ({ urls: url }))
        ]
      }
    });

    peer.on("signal", (data) => {
      this.signalingSocket?.send(JSON.stringify({
        type: "signal",
        data
      }));
    });

    peer.on("connect", () => {
      console.log("Peer connected");
    });

    peer.on("stream", (stream) => {
      console.log("Received stream");
    });

    this.peer = peer;
    return peer;
  }

  async startScreenShare(sourceId: string): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId
        } as any
      } as MediaTrackConstraints
    } as any);

    if (this.peer) {
      this.peer.addStream(stream);
    }

    return stream;
  }

  destroy(): void {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    if (this.signalingSocket) {
      this.signalingSocket.close();
      this.signalingSocket = null;
    }
  }
}
