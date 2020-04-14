import { createWebSocket, handleSetConnection, handleSendReading } from '../websocket';
import store from '@/store';

describe('WebSocket Helper', () => {
  describe('createWebSocket', () => {
    it('should create a WebSocket', () => {
      expect(createWebSocket()).toBeObject();
    });
  });

  describe('handleSetConnection', () => {
    it('should set setConnected to true', () => {
      handleSetConnection(store, true);

      expect(store.getters.getConnected).toBeTrue();
    });

    it('should set setConnected to false', () => {
      handleSetConnection(store, false);

      expect(store.getters.getConnected).toBeFalse();
    });
  });

  describe('handleSendReading', () => {
    it('should append the elements in an array to the readings state', () => {
      expect(store.getters.getReadings).toBeEmpty();

      handleSendReading(store, [{}]);

      expect(store.getters.getReadings).toBeArrayOfSize(1);
    });
  });
});
