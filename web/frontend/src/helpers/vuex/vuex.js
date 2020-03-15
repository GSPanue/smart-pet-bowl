const createWebSocketPlugin = (socket) => (
  () => {
    socket.onopen = () => {
      console.log('[WS]: Connected to WebSocket');
    }

    socket.onclose = () => {
      console.log('[WS]: Disconnected from WebSocket');
    }
  }
);

export {
  createWebSocketPlugin
};
