const createWebSocket = () => (
  new WebSocket(process.env.api)
);

const createWebSocketHandlers = (store, socket) => {
  socket.onopen = () => {
    console.log('[WS]: Connected to WebSocket');
    store.commit('setConnected', true);
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
