import Vuex from 'vuex'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

let state = {
  token: '',
  server: Vue.config.flespiServer,
  items: [],
  offline: false,
  isCustomer: false,
  isLoading: false
}

export default new Vuex.Store(
  {
    state,
    actions,
    mutations
  }
)
