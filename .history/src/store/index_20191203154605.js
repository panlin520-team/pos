import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  leftNavState: '/'
},
const username = {
  name: ""
}

export default new Vuex.Store({
  state
})
