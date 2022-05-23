import { Logger } from '../infrastructure/logger'

const logger = new Logger('Toolbox');

export default ({ Vue, store }) => {
  Vue.prototype.$logger = logger
  Vue.$logger = logger
}
