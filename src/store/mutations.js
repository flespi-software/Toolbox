import { SessionStorage, Notify } from 'quasar'
import Vue from 'vue'
import config from '../config.json'

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
    if (payload.code === 2) { clearToken(state) }
  }
}
function deleteItem (state, id) {
  let existedIndex = -1
  state.items.forEach((existItem, index) => {
    if (existItem.id === id) { existedIndex = index }
  })
  Vue.set(state.items[existedIndex], 'deleted', true)
  // state.items.splice(existedIndex, 1)
}
function setItems (state, items) {
  Vue.set(state, 'items', items)
}
function clearItems (state) {
  Vue.set(state, 'items', [])
}
function setOfflineFlag (state, flag) {
  Vue.set(state, 'offline', flag)
}
function setToken (state, val) {
  let token = val.replace('FlespiToken ', '')
  if (token === state.token) { return false }
  if (val && token.match(/^[a-z0-9]+$/i)) {
    SessionStorage.set('toolbox-token', token)
  } else {
    token = ''
    clearToken(state)
  }
  Vue.connector.token = `FlespiToken ${token}`
  Vue.set(state, 'token', token)
  clearErrors(state)
}
function clearToken (state) {
  SessionStorage.remove('toolbox-token')
  Vue.connector.token = ''
  Vue.set(state, 'token', '')
  clearTokenInfo(state)
  setConfig(state, config)
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
      Vue.set(state.config.platform, 'isDrawable', false)
      break
    }
    // master
    case 1: {
      break
    }
    // acl
    case 2: {
      Vue.set(state.config.platform, 'isDrawable', false)
      let rights = tokenInfo.access.acl.reduce((result, acl) => {
        if (acl.uri === 'gw') {
          if (acl.methods.includes('GET')) {
            return [...result, 'channels', 'devices', 'streams', 'modems', 'protocols']
          }
          return result
        }
        if (acl.uri === 'storage') {
          if (acl.methods.includes('GET')) {
            return [...result, 'containers', 'abques', 'cdns']
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
        if (!access) {
          state.config[entity].isDrawable = false
        }
      })
      break
    }
  }
}

function clearTokenInfo (state) {
  state.tokenInfo = {}
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
