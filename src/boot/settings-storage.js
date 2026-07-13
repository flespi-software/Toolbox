import Vue from 'vue'
import settingsStorage from '../infrastructure/settingsStorage'

/* settings are read synchronously all over the app, so IndexedDB must be hydrated before the app starts */
export default async () => {
  await settingsStorage.init()
  Vue.prototype.$settingsStorage = settingsStorage
}
