import Vue from 'vue';
import Vuex from 'vuex';

import { createWebSocket, createWebSocketPlugin } from '@/helpers';

Vue.use(Vuex);

const socket = createWebSocket();
const webSocketPlugin = createWebSocketPlugin(socket);

const initialState = () => ({
  device: null,
  pet: null,
  readings: []
});

const store = new Vuex.Store({
  state: initialState,
  getters: {
    getDevice: ({ device }) => (
      device
    ),
    getPet: ({ pet }) => (
      pet
    ),
    getReadings: ({ readings }) => (
      readings
    )
  },
  mutations: {
    setDevice: (store, newDevice) => {
      store.device = newDevice;
    },
    setPet: (store, newPet) => {
      store.pet = newPet;
    },
    setReadings: (store, newReadings) => {
      store.readings = newReadings;
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
