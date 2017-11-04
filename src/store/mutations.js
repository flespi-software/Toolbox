import { Cookies, LocalStorage } from 'quasar-framework'
import Vue from 'vue'

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
  switch (payload.status) {
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
    }
  }
}
function setItems (state, channels) {
  Vue.set(state, 'items', channels)
}
function setOfflineFlag (state, flag) {
  Vue.set(state, 'offline', flag)
}
function setToken (state, val) {
  let token = val.replace('FlespiToken ', '')
  if (val && token.match(/^[a-z0-9]+$/i)) {
    Vue.http.headers.common['Authorization'] = `FlespiToken ${token}`
    LocalStorage.set('X-Flespi-Token', token)
  }
  else {
    token = ''
    clearToken(state)
  }
  Vue.set(state, 'token', token)
}
function clearToken (state) {
  let cookieToken = Cookies.get('X-Flespi-Token'),
    localStorageToken = LocalStorage.get.item('X-Flespi-Token')
  if (cookieToken && localStorageToken && cookieToken === localStorageToken) {
    Cookies.remove('X-Flespi-Token')
  }
  LocalStorage.remove('X-Flespi-Token')
  Vue.http.headers.common['Authorization'] = ''
  Vue.set(state, 'token', '')
}

export default {
  reqStart,
  setItems,
  reqFailed,
  setToken,
  clearToken,
  setOfflineFlag
}
