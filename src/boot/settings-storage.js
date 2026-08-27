import { defineBoot } from '#q-app'
import settingsStorage from 'src/infrastructure/settingsStorage'

/* settings are read synchronously all over the app, so IndexedDB must be hydrated before the app starts */
export default defineBoot(async ({ app }) => {
  await settingsStorage.init()
  app.config.globalProperties.$settingsStorage = settingsStorage
})
