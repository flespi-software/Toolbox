/* the single app-wide logger instance; the Vue 2 build kept it on `Vue.$logger` */
import { Logger } from './logger'

export const logger = new Logger('Toolbox')

export default logger
