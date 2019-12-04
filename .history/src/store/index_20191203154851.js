import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  leftNavState: '/',
  
},
const username = {
  name: "刘德华"
}

export default new Vuex.Store({
  state,
  username,
})
