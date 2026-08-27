import { defineBoot } from '#q-app'
import logger from 'src/infrastructure/appLogger'

export default defineBoot(({ app }) => {
  app.config.globalProperties.$logger = logger
})
