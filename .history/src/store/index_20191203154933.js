import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  leftNavState: '/',
  name: "刘德华"
}

export default new Vuex.Store({
  state,
  name,
})
