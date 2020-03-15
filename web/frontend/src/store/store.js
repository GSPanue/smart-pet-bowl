import Vue from 'vue';
import Vuex from 'vuex';

import { createWebSocket, createWebSocketPlugin } from '@/helpers';

Vue.use(Vuex);

const socket = createWebSocket();
const webSocketPlugin = createWebSocketPlugin(socket);

const initialState = () => ({
  connected: false,
  device: null,
  pet: null
});

const store = new Vuex.Store({
  state: initialState,
  getters: {
    getConnected: ({ connected }) => (
      connected
    ),
    getDevice: ({ device }) => (
      device
    ),
    getPet: ({ pet }) => (
      pet
    )
  },
  mutations: {
    setConnected: (store, newConnected) => {
      store.connected = newConnected;
    },
    setDevice: (store, newDevice) => {
      store.device = newDevice;
    },
    setPet: (store, newPet) => {
      store.pet = newPet;
    },
    resetStore: (store) => {
      const state = initialState();

      Object.keys(state).forEach((key) => {
        store[key] = state[key]
      });
    }
  },
  actions: {
    sendMessage: (context, message) => {
      socket.send(JSON.stringify(message));
    }
  },
  plugins: [webSocketPlugin]
});

export default store;
