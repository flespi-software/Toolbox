import Vue from 'vue'
import { Notify } from 'quasar'

const origins = {
  devices: '/gw/devices',
  channels: '/gw/channels',
  streams: '/gw/streams',
  modems: '/gw/modems',
  containers: '/storage/containers',
  abques: '/storage/abques',
  cdns: '/storage/cdns'
}

let itemsSubsId = null
let currentEntity = ''

async function getItems ({ state, commit }, payload) {
  let entity = '',
    id = null
  if (typeof payload === 'string') {
    entity = payload
  } else {
    entity = payload.entity
    id = payload.id
  }
  if (entity) {
    let dontNeedNewSubscribe = currentEntity === entity && !id
    if (dontNeedNewSubscribe) {
      return Promise.resolve()
    }
    currentEntity = entity
    let origin = `flespi/state${origins[entity]}/${id || '+'}/+`
    if (state.token) {
      try {
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', true)
        }
        // init getting protocols name
        if (entity === 'channels' && !state.protocols) {
          let protocolsResp = await Vue.connector.gw.getProtocols('all', {fields: 'name,id'})
          let protocols = protocolsResp.data.result.reduce((result, protocol) => {
            result[protocol.id] = protocol.name
            return result
          }, {})
          Vue.set(state, 'protocols', protocols)
        }
        let items = []
        let subsIds = await Vue.connector.socket.subscribe({
          name: origin,
          handler (value, topic, packet) {
            let partsOfTopic = topic.split('/').reverse(),
              name = partsOfTopic.shift(),
              id = parseInt(partsOfTopic.shift()),
              source = subsIds ? state.items : items

            if (name === 'deleted') {
              commit('deleteItem', id)
              return false
            }

            let existedIndex = -1
            source.forEach((existItem, index) => {
              if (existItem.id === id) { existedIndex = index }
            })
            if (existedIndex !== -1) {
              Vue.set(source[existedIndex], name, JSON.parse(value.toString()))
            } else {
              source.push({id: id, [name]: JSON.parse(value.toString())})
            }
          }}
        )
        Vue.set(state, 'items', items)
        itemsSubsId = subsIds
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', false)
        }
      } catch (e) {
        commit('reqFailed', e)
        commit('setItems', [])
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', false)
        }
      }
    }
  }
}

async function unsubscribeItems ({state, commit}, payload) {
  let entity = '',
    id = null
  if (typeof payload === 'string') {
    entity = payload
  } else {
    entity = payload.entity
    id = payload.id
  }
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', true)
  }
  if (entity) {
    let origin = `flespi/state${origins[entity]}/${id || '+'}/+`
    try {
      let subkeys = Object.keys(itemsSubsId)
      await Vue.connector.socket.unsubscribe(origin, subkeys)
    } catch (e) {
      commit('reqFailed', e)
    }
  }
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', false)
  }
}

async function getDeleted ({state, commit}, entity) {
  if (entity) {
    let deletedParams = {fields: 'item_data', count: 2000, reverse: true}
    switch (entity) {
      case 'devices': {
        deletedParams = Object.assign(deletedParams, {filter: 'event_origin=gw/devices/*,event_code=3'})
        break
      }
      case 'channels': {
        deletedParams = Object.assign(deletedParams, {filter: 'event_origin=gw/channels/*,event_code=3'})
        break
      }
      case 'streams': {
        deletedParams = Object.assign(deletedParams, {filter: 'event_origin=gw/streams/*,event_code=3'})
        break
      }
      case 'modems': {
        deletedParams = Object.assign(deletedParams, {filter: 'event_origin=gw/modems/*,event_code=3'})
        break
      }
      case 'containers': {
        deletedParams = Object.assign(deletedParams, {filter: 'event_origin=storage/containers/*,event_code=3'})
        break
      }
      case 'abques': {
        deletedParams = Object.assign(deletedParams, {filter: 'event_origin=storage/abques/*,event_code=3'})
        break
      }
      case 'cdns': {
        deletedParams = Object.assign(deletedParams, {filter: 'event_origin=storage/cdns/*,event_code=3'})
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
          let deletedResp = await Vue.connector.platform.getCustomerLogs({data: JSON.stringify(deletedParams)})
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
            timeout: 1000
          })
        }
        let result = [
          ...state.items,
          ...deleted.map(item => {
            let itemObj = item.item_data
            itemObj.deleted = true
            return itemObj
          })
        ]
        commit('setItems', result)
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', false)
        }
      } catch (e) {
        commit('reqFailed', e)
        commit('setItems', [])
        if (typeof state.isLoading !== 'undefined') {
          Vue.set(state, 'isLoading', false)
        }
      }
    }
  }
}

async function checkConnection ({ state, commit }) {
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
  getDeleted
}
