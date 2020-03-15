const createWebSocket = () => (
  new WebSocket(process.env.api)
);

const handleSetConnection = (store, message) => {
  store.commit('setConnected', message);
};

const createWebSocketHandlers = (store, socket) => {
  socket.onopen = () => {
    console.log('[WS]: Connected to WebSocket');

    const deviceId = store.state.device.id;

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

    console.log(`[WS]: Received message for action \`${action}\``);

    switch (action) {
      case 'setConnection':
        handleSetConnection(store, message);
        break;
    }
  }
};

export {
  createWebSocket,
  createWebSocketHandlers
};
