import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const initialState = () => ({
  device: null,
  pet: null
});

const store = new Vuex.Store({
  state: initialState,
  getters: {
    getDevice: ({ device }) => (
      device
    ),
    getPet: ({ pet }) => (
      pet
    )
  },
  mutations: {
    setDevice: (store, newDevice) => {
      store.device = newDevice
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
  }
});

export default store;
