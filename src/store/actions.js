import Vue from 'vue'
import { Notify } from 'quasar'
import get from 'lodash/get'

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
    tasks: ['device_id', 'calc_id'],
    subaccounts: ['id', 'name', 'deleted']
  },
  GET_ITEMS_MODE_OBJECT = 0,
  GET_ITEMS_MODE_FIELDS = 1

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
async function getItems ({ state, commit }, payload) {
  const { id, mode, entity } = getParams(payload)
  const originBase = getOriginBase(entity, id)
  const writePath = entity
  if (!state[writePath]) { Vue.set(state, writePath, {}) }
  if (entity) {
    let origin = ''
    if (mode === GET_ITEMS_MODE_FIELDS) {
      if (!basicEntitiesFields[entity]) { return false }
      origin = `${originBase}/${basicEntitiesFields[entity].join(',')}`
    } else {
      origin = `${originBase}/${id || '+'}`
    }
    if (state.token) {
      try {
        // init getting channels-protocols name
        if (entity === 'channels' && !state.channelsProtocols) {
          const protocolsResp = await Vue.connector.gw.getChannelProtocols('all', { fields: 'name,id,features' })
          commit('reqStart', { endpoint: 'getChannelProtocols', ids: 'all', data: { fields: 'name,id,features' }})
          const protocols = protocolsResp.data.result.reduce((result, protocol) => {
            result[protocol.id] = protocol
            return result
          }, {})
          Vue.set(state, 'channelsProtocols', protocols)
        }
        // init getting streams-protocols name
        if (entity === 'streams' && !state.streamsProtocols) {
          const protocolsResp = await Vue.connector.gw.getStreamProtocols('all', { fields: 'name,id' })
          commit('reqStart', { endpoint: 'getStreamProtocols' })
          const protocols = protocolsResp.data.result.reduce((result, protocol) => {
            result[protocol.id] = protocol
            return result
          }, {})
          Vue.set(state, 'streamsProtocols', protocols)
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
            source = subsIds ? state[writePath] : items

          if (value.length) {
            Vue.set(source, id, JSON.parse(value.toString()))
          } else {
            commit('deleteItem', { id, mode: entity === 'tasks', source })
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
            source = subsIds ? state[writePath] : items
          if (name === 'deleted') {
            commit('deleteItem', { id, mode: entity === 'tasks', source })
            return false
          }
          /* skeep empty messages */
          if (!value.length) {
            return false
          }

          if (source[id]) {
            Vue.set(source[id], name, JSON.parse(value.toString()))
          } else {
            Vue.set(source, id, { id: id, [name]: JSON.parse(value.toString()) })
          }
        }
        let subsIds = null
        const params = {
            name: origin,
            handler: mode === GET_ITEMS_MODE_OBJECT ?
              (value, topic, packet) => objectModeHandler(value, topic, packet, subsIds) :
              (value, topic, packet) => fieldModeHandler(value, topic, packet, subsIds)
          }
        subsIds = await Vue.connector.socket.subscribe(params)
        Vue.$logger.info(`subscribe: ${JSON.stringify(params)}`)
        Vue.set(state, writePath, items)
        return subsIds
      } catch (e) {
        commit('reqFailed', e)
        commit('setItems', { items: {}, entity })
      }
    }
  }
}

async function unsubscribeItems ({ state, commit }, payload) {
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
      Vue.$logger.info(`unsubscribe: ${origin}`)
      return await Vue.connector.socket.unsubscribe(origin)
    } catch (e) {
      commit('reqFailed', e)
    }
  }
}

async function getEntities (store, payload) {
  const { state } = store
  Vue.set(state, 'isLoading', true)
  const res = await Promise.all(payload.map(config => getItems(store, config)))
  Vue.set(state, 'isLoading', false)
  return res
}

async function removeEntities (store, payload) {
  const { state } = store
  Vue.set(state, 'isLoading', true)
  const res = await Promise.all(payload.map(config => {
    const { entity } = getParams(payload)
    Vue.delete(state, entity)
    unsubscribeItems(store, config)
  }))
  Vue.set(state, 'isLoading', false)
  return res
}

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

async function getDeleted ({ state, commit }, entity) {
  if (entity) {
    if (state.token) {
      try {
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', true)
        }
        let deleted = []
        if (state.tokenInfo.access.type === 1) {
          try {
            const deletedResp = await Vue.connector.platform.getDeleted(
              `type=${itemTypes[entity]}`,
              { fields: 'data' }
            )
            commit('reqStart', { endpoint: 'getDeleted', type: `type=${itemTypes[entity]}` })
            const deletedData = deletedResp.data
            if (deletedData.errors) {
              deletedData.errors.forEach((error) => {
                commit('addError', error.reason)
              })
            }
            deleted = deletedData.result
          } catch (e) {
            commit('addError', e.message)
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
          ...state[entity],
          ...deleted.reduce((deleted, item) => {
            if (item.data) {
              const itemObj = item.data
              itemObj.deleted = true
              deleted[itemObj.id] = itemObj
            }
            return deleted
          }, {})
        }
        commit('setItems', { items: result, entity })
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', false)
        }
      } catch (e) {
        commit('reqFailed', e)
        commit('setItems', { items: {}, entity })
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', false)
        }
      }
    }
  }
}

async function checkConnection ({ state, commit }) {
  if (!DEV) {
    return false
  }
  try {
    const resp = await Vue.connector.http.external.get(`./icons/favicon-16x16.png?_=${(new Date()).getTime()}`)
    if (resp.status === 200 && state.offline) {
      commit('setOfflineFlag', false)
    }
  } catch (e) {
    if (DEV) {
      console.log(e)
    }
    if (!state.offline) {
      commit('setOfflineFlag', true)
    }
  }
}

async function getRegions ({ state, commit }) {
  try {
    if (typeof state.isLoading !== 'undefined') {
      Vue.set(state, 'isLoading', true)
    }
    const resp = await Vue.connector.http.get('/auth/regions')
    let regions = get(resp, 'data.result', [])
    let currentRegion = null
    regions = regions.reduce((regions, region) => {
      if (region.default) {
        currentRegion = region
      }
      regions[region.name] = region
      return regions
    }, {})
    currentRegion && commit('setToolboxSessionSettings', { region: currentRegion })
    commit('setRegions', regions)
  } catch (e) {
    commit('reqFailed', e)
    if (typeof state.isLoading !== 'undefined') {
      Vue.set(state, 'isLoading', false)
    }
  }
}

async function initConnection ({ state, commit }, { region, token }) {
  try {
    if (typeof state.isLoading !== 'undefined') {
      Vue.set(state, 'isLoading', true)
    }
    if (!state.regions) {
      await getRegions({ state, commit })
    }
    if (region) {
      commit('setToolboxSessionSettings', { region })
    }
    const currentRegion = state.sessionSettings.region
    Vue.prototype.$flespiServer = currentRegion.rest
    Vue.prototype.$flespiSocketServer = `wss://${currentRegion['mqtt-ws']}`
    Vue.prototype.$flespiCDN = currentRegion.cdn
    Vue.connector.setRegion(currentRegion)
    commit('setToken', token)
  } catch (e) {
    commit('reqFailed', e)
    if (typeof state.isLoading !== 'undefined') {
      Vue.set(state, 'isLoading', false)
    }
  }
}

async function initLogsObject ({ state, commit }) {
  try {
    if (typeof state.isLoading !== 'undefined') {
      Vue.set(state, 'isLoading', true)
    }
    const logsObjectReq = await Vue.connector.http.external(`${Vue.prototype.$flespiServer}/const/values?names=toolbox%2Fcodes`)
    const logsObject = get(logsObjectReq, 'data.result[0]["toolbox/codes"]', {})
    commit('setLogsObject', logsObject)
  } catch (e) {
    commit('reqFailed', e)
    if (typeof state.isLoading !== 'undefined') {
      Vue.set(state, 'isLoading', false)
    }
  }
}

export default {
  getItems,
  unsubscribeItems,
  checkConnection,
  getDeleted,
  getEntities,
  removeEntities,
  getRegions,
  initConnection,
  initLogsObject
}
