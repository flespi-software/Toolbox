import actions from './actions'
import mutations from './mutations'

const state = {
  devices: {},
  messages: [],
  active: null,
  ident: null,
  limit: 0,
  deviceFilter: '',
  from: 0,
  to: 0,
  isLoading: false,
  realtimeEnabled: false,
  messagePolling: false
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
