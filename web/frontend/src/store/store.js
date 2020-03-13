import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    pet: null
  },
  getters: {
    getPet: ({ pet }) => (
      pet
    )
  },
  mutations: {
    setPet: (store, newPet) => {
      store.pet = newPet;
    }
  }
});

export default store;
