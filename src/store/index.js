import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  leftNavState: '/',
  member: JSON.parse(localStorage.getItem("member"))
}

const mutations = {
  setMember(state, params) {
    state.member = JSON.parse(params);
  }
}

export default new Vuex.Store({
  state,
  mutations
})
