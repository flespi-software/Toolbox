import Vue from 'vue'

function setLimit (state, limit) { state.limit = limit }
function setActive (state, active) { state.active = active }
function clearMessages (state) { state.messages = [] }
function setMessages (state, messages) { state.messages = messages }
function setMessagesAppend (state, messages) {
  state.messages.splice(state.messages.length, 0, ...messages)
}
function setMessagesPrepend (state, messages) {
  state.messages.splice(0, 0, ...messages)
}
function setTo (state, to) { state.to = to }
function setFrom (state, from) { state.from = from }
function clean (state) {
  state.messages = []
  state.to = 0
  state.from = 0
  state.active = null
}
function reqStart (state, payload) {
  Vue.$logger.info(`[pluginTraffic]reqStart: ${JSON.stringify(payload)}`)
}
function reqFailed (state, e) {
  Vue.$logger.info(`[pluginTraffic]reqFailed: ${JSON.stringify(e)}`)
}
export default {
  setLimit,
  setActive,
  clearMessages,
  setMessages,
  setMessagesAppend,
  setMessagesPrepend,
  clean,
  setTo,
  setFrom,
  reqFailed,
  reqStart
}
