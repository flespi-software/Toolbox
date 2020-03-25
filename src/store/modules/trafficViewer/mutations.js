function setLimit (state, limit) { state.limit = limit }
function setActive (state, active) { state.active = active }
function clearMessages (state) { state.messages = [] }
function clearDevices (state) { state.devices = [] }
function setDevices (state, devices) { state.devices = devices }
function setMessages (state, messages) { state.messages = messages }
function setMessagesAppend (state, messages) {
  state.messages.splice(state.messages.length, 0, ...messages)
}
function setMessagesPrepend (state, messages) {
  state.messages.splice(0, 0, ...messages)
}
function setTo (state, to) { state.to = to }
function setFrom (state, from) { state.from = from }
function setDeviceFilter (state, filter) { state.deviceFilter = filter }
function setIdent (state, ident) { state.ident = ident }
function clean (state) {
  state.devices = {}
  state.messages = []
  state.to = 0
  state.from = 0
  state.active = null
}
function reqFailed (state, e) {}
export default {
  setLimit,
  setActive,
  clearMessages,
  clearDevices,
  setDevices,
  setMessages,
  setMessagesAppend,
  setMessagesPrepend,
  clean,
  setTo,
  setFrom,
  setDeviceFilter,
  setIdent,
  reqFailed
}
