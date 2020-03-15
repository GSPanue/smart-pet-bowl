import Vue from 'vue';
import Vuex from 'vuex';

import { createWebSocket, createWebSocketHandlers } from '@/helpers';

Vue.use(Vuex);

let webSocket = null;
let webSocketHandlers = null;

const initialState = () => ({
  fetched: false,
  connected: false,
  device: null,
  pet: null,
  readings: []
});

const store = new Vuex.Store({
  state: initialState,
  getters: {
    getFetched: ({ fetched }) => (
      fetched
    ),
    getConnected: ({ connected }) => (
      connected
    ),
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
    setFetched: (store, newFetched) => {
      store.fetched = newFetched;
    },
    setConnected: (store, newConnected) => {
      store.connected = newConnected;
    },
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
    createWebSocket: (context) => {
      webSocket = createWebSocket();
      webSocketHandlers = createWebSocketHandlers(context, webSocket);
    },
    destroyWebSocket: () => {
      webSocket.close();

      webSocket = null;
      webSocketHandlers = null;
    },
    sendMessage: (context, message) => {
      socket.send(JSON.stringify(message));
    }
  }
});

export default store;
