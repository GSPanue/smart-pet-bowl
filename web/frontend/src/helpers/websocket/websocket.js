import { sortByDate } from '@/helpers';

const createWebSocket = () => (
  new WebSocket(process.env.api)
);

const handleSetConnection = (store, message) => {
  store.commit('setConnected', message);
};

const handleSendReading = (store, message) => {
  const currentReadings = store.state.readings;

  store.commit('setReadings', sortByDate([
    ...currentReadings,
    ...message
  ]));
};

const createWebSocketHandlers = (store, socket) => {
  socket.onopen = () => {
    console.log('[WS]: Connected to WebSocket');

    const deviceId = store.state.device.id;

    console.log('[WS]: Sent message with action `setConnection`');
    socket.send(JSON.stringify({
      action: 'setConnection',
      message: deviceId
    }));
  }

  socket.onclose = () => {
    console.log('[WS]: Disconnected from WebSocket');
    store.commit('setConnected', false);
  }

  socket.onmessage = ({ data }) => {
    const { action, message } = JSON.parse(data);

    console.log(`[WS]: Received message with action \`${action}\``);

    switch (action) {
      case 'setConnection':
        handleSetConnection(store, message);
        break;
      case 'sendReading':
        handleSendReading(store, message);
        break;
    }
  }
};

export {
  createWebSocket,
  handleSetConnection,
  handleSendReading,
  createWebSocketHandlers
};
