import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  leftNavState: '/',
},


export default new Vuex.Store({
  state,
  storestate: {
    username: "",
  },
  mutations: {
    setUser: (storestate,name) =>{
      storestate.username = name
    }
  }
  
})
console.log();
