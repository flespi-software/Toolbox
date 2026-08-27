import { defineBoot } from '#q-app'
import integrationBus from 'src/services/integrationBus'

export default defineBoot(({ app }) => {
  app.config.globalProperties.$integrationBus = integrationBus
})
