import Vue from 'vue'

async function getItems ({ state, commit }, entity) {
  if (entity) {
    let queryString = '',
      params = {}
    switch (entity) {
      case 'devices': {
        queryString = `${state.server}/registry/devices/all`
        params = {fields: 'id,name,ident'}
        break
      }
      case 'channels': {
        queryString = `${state.server}/gw/channels/all`
        params = {fields: 'id,name,uri,protocol_name'}
        break
      }
    }
    if (state.token) {
      try {
        let resp = await Vue.http.get(queryString, {
          params: params
        })
        let data = await resp.json()
        commit('setItems', data.result)
      }
      catch (e) { commit('reqFailed', e) }
    }
  }
}

async function checkConnection ({ state, commit }) {
  try {
    let resp = await Vue.http.get(`/statics/icons/favicon-16x16.png?_=${(new Date()).getTime()}`)
    if (resp.status === 200) {
      commit('setOfflineFlag', false)
    }
  }
  catch (e) {
    if (DEV) {
      console.log(e)
    }
  }
}

async function getCustomer ({ state, commit }) {
  try {
    let resp = await Vue.http.get(`${state.server}/platform/customer`)
    let data = await resp.json()
    if (data.result && data.result.length) {
      state.isCustomer = true
    }
  }
  catch (e) {
    if (DEV) {
      console.log(e)
    }
    state.isCustomer = false
  }
}

export default {
  getItems,
  checkConnection,
  getCustomer
}
