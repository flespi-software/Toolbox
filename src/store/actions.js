import Vue from 'vue'

async function getItems ({ state, commit }, entity) {
  let queryString = ''
  switch (entity) {
    case 'devices': {
      queryString = `${state.server}/registry/devices/all`
      break
    }
    case 'channels': {
      queryString = `${state.server}/gw/channels/all`
      break
    }
  }
  if (state.token) {
    try {
      let resp = await Vue.http.get(queryString, {
        params: {fields: 'id,name'}
      })
      let data = await resp.json()
      commit('setItems', data.result)
    }
    catch (e) { commit('reqFailed', e) }
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
    console.log(e)
  }
}

export default {
  getItems,
  checkConnection
}
