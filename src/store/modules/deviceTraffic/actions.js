import Vue from 'vue'
import get from 'lodash/get'
function getFromTo (val) {
  const now = val || Date.now(),
    from = new Date(now).setHours(0, 0, 0, 0),
    to = from + 86399999.999
  return { from, to }
}
async function initTime ({ state, commit }) {
  let timestamp = Date.now()
  try {
    const resp = await Vue.connector.gw.getDevicesPackets(state.active, { data: { count: 1, reverse: true } })
    timestamp = get(resp, 'data.result[0].timestamp', Math.floor(Date.now() / 1000))
    timestamp = Math.round(timestamp * 1000)
  } catch (e) {}
  const day = getFromTo(timestamp)
  commit('setFrom', day.from)
  commit('setTo', day.to)
}
async function getMessages ({ state, commit }) {
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', true)
  }
  try {
    const now = Date.now()
    const to = state.to > now ? now : state.to
    const resp = await Vue.connector.gw.getDevicesPackets(state.active, { data: { from: state.from / 1000, to: to / 1000, count: state.limit } })
    const messages = get(resp, 'data.result', [])
    commit('setMessages', messages)
  } catch (e) {
    commit('reqFailed', e)
  }
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', false)
  }
}

async function getMessagesTail ({ state, commit }) {
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', true)
  }
  try {
    const now = Date.now()
    const to = state.to > now ? now : state.to
    const resp = await Vue.connector.gw.getDevicesPackets(state.active, { data: { count: state.limit, reverse: true, from: state.from / 1000, to: to / 1000 } })
    const messages = get(resp, 'data.result', [])
    messages.reverse()
    commit('setMessages', messages)
  } catch (e) {
    commit('reqFailed', e)
  }
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', false)
  }
}
let requestStatus = false
async function getMessagesNext ({ state, commit }) {
  if (!state.messages.length || requestStatus || state.messagePolling) { return }
  requestStatus = true
  let messages = []
  try {
    const from = state.messages[state.messages.length - 1].timestamp + 0.000001
    const resp = await Vue.connector.gw.getDevicesPackets(state.active, { data: { count: state.limit, from, to: state.to / 1000 } })
    messages = get(resp, 'data.result', [])
    commit('setMessagesAppend', messages)
  } catch (e) {
    commit('reqFailed', e)
  }
  requestStatus = false
  return messages
}

async function getMessagesPrev ({ state, commit }) {
  if (!state.messages.length || requestStatus) { return }
  requestStatus = true
  let messages = []
  try {
    const to = state.messages[0].timestamp - 0.000001
    const resp = await Vue.connector.gw.getDevicesPackets(state.active, { data: { count: state.limit, from: state.from / 1000, to, reverse: true } })
    messages = get(resp, 'data.result', [])
    messages.reverse()
    commit('setMessagesPrepend', messages)
  } catch (e) {
    commit('reqFailed', e)
  }
  requestStatus = false
  return messages
}
let mesagesPollingId = 0
function pollingGetMessages ({ state, commit }) {
  mesagesPollingId = setInterval(async () => {
    try {
      const from = state.messages[state.messages.length - 1].timestamp + 0.000001
      const to = Math.ceil(Date.now() / 1000)
      const resp = await Vue.connector.gw.getDevicesPackets(state.active, { data: { from, to } })
      const messages = get(resp, 'data.result', [])
      commit('setMessagesAppend', messages)
    } catch (e) {
      commit('reqFailed', e)
    }
  }, 10000)
  state.messagePolling = true
}
function removePollingGetMessages ({ state, commit }) {
  clearInterval(mesagesPollingId)
  mesagesPollingId = 0
  state.messagePolling = false
}
async function getExportData ({ state }, { from, to }) {
  let messages = []
  try {
    const resp = await Vue.connector.gw.getDevicesPackets(state.active, { data: { from, to } })
    messages = get(resp, 'data.result', [])
  } catch (e) {}
  return messages
}
export default {
  initTime,
  getMessages,
  getMessagesTail,
  getMessagesNext,
  getMessagesPrev,
  pollingGetMessages,
  removePollingGetMessages,
  getExportData
}
