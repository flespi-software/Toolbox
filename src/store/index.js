import Vuex from 'vuex'
import Vue from 'vue'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

let state = {
  token: '',
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
