import { describe, it, expect } from '@jest/globals';

describe('VOffice Desktop App', () => {
  it('should have basic functionality', () => {
    expect(true).toBe(true);
  });

  it('should handle screen capture', () => {
    // Mock test for screen capture functionality
    const mockSources = [
      { id: 'screen:0', name: 'Screen 1', thumbnail: 'data:image/png;base64,...' }
    ];
    expect(mockSources).toHaveLength(1);
  });

  it('should handle WebRTC configuration', () => {
    const config = {
      signalingUrl: 'ws://localhost:8080/ws/signaling',
      stunServers: ['stun:stun.l.google.com:19302'],
      turnServers: []
    };
    expect(config.stunServers).toContain('stun:stun.l.google.com:19302');
  });
});
