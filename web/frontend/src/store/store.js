import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    device: null,
    pet: null
  },
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
    }
  }
});

export default store;
