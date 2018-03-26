import Vue from 'vue'
import Vuex from 'vuex'
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

const store = new Vuex.Store(
  {
    state,
    actions,
    mutations
  }
)

export default store
