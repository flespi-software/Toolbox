import Vue from 'vue'

async function getItems ({ state, commit }, entity) {
  if (entity) {
    let queryString = '',
      params = {},
      deletedParams = {},
      getDeletedLogs = null
    switch (entity) {
      case 'devices': {
        queryString = `/gw/devices/all`
        params = {fields: 'id,name,ident'}
        deletedParams = {fields: 'item_data', filter: 'event_code=3'}
        getDeletedLogs = Vue.connector.gw.getDevicesLogs
        break
      }
      case 'channels': {
        queryString = `/gw/channels/all`
        params = {fields: 'id,name,uri,protocol_name'}
        deletedParams = {fields: 'item_data', filter: 'event_code=3'}
        getDeletedLogs = Vue.connector.gw.getChannelsLogs
        break
      }
      case 'streams': {
        queryString = `/gw/streams/all`
        params = {fields: 'id,name,configuration'}
        deletedParams = {fields: 'item_data', filter: 'event_code=3'}
        getDeletedLogs = Vue.connector.gw.getStreamsLogs
        break
      }
      case 'modems': {
        queryString = `/gw/modems/all`
        params = {fields: 'id,name,configuration'}
        deletedParams = {fields: 'item_data', filter: 'event_code=3'}
        getDeletedLogs = Vue.connector.gw.getModemsLogs
        break
      }
      case 'containers': {
        queryString = `/storage/containers/all`
        params = {fields: 'id,name'}
        deletedParams = {fields: 'item_data', filter: 'event_code=3'}
        getDeletedLogs = Vue.connector.storage.getContainersLogs
        break
      }
      case 'abques': {
        queryString = `/storage/abques/all`
        params = {fields: 'id,name'}
        deletedParams = {fields: 'item_data', filter: 'event_code=3'}
        getDeletedLogs = Vue.connector.storage.getAbquesLogs
        break
      }
      case 'cdns': {
        queryString = `/storage/cdns/all`
        params = {fields: 'id,name'}
        deletedParams = {fields: 'item_data', filter: 'event_code=3'}
        getDeletedLogs = Vue.connector.storage.getCdnsLogs
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
        let deletedResp = await getDeletedLogs('all', {data: JSON.stringify(deletedParams)})
        let deletedData = deletedResp.data
        deleted = deletedData.result && deletedData.result.length ? deletedData.result : []
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

async function getTokenInfo ({ state, commit }, token) {
  let tokenInfoData = await Vue.connector.auth.getInfo()
  let tokenInfo = tokenInfoData.data.result[0]
  // agregate to config
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

export default {
  getItems,
  checkConnection,
  getTokenInfo
}
