import { SessionStorage, Notify, LocalStorage } from 'quasar'
import Vue from 'vue'
import isEqual from 'lodash/isEqual'
import sortBy from 'lodash/sortBy'

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
function setItems (state, { items, entity }) {
  Vue.set(state, entity, items)
}
function clearItems (state, entity) {
  Vue.set(state, entity, {})
}
function setOfflineFlag (state, flag) {
  Vue.set(state, 'offline', flag)
}
function setToken (state, val) {
  let token = val.replace('FlespiToken ', '')
  if (token === state.token) { return false }
  if (val && token.match(/^[a-z0-9]+$/i)) {
    setToolboxSessionSettings(state, { token })
  } else {
    token = ''
    clearToken(state)
  }
  Vue.connector.token = `FlespiToken ${token}`
  Vue.set(state, 'token', token)
  clearErrors(state)
}
function clearToken (state) {
  setToolboxSessionSettings(state, { token: undefined })
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
  DEV && console.trace()
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
      const submodulesCompare = (accessModules, needModules) => {
        let isEq = true
        isEq = !needModules.some((needModule) => {
          const accessModule = accessModules.find(module => module.name === needModule.name)
          return !accessModule || !isEqual(sortBy(needModule.methods), sortBy(accessModule.methods))
        })
        return isEq
      }
      Vue.set(state.config.platform, 'isDrawable', false)
      const rights = tokenInfo.access.acl.reduce((result, acl) => {
        if (acl.uri === 'gw' || acl.uri === 'storage') {
          if (acl.methods.includes('GET')) {
            let entities = []
            if (acl.uri === 'gw') entities = ['channels', 'calcs', 'intervals', 'plugins', 'devices', 'streams', 'modems', 'protocols']
            if (acl.uri === 'storage') entities = ['containers', 'cdns']
            entities.forEach((entity) => {
              if (result[entity]) { return }
              result[entity] = {
                name: entity,
                methods: ['GET']
              }
            })
            return result
          }
          return result
        }
        const entity = acl.uri.split('/')[1] || acl.uri.split('/')[0]
        result[entity] = acl
        return result
      }, {})
      Object.keys(state.config).forEach((entity) => {
        const entityConfig = state.config[entity]
        if (!entityConfig.acl) { return false }
        const access = entityConfig.acl.reduce((result, req) => {
          const access = rights[req.name]
          if (!access) { return false }
          let grants = result
          if (!access.methods || !isEqual(sortBy(access.methods), sortBy(req.methods))) { grants = false }
          if (access.submodules && !submodulesCompare(access.submodules, req.submodules)) { grants = false }
          return result && grants
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

function getToolboxSettings (state) {
  let settings = LocalStorage.getItem('flespi-toolbox-settings')
  /* migration, remove later 13.12.19 */
  if (!settings) {
    settings = { entities: {} }
    const entities = settings.entities
    const entityNames = ['devices', 'channels', 'calcs', 'intervals', 'plugins', 'streams', 'modems', 'containers', 'cdns', 'tools/hex', 'tools/traffic', 'platform', 'mqtt']
    entityNames.forEach(name => {
      const value = LocalStorage.getItem(name)
      if (value) {
        entities[name] = value
        LocalStorage.remove(name)
      }
    })
  }
  /* end migration */
  settings = { entities: settings.entities }
  state.settings = settings || {}
}

function setToolboxSettings (state, { type, opt, value }) {
  let settings = LocalStorage.getItem('flespi-toolbox-settings') || {}
  switch (type) {
    case 'ENTITY_CHANGE': {
      const { entity } = opt
      if (!settings.entities) { settings.entities = {} }
      settings.entities[entity] = value
      break
    }
  }
  LocalStorage.set('flespi-toolbox-settings', settings)
  settings = { entities: settings.entities }
  state.settings = settings
}

function clearToolboxSettings (state) {
  LocalStorage.remove('flespi-toolbox-settings')
}

function setRegions (state, regions) {
  state.regions = regions
}

function setToolboxSessionSettings (state, data) {
  let sessionSettings = state.sessionSettings
  if (!sessionSettings) { sessionSettings = {} }
  for (const field in data) {
    const value = data[field]
    if (value) {
      Vue.set(sessionSettings, field, value)
    } else {
      Vue.delete(sessionSettings, field)
    }
  }
  Vue.set(state, 'sessionSettings', sessionSettings)
  SessionStorage.set(`toolbox-session-settings[${window.name || 'default'}]`, sessionSettings)
  console.log(data)
  console.trace()
}

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
  clearNotificationCounter,
  getToolboxSettings,
  setToolboxSettings,
  clearToolboxSettings,
  setRegions,
  setToolboxSessionSettings
}
