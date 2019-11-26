import { SessionStorage, Notify } from 'quasar'
import Vue from 'vue'

function reqStart (state) {
  if (DEV) {
    console.log('Start Request')
  }
}
function reqFailed (state, payload) {
  if (DEV) {
    console.log('Failed Request')
    console.log(payload)
  }
  if (payload.response && payload.response.status) {
    switch (payload.response.status) {
      case 0: {
        setOfflineFlag(state, true)
        Vue.set(state, 'token', '')
        break
      }
      case 401: {
        clearToken(state)
        break
      }
      default: {
        if (DEV) {
          console.log(`${payload.status} - ${payload.statusText}`)
        }
        if (payload.response.data && payload.response.data.errors && payload.response.data.errors.length) {
          payload.response.data.errors.forEach((e) => { addError(state, e.reason) })
        }
      }
    }
  } else {
    addError(state, payload.message)
    if (
      payload.code === 2 ||
      payload.code === 134 ||
      payload.code === 135
    ) { clearToken(state) }
  }
}
function deleteItem (state, { id, mode, source }) {
  if (mode) {
    Vue.delete(source, id)
  } else {
    Vue.set(source[id], 'deleted', true)
  }
}
function setItems (state, items) {
  Vue.set(state, 'items', items)
}
function clearItems (state) {
  Vue.set(state, 'items', {})
}
function setOfflineFlag (state, flag) {
  Vue.set(state, 'offline', flag)
}
function setToken (state, val) {
  let token = val.replace('FlespiToken ', '')
  if (token === state.token) { return false }
  if (val && token.match(/^[a-z0-9]+$/i)) {
    SessionStorage.set(`toolbox-token[${window.name || 'default'}]`, token)
  } else {
    token = ''
    clearToken(state)
  }
  Vue.connector.token = `FlespiToken ${token}`
  Vue.set(state, 'token', token)
  clearErrors(state)
}
function clearToken (state) {
  SessionStorage.remove(`toolbox-token[${window.name || 'default'}]`)
  Vue.connector.token = ''
  Vue.set(state, 'token', '')
  clearTokenInfo(state)
  Object.keys(state.config).forEach((entity) => {
    Vue.set(state.config[entity], 'isDrawable', false)
  })
}

function setConfig (state, config) {
  Vue.set(state, 'config', config)
}

function addError (state, message) {
  if (!state.token) { return false }
  console.trace()
  Notify.create({
    type: 'negative',
    icon: 'warning',
    message: `${message}`,
    timeout: 1000
  })
  state.newNotificationCounter++
  state.errors.push(message)
}

function clearErrors (state) {
  state.errors = []
}

function setTokenInfo (state, tokenInfo) {
  Vue.set(state, 'tokenInfo', tokenInfo)

  switch (tokenInfo.access.type) {
    // standart token
    case 0: {
      Object.keys(state.config).forEach((entity) => {
        if (entity === 'platform') { return false }
        Vue.set(state.config[entity], 'isDrawable', true)
      })
      break
    }
    // master
    case 1: {
      Object.keys(state.config).forEach((entity) => {
        Vue.set(state.config[entity], 'isDrawable', true)
      })
      break
    }
    // acl
    case 2: {
      Vue.set(state.config.platform, 'isDrawable', false)
      let rights = tokenInfo.access.acl.reduce((result, acl) => {
        if (acl.uri === 'gw') {
          if (acl.methods.includes('GET')) {
            return [...result, 'channels', 'calcs', 'devices', 'streams', 'modems', 'protocols']
          }
          return result
        }
        if (acl.uri === 'storage') {
          if (acl.methods.includes('GET')) {
            return [...result, 'containers', 'cdns']
          }
          return result
        }
        let entity = acl.uri.split('/')[1] || acl.uri.split('/')[0]
        if (!result.includes(entity) && (!acl.methods || (acl.methods && acl.methods.includes('GET')))) {
          result.push(entity)
        }
        return result
      }, [])
      Object.keys(state.config).forEach((entity) => {
        let entityConfig = state.config[entity]
        if (!entityConfig.acl) { return false }
        let access = entityConfig.acl.reduce((result, req) => {
          return result && rights.includes(req)
        }, true)
        if (access) {
          Vue.set(state.config[entity], 'isDrawable', true)
        }
      })
      break
    }
  }
}

function clearTokenInfo (state) {
  state.tokenInfo = null
}

function setSocketOffline (state, flag) {
  Vue.set(state, 'socketOffline', flag)
}

function clearNotificationCounter (state) { state.newNotificationCounter = 0 }

export default {
  reqStart,
  setItems,
  deleteItem,
  reqFailed,
  setToken,
  clearToken,
  setOfflineFlag,
  clearItems,
  setConfig,
  addError,
  clearErrors,
  setTokenInfo,
  clearTokenInfo,
  setSocketOffline,
  clearNotificationCounter
}
