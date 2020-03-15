const createWebSocketPlugin = (socket) => (
  (store) => {
    socket.onopen = () => {
      console.log('[WS]: Connected to WebSocket');
      store.commit('setConnected', true);
    }

    socket.onclose = () => {
      console.log('[WS]: Disconnected from WebSocket');
      store.commit('setConnected', false);
    }
  }
);

export {
  createWebSocketPlugin
};
