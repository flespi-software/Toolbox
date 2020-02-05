import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import config from '../config.js'

Vue.use(Vuex)

let state = {
  token: '',
  settings: {},
  offline: false,
  socketOffline: false,
  isLoading: false,
  config: JSON.parse(JSON.stringify(config)),
  errors: [],
  tokenInfo: null,
  regions: null,
  currentRegion: null,
  newNotificationCounter: 0
}

const store = new Vuex.Store(
  {
    state,
    actions,
    mutations
  }
)

export default store
