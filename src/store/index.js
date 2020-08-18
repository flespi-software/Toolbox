import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import config from '../config.js'
import { SessionStorage } from 'quasar'

const sessionSettings = SessionStorage.getItem(`toolbox-session-settings[${window.name || 'default'}]`)

Vue.use(Vuex)

const state = {
  token: '',
  settings: {},
  offline: false,
  socketOffline: false,
  isLoading: false,
  config: JSON.parse(JSON.stringify(config)),
  errors: [],
  tokenInfo: null,
  regions: null,
  newNotificationCounter: 0,
  sessionSettings
}

const store = new Vuex.Store(
  {
    state,
    actions,
    mutations
  }
)

export default store
