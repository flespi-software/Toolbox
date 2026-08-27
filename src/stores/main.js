/*
 * The Vuex root module of the Vue 2 build. Mutations and actions are one flat list of actions here,
 * and they keep their old names so that every call site maps one to one onto the previous
 * `commit`/`dispatch`.
 */
import { defineStore } from 'pinia'
import { SessionStorage, Notify, LocalStorage } from 'quasar'
import isEqual from 'lodash/isEqual'
import intersection from 'lodash/intersection'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import settingsStorage from 'src/infrastructure/settingsStorage'
import logger from 'src/infrastructure/appLogger'
import { connector, endpoints } from 'src/services/connector'
import config from 'src/config'

const origins = {
    devices: '/gw/devices/:id',
    channels: '/gw/channels/:id',
    calcs: '/gw/calcs/:id',
    geofences: '/gw/geofences/:id',
    plugins: '/gw/plugins/:id',
    groups: '/gw/groups/:id',
    streams: '/gw/streams/:id',
    modems: '/gw/modems/:id',
    assets: '/gw/assets/:id',
    webhooks: '/platform/webhooks/:id',
    grants: '/platform/grants/:id',
    realms: '/platform/realms/:id',
    containers: '/storage/containers/:id',
    cdns: '/storage/cdns/:id',
    agents: '/ai/agents/:id',
    connectors: '/ai/connectors/:id',
    tasks: '/gw/calcs/:calc/devices/:device',
    subaccounts: '/platform/subaccounts/:id'
  },
  basicEntitiesFields = {
    devices: ['id', 'name', 'deleted', 'configuration'],
    channels: ['id', 'name', 'deleted', 'protocol_id', 'uri'],
    calcs: ['id', 'name', 'deleted', 'counters', 'selectors', 'messages_source'],
    geofences: ['id', 'name', 'deleted'],
    plugins: ['id', 'name', 'deleted'],
    groups: ['id', 'name', 'deleted'],
    streams: ['id', 'name', 'deleted', 'configuration', 'protocol_id'],
    webhooks: ['id', 'name', 'deleted', 'configuration'],
    grants: ['id', 'name', 'deleted'],
    realms: ['id', 'name', 'deleted'],
    modems: ['id', 'name', 'deleted', 'configuration'],
    assets: ['id', 'name', 'deleted'],
    containers: ['id', 'name', 'deleted'],
    cdns: ['id', 'name', 'deleted'],
    agents: ['id', 'name', 'deleted', 'enabled', 'status', 'title'],
    connectors: ['id', 'name', 'deleted', 'enabled', 'type_id'],
    tasks: ['device_id', 'calc_id'],
    subaccounts: ['id', 'name', 'deleted']
  },
  GET_ITEMS_MODE_OBJECT = 0,
  GET_ITEMS_MODE_FIELDS = 1

const itemTypes = { // enum index base/src/libstate/state.h:49
  devices: 11,
  channels: 9,
  groups: 31,
  streams: 12,
  calcs: 13,
  geofences: 40,
  plugins: 25,
  modems: 10,
  assets: 41,
  webhooks: 36,
  grants: 37,
  realms: 29,
  containers: 6,
  cdns: 7
}

function getParams (payload) {
  let entity = '',
    id = null,
    mode = GET_ITEMS_MODE_OBJECT
  if (typeof payload === 'string') {
    entity = payload
  } else {
    entity = payload.entity
    if (payload.id) {
      id = payload.id
    }
    if (payload.mode) {
      mode = payload.mode
    }
  }
  return { id, mode, entity }
}

function getOriginBase (entity, id) {
  let base = `flespi/state${origins[entity]}`
  if ((id && typeof id !== 'object') || !id) { id = { id } }
  base = base.replace(/:(\w+)/g, (_, name) => {
    return id[name] || '+'
  })
  return base
}

/* settings that do not survive a reload are still better than an interface that does not start */
function isSettingsObject (settings) {
  return !!settings && typeof settings === 'object' && !Array.isArray(settings)
}

export const useMainStore = defineStore('main', {
  state: () => ({
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
    logsObject: undefined,
    sessionSettings: SessionStorage.getItem(`toolbox-session-settings[${window.name || 'default'}]`)
  }),

  actions: {
    /* ------------------------------------------------------------------ mutations */
    reqStart (params) {
      logger.info(`reqStart: ${JSON.stringify(params)}`)
    },

    reqFailed (payload) {
      logger.info(`reqFailed: ${JSON.stringify(payload)}`)
      if (payload.response && payload.response.status) {
        switch (payload.response.status) {
          case 0: {
            this.setOfflineFlag(true)
            this.token = ''
            break
          }
          case 401: {
            this.clearToken()
            break
          }
          default: {
            if (DEV) {
              console.log(`${payload.status} - ${payload.statusText}`)
            }
            if (payload.response.data && payload.response.data.errors && payload.response.data.errors.length) {
              payload.response.data.errors.forEach((e) => { this.addError(e.reason) })
            }
          }
        }
      } else {
        this.addError(payload.message)
        if (
          payload.code === 2 ||
          payload.code === 134 ||
          payload.code === 135
        ) { this.clearToken() }
      }
    },

    deleteItem ({ id, mode, source }) {
      if (mode) {
        delete source[id]
      } else if (source[id]) {
        source[id].deleted = true
      }
      logger.info(`deleteItem: ${JSON.stringify({ id, mode, source })}`)
    },

    setItems ({ items, entity }) {
      this[entity] = items
    },

    clearItems (entity) {
      this[entity] = {}
    },

    setOfflineFlag (flag) {
      this.offline = flag
    },

    setToken (val) {
      let token = val.replace('FlespiToken ', '')
      if (token === this.token) { return false }
      if (val && token.match(/^[a-z0-9]+$/i)) {
        this.setToolboxSessionSettings({ token })
      } else {
        token = ''
        this.clearToken()
      }
      connector.token = `FlespiToken ${token}`
      this.token = token
      this.clearErrors()
      logger.info(`setToken: ${val}`)
    },

    clearToken () {
      this.setToolboxSessionSettings({ token: undefined })
      connector.token = ''
      this.token = ''
      this.clearTokenInfo()
      Object.keys(this.config).forEach((entity) => {
        this.config[entity].isDrawable = false
      })
      logger.info('clearToken')
    },

    setConfig (config) {
      this.config = config
    },

    addError (message) {
      if (!this.token) { return false }
      DEV && console.trace()
      Notify.create({
        type: 'negative',
        icon: 'warning',
        message: `${message}`,
        timeout: 1000
      })
      this.newNotificationCounter++
      this.errors.push(message)
      logger.info(message)
    },

    clearErrors () {
      this.errors = []
    },

    setTokenInfo (tokenInfo) {
      this.tokenInfo = tokenInfo

      logger.info(`tokenInfo: ${JSON.stringify(tokenInfo)}`)

      switch (tokenInfo.access.type) {
        // standart token
        case 0: {
          Object.keys(this.config).forEach((entity) => {
            if (entity === 'platform') { return false }
            this.config[entity].isDrawable = true
          })
          break
        }
        // master
        case 1: {
          Object.keys(this.config).forEach((entity) => {
            this.config[entity].isDrawable = true
          })
          break
        }
        // acl
        case 2: {
          const submodulesCompare = (accessModules, needModules) => {
            let isEq = true
            isEq = !needModules.some((needModule) => {
              const accessModule = accessModules.find(module => module.name === needModule.name)
              return !accessModule || !isEqual(sortBy(intersection(needModule.methods, accessModule.methods)), sortBy(needModule.methods))
            })
            return isEq
          }
          this.config.platform.isDrawable = false
          const rights = tokenInfo.access.acl.reduce((result, acl) => {
            if (acl.uri === 'gw' || acl.uri === 'storage') {
              if (acl.methods.includes('GET')) {
                let entities = []
                if (acl.uri === 'gw') entities = ['channels', 'calcs', 'intervals', 'geofences', 'plugins', 'devices', 'groups', 'streams', 'modems', 'assets', 'protocols']
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
          Object.keys(this.config).forEach((entity) => {
            const entityConfig = this.config[entity]
            if (!entityConfig.acl) { return false }
            const access = entityConfig.acl.reduce((result, req) => {
              const access = rights[req.name]
              if (!access) { return false }
              let grants = result
              if (!access.methods || !isEqual(sortBy(intersection(access.methods, req.methods)), sortBy(req.methods))) { grants = false }
              if (access.submodules && !submodulesCompare(access.submodules, req.submodules)) { grants = false }
              return result && grants
            }, true)
            if (access) {
              this.config[entity].isDrawable = true
            }
          })
          break
        }
      }
    },

    clearTokenInfo () {
      this.tokenInfo = null
    },

    setSocketOffline (flag) {
      this.socketOffline = flag
    },

    clearNotificationCounter () {
      this.newNotificationCounter = 0
    },

    getToolboxSettings () {
      let settings = settingsStorage.getItem('flespi-toolbox-settings')
      if (!isSettingsObject(settings)) { settings = null }
      /* migration, remove later 13.12.19 */
      if (!settings) {
        settings = { entities: {} }
        const entities = settings.entities
        const entityNames = ['devices', 'channels', 'calcs', 'intervals', 'geofences', 'plugins', 'groups', 'streams', 'modems', 'assets', 'containers', 'cdns', 'tools/hex', 'tools/traffic', 'platform', 'mqtt', 'webhooks', 'grants', 'realms']
        entityNames.forEach(name => {
          try {
            const value = LocalStorage.getItem(name)
            if (value) {
              entities[name] = value
              LocalStorage.remove(name)
            }
          } catch (e) {
            /* a value quasar cannot parse is a value we cannot migrate */
          }
        })
      }
      /* end migration */
      settings = { entities: settings.entities, viewSettings: settings.viewSettings }
      this.settings = settings || {}
      logger.info(`getToolboxSettings: ${JSON.stringify(settings)}`)
    },

    setToolboxSettings ({ type, opt, value }) {
      let settings = settingsStorage.getItem('flespi-toolbox-settings')
      if (!isSettingsObject(settings)) {
        settings = {}
      }
      switch (type) {
        case 'ENTITY_CHANGE': {
          const { entity } = opt
          if (!settings.entities) { settings.entities = {} }
          settings.entities[entity] = value
          break
        }
        case 'ENTITY_VIEW_SETTINGS_CHANGE': {
          const { entity } = opt
          if (!settings.viewSettings) { settings.viewSettings = {} }
          settings.viewSettings[entity] = { ...(settings.viewSettings[entity] || {}), ...value }
          break
        }
      }
      settingsStorage.set('flespi-toolbox-settings', settings)
      settings = { entities: settings.entities, viewSettings: settings.viewSettings }
      this.settings = settings
      logger.info(`setToolboxSettings: ${JSON.stringify(settings)}`)
    },

    clearToolboxSettings () {
      settingsStorage.clear()
    },

    setRegions (regions) {
      this.regions = regions
    },

    setToolboxSessionSettings (data) {
      let sessionSettings = this.sessionSettings
      if (!sessionSettings) { sessionSettings = {} }
      for (const field in data) {
        const value = data[field]
        if (value) {
          sessionSettings[field] = value
        } else {
          delete sessionSettings[field]
        }
      }
      this.sessionSettings = sessionSettings
      logger.info(`setToolboxSessionSettings: ${JSON.stringify(sessionSettings)}`)
      SessionStorage.set(`toolbox-session-settings[${window.name || 'default'}]`, sessionSettings)
    },

    setLogsObject (logsObject) {
      this.logsObject = logsObject
    },

    /* ------------------------------------------------------------------ actions */
    async getItems (payload) {
      const { id, mode, entity } = getParams(payload)
      const originBase = getOriginBase(entity, id)
      const writePath = entity
      if (!this[writePath]) { this[writePath] = {} }
      if (entity) {
        let origin = ''
        if (mode === GET_ITEMS_MODE_FIELDS) {
          if (!basicEntitiesFields[entity]) { return false }
          origin = `${originBase}/${basicEntitiesFields[entity].join(',')}`
        } else {
          origin = `${originBase}/${id || '+'}`
        }
        if (this.token) {
          try {
            // init getting channels-protocols name
            if (entity === 'channels' && !this.channelsProtocols) {
              const protocolsResp = await connector.gw.getChannelProtocols('all', { fields: 'name,id,features' })
              this.reqStart({ endpoint: 'getChannelProtocols', ids: 'all', data: { fields: 'name,id,features' } })
              this.channelsProtocols = protocolsResp.data.result.reduce((result, protocol) => {
                result[protocol.id] = protocol
                return result
              }, {})
            }
            // init getting streams-protocols name
            if (entity === 'streams' && !this.streamsProtocols) {
              const protocolsResp = await connector.gw.getStreamProtocols('all', { fields: 'name,id' })
              this.reqStart({ endpoint: 'getStreamProtocols' })
              this.streamsProtocols = protocolsResp.data.result.reduce((result, protocol) => {
                result[protocol.id] = protocol
                return result
              }, {})
            }
            const items = {}
            const partsOfTopicFilter = origin.split('/').reverse().slice(1)
            const objectModeHandler = (value, topic, packet, subsIds) => {
              const partsOfTopic = topic.split('/').reverse(),
                idsParts = partsOfTopicFilter.reduce((ids, part, index) => {
                  if (part === '+') {
                    ids.push(partsOfTopic[index])
                  }
                  return ids
                }, []).reverse(),
                id = idsParts.length <= 1 ? parseInt(partsOfTopic.shift()) : idsParts.join('-'),
                source = subsIds ? this[writePath] : items

              if (value.length) {
                source[id] = JSON.parse(value.toString())
              } else {
                this.deleteItem({ id, mode: entity === 'tasks', source })
              }
            }
            const fieldModeHandler = (value, topic, packet, subsIds) => {
              const partsOfTopic = topic.split('/').reverse(),
                name = partsOfTopic.shift(),
                idsParts = partsOfTopicFilter.reduce((ids, part, index) => {
                  if (part === '+') {
                    ids.push(partsOfTopic[index])
                  }
                  return ids
                }, []).reverse(),
                id = idsParts.length === 0 ? parseInt(partsOfTopic.shift()) : idsParts.join('-'),
                source = subsIds ? this[writePath] : items
              if (name === 'deleted') {
                this.deleteItem({ id, mode: entity === 'tasks', source })
                return false
              }
              /* skeep empty messages */
              if (!value.length) {
                return false
              }

              if (source[id]) {
                source[id][name] = JSON.parse(value.toString())
              } else {
                source[id] = { id: id, [name]: JSON.parse(value.toString()) }
              }
            }
            let subsIds = null
            const params = {
              name: origin,
              handler: mode === GET_ITEMS_MODE_OBJECT
                ? (value, topic, packet) => objectModeHandler(value, topic, packet, subsIds)
                : (value, topic, packet) => fieldModeHandler(value, topic, packet, subsIds)
            }
            subsIds = await connector.socket.subscribe(params)
            logger.info(`subscribe: ${JSON.stringify(params)}`)
            this[writePath] = items
            return subsIds
          } catch (e) {
            this.reqFailed(e)
            this.setItems({ items: {}, entity })
          }
        }
      }
    },

    async unsubscribeItems (payload) {
      const { id, mode, entity } = getParams(payload)
      const originBase = getOriginBase(entity, id)
      if (entity) {
        let origin = ''
        if (mode === GET_ITEMS_MODE_FIELDS) {
          if (!basicEntitiesFields[entity]) { return false }
          origin = `${originBase}/${basicEntitiesFields[entity].join(',')}`
        } else {
          origin = `${originBase}/${id || '+'}`
        }
        try {
          logger.info(`unsubscribe: ${origin}`)
          return await connector.socket.unsubscribe(origin)
        } catch (e) {
          this.reqFailed(e)
        }
      }
    },

    async getEntities (payload) {
      this.isLoading = true
      const res = await Promise.all(payload.map(config => this.getItems(config)))
      this.isLoading = false
      return res
    },

    async removeEntities (payload) {
      this.isLoading = true
      const res = await Promise.all(payload.map(config => {
        const { entity } = getParams(payload)
        delete this[entity]
        this.unsubscribeItems(config)
      }))
      this.isLoading = false
      return res
    },

    async getDeleted (entity) {
      if (entity) {
        if (this.token) {
          try {
            this.isLoading = true
            let deleted = []
            if (this.tokenInfo.access.type === 1) {
              try {
                const deletedResp = await connector.platform.getDeleted(
                  `type=${itemTypes[entity]}`,
                  { fields: 'data' }
                )
                this.reqStart({ endpoint: 'getDeleted', type: `type=${itemTypes[entity]}` })
                const deletedData = deletedResp.data
                if (deletedData.errors) {
                  deletedData.errors.forEach((error) => {
                    this.addError(error.reason)
                  })
                }
                deleted = deletedData.result
              } catch (e) {
                this.addError(e.message)
              }
            }
            if (!deleted.length) {
              Notify.create({
                message: `No deleted ${entity} found.`,
                color: 'warning',
                classes: 'text-center',
                icon: 'mdi-alert-octagon-outline',
                timeout: 1000
              })
            }
            const result = {
              ...this[entity],
              ...deleted.reduce((deleted, item) => {
                if (item.data) {
                  const itemObj = item.data
                  itemObj.deleted = true
                  deleted[itemObj.id] = itemObj
                }
                return deleted
              }, {})
            }
            this.setItems({ items: result, entity })
            this.isLoading = false
          } catch (e) {
            this.reqFailed(e)
            this.setItems({ items: {}, entity })
            this.isLoading = false
          }
        }
      }
    },

    async checkConnection () {
      if (!DEV) {
        return false
      }
      try {
        const resp = await connector.http.external.get(`./icons/favicon-16x16.png?_=${(new Date()).getTime()}`)
        if (resp.status === 200 && this.offline) {
          this.setOfflineFlag(false)
        }
      } catch (e) {
        if (DEV) {
          console.log(e)
        }
        if (!this.offline) {
          this.setOfflineFlag(true)
        }
      }
    },

    async getRegions () {
      try {
        this.isLoading = true
        const resp = await connector.http.get('/auth/regions')
        let regions = get(resp, 'data.result', [])
        let currentRegion = null
        regions = regions.reduce((regions, region) => {
          if (region.default) {
            currentRegion = region
          }
          regions[region.name] = region
          return regions
        }, {})
        currentRegion && this.setToolboxSessionSettings({ region: currentRegion })
        this.setRegions(regions)
      } catch (e) {
        this.reqFailed(e)
        this.isLoading = false
      }
    },

    async initConnection ({ region, token }) {
      try {
        this.isLoading = true
        if (!this.regions) {
          await this.getRegions()
        }
        if (region) {
          this.setToolboxSessionSettings({ region })
        }
        const currentRegion = this.sessionSettings.region
        endpoints.server = currentRegion.rest
        endpoints.socketServer = `wss://${currentRegion['mqtt-ws']}`
        endpoints.cdn = currentRegion.cdn
        connector.setRegion(currentRegion)
        this.setToken(token)
      } catch (e) {
        this.reqFailed(e)
        this.isLoading = false
      }
    },

    async initLogsObject () {
      try {
        this.isLoading = true
        const logsObjectReq = await connector.http.external(`${endpoints.server}/const/values?names=toolbox%2Fcodes`)
        const logsObject = get(logsObjectReq, 'data.result[0]["toolbox/codes"]', {})
        this.setLogsObject(logsObject)
      } catch (e) {
        this.reqFailed(e)
        this.isLoading = false
      }
    }
  }
})

export default useMainStore
