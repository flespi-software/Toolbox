import actions from './actions'
import mutations from './mutations'

const state = {
  messages: [],
  active: null,
  limit: 0,
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
