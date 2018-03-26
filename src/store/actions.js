import Vue from 'vue'

async function getItems ({ state, commit }, entity) {
  if (entity) {
    let queryString = '',
      params = {},
      deletedParams = {}
    switch (entity) {
      case 'devices': {
        queryString = `/gw/devices/all`
        params = {fields: 'id,name,ident'}
        deletedParams = {fields: 'item_data', filter: 'event_origin=gw/devices/*,event_code=3'}
        break
      }
      case 'channels': {
        queryString = `/gw/channels/all`
        params = {fields: 'id,name,uri,protocol_name'}
        deletedParams = {fields: 'item_data', filter: 'event_origin=gw/channels/*,event_code=3'}
        break
      }
      case 'streams': {
        queryString = `/gw/streams/all`
        params = {fields: 'id,name,configuration'}
        deletedParams = {fields: 'item_data', filter: 'event_origin=gw/streams/*,event_code=3'}
        break
      }
      case 'modems': {
        queryString = `/gw/modems/all`
        params = {fields: 'id,name,configuration'}
        deletedParams = {fields: 'item_data', filter: 'event_origin=gw/modems/*,event_code=3'}
        break
      }
      case 'containers': {
        queryString = `/storage/containers/all`
        params = {fields: 'id,name'}
        deletedParams = {fields: 'item_data', filter: 'event_origin=storage/containers/*,event_code=3'}
        break
      }
      case 'abques': {
        queryString = `/storage/abques/all`
        params = {fields: 'id,name'}
        deletedParams = {fields: 'item_data', filter: 'event_origin=storage/abques/*,event_code=3'}
        break
      }
    }
    if (state.token) {
      try {
        if (typeof state.isLoading !== 'undefined') {
          state.isLoading = true
        }
        let activeResp = await Vue.connector.http.get(queryString, { params })
        let active = activeResp.data
        let deleted = []
        if (state.isCustomer) {
          let deletedResp = await Vue.connector.platform.getCustomerLogs({data: JSON.stringify(deletedParams)})
          let deletedData = deletedResp.data
          deleted = deletedData.result && deletedData.result.length ? deletedData.result : []
        }
        let result = [
          ...active.result,
          ...deleted.map(item => {
            let itemObj = item.item_data
            itemObj.deleted = true
            return itemObj
          })
        ]
        commit('setItems', result)
        if (typeof state.isLoading !== 'undefined') {
          state.isLoading = false
        }
      } catch (e) {
        commit('reqFailed', e)
        commit('setItems', [])
        if (typeof state.isLoading !== 'undefined') {
          state.isLoading = false
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

async function getCustomer ({ state, commit }) {
  try {
    if (typeof state.isLoading !== 'undefined') {
      state.isLoading = true
    }
    let resp = await Vue.connector.platform.getCustomer()
    let data = resp.data
    if (data.result && data.result.length) {
      state.isCustomer = true
    }
    if (typeof state.isLoading !== 'undefined') {
      state.isLoading = false
    }
  } catch (e) {
    if (DEV) {
      console.log(e)
    }
    state.isCustomer = false
    if (typeof state.isLoading !== 'undefined') {
      state.isLoading = false
    }
  }
}

export default {
  getItems,
  checkConnection,
  getCustomer
}
