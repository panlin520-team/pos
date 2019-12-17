import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  leftNavState: '/',
  fold: true,
  member: JSON.parse(localStorage.getItem("member")),
  trueName: localStorage.getItem('trueName'),
  storeName: localStorage.getItem('storeName')
}

const mutations = {
  setFold(state, bool) {
    state.fold = bool;
  },
  setMember(state, params) {
    state.member = JSON.parse(params);
  },
  setTrueName(state, name) {
    state.trueName = name;
  },
  setStoreName(state, name) {
    state.storeName = name;
  }
}

export default new Vuex.Store({
  state,
  mutations
})
