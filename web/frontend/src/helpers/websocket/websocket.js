const createWebSocket = () => (
  new WebSocket(process.env.api)
);

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
}

export {
  createWebSocket,
  createWebSocketHandlers
};
