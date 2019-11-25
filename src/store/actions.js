import Vue from 'vue'
import { Notify } from 'quasar'

const origins = {
    devices: '/gw/devices',
    channels: '/gw/channels',
    calcs: '/gw/calcs',
    streams: '/gw/streams',
    modems: '/gw/modems',
    containers: '/storage/containers',
    cdns: '/storage/cdns',
    tasks: '/gw/calcs/+/devices',
    subaccounts: '/platform/subaccounts'
  },
  GET_ITEMS_MODE_OBJECT = 0,
  GET_ITEMS_MODE_FIELDS = 1

async function getItems ({ state, commit }, payload) {
  let entity = '',
    id = null,
    writePath = 'items',
    mode = GET_ITEMS_MODE_OBJECT
  if (typeof payload === 'string') {
    entity = payload
  } else {
    entity = payload.entity
    if (payload.id) {
      id = payload.id
    }
    if (payload.addition) {
      writePath = `addition.${entity}`
    }
    if (payload.mode) {
      mode = payload.mode
    }
  }
  if (entity) {
    let origin = `flespi/state${origins[entity]}/${id || '+'}${mode === GET_ITEMS_MODE_FIELDS ? '/+' : ''}`
    if (state.token) {
      try {
        // init getting protocols name
        if (entity === 'channels' && !state.protocols) {
          let protocolsResp = await Vue.connector.gw.getProtocols('all', { fields: 'name,id' })
          let protocols = protocolsResp.data.result.reduce((result, protocol) => {
            result[protocol.id] = protocol.name
            return result
          }, {})
          Vue.set(state, 'protocols', protocols)
        }
        let items = {}
        let partsOfTopicFilter = origin.split('/').reverse().slice(1)
        let objectModeHandler = (value, topic, packet) => {
          let partsOfTopic = topic.split('/').reverse(),
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
        let fieldModeHandler = (value, topic, packet) => {
          let partsOfTopic = topic.split('/').reverse(),
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
        let subsIds = await Vue.connector.socket.subscribe({
          name: origin,
          handler: mode === GET_ITEMS_MODE_OBJECT ? objectModeHandler : fieldModeHandler }
        )
        Vue.set(state, writePath, items)
        return subsIds
      } catch (e) {
        commit('reqFailed', e)
        commit('setItems', {})
      }
    }
  }
}

async function unsubscribeItems ({ state, commit }, payload) {
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
    if (payload.addition) {
      Vue.delete(state, `addition.${entity}`)
    }
    if (payload.mode) {
      mode = payload.mode
    }
  }
  if (entity) {
    let origin = `flespi/state${origins[entity]}/${id || '+'}${mode === GET_ITEMS_MODE_FIELDS ? '/+' : ''}`
    try {
      return await Vue.connector.socket.unsubscribe(origin)
    } catch (e) {
      commit('reqFailed', e)
    }
  }
}

async function getEntities (store, payload) {
  let { state } = store
  Vue.set(state, 'isLoading', true)
  let res = await Promise.all(payload.map(config => getItems(store, config)))
  Vue.set(state, 'isLoading', false)
  return res
}

async function removeEntities (store, payload) {
  let { state } = store
  Vue.set(state, 'isLoading', true)
  let res = await Promise.all(payload.map(config => unsubscribeItems(store, config)))
  Vue.set(state, 'isLoading', false)
  return res
}

async function getDeleted ({ state, commit }, entity) {
  if (entity) {
    let deletedParams = { fields: 'item_data', count: 2000, reverse: true }
    switch (entity) {
      case 'devices': {
        deletedParams = Object.assign(deletedParams, { filter: 'event_origin=gw/devices/*,event_code=3' })
        break
      }
      case 'channels': {
        deletedParams = Object.assign(deletedParams, { filter: 'event_origin=gw/channels/*,event_code=3' })
        break
      }
      case 'streams': {
        deletedParams = Object.assign(deletedParams, { filter: 'event_origin=gw/streams/*,event_code=3' })
        break
      }
      case 'calcs': {
        deletedParams = Object.assign(deletedParams, { filter: 'event_origin=gw/calcs/*,event_code=3' })
        break
      }
      case 'modems': {
        deletedParams = Object.assign(deletedParams, { filter: 'event_origin=gw/modems/*,event_code=3' })
        break
      }
      case 'containers': {
        deletedParams = Object.assign(deletedParams, { filter: 'event_origin=storage/containers/*,event_code=3' })
        break
      }
      case 'cdns': {
        deletedParams = Object.assign(deletedParams, { filter: 'event_origin=storage/cdns/*,event_code=3' })
        break
      }
    }
    if (state.token) {
      try {
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', true)
        }
        let deleted = []
        if (state.tokenInfo.access.type === 1) {
          let deletedResp = await Vue.connector.platform.getCustomerLogs({ data: JSON.stringify(deletedParams) })
          let deletedData = deletedResp.data
          if (deletedData.errors) {
            deletedData.errors.forEach((error) => {
              commit('addError', error.reason)
            })
          }
          deleted = deletedData.result && deletedData.result.length ? deletedData.result.reverse() : []
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
        let result = {
          ...state.items,
          ...deleted.reduce((deleted, item) => {
            let itemObj = item.item_data
            itemObj.deleted = true
            deleted[itemObj.id] = itemObj
            return deleted
          }, {})
        }
        commit('setItems', result)
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', false)
        }
      } catch (e) {
        commit('reqFailed', e)
        commit('setItems', {})
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
    let resp = await Vue.connector.http.external.get(`./statics/icons/favicon-16x16.png?_=${(new Date()).getTime()}`)
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

export default {
  getItems,
  unsubscribeItems,
  checkConnection,
  getDeleted,
  getEntities,
  removeEntities
}
