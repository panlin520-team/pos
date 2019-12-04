import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  leftNavState: '/',
  username: "",

},


export default new Vuex.Store({
  state,
  store
})
