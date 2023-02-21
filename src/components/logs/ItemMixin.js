import { date } from 'quasar'
import { mapState } from 'vuex'
export const COLORS = {
  alert: 'red',
  info: 'grey-6',
  notice: 'green',
  warning: 'yellow'
}
export default {
  computed: mapState ({
    logsObject: state => state.logsObject
  }),
  methods: {
    getLogItemColorByCodes (code, extCode) {
      const logMeta = this.logsObject.codes[code]
      let color = COLORS[logMeta?.severity]
      if (extCode) {
        color = COLORS[logMeta.extra_codes[extCode]?.severity] || color
      }
      return color
    },
    getLogItemColorByLogEntry (log) {
      const logMeta = this.logsObject.codes[log.event_code]
      let color = COLORS[logMeta?.severity]
      const extraName = logMeta?.extra_name
      if (extraName && log[extraName]) {
        color = COLORS[logMeta.extra_codes[log[extraName]]?.severity] || color
      }
      return color
    },
    getLogDescriptionByItem (item) {
      const logMeta = this.getLogMeta(item)

      let description = logMeta.description
      if (item[logMeta.extraName]) {
        description += logMeta.extraData && logMeta.extraData.description ?
        ` (${logMeta.extraData.description})` :
        ` (${logMeta.extraName}: ${item[logMeta.extraName]})`
      }

      return description
    },
    getLogMeta (log) {
      const logObject = this.logsObject.codes[log.event_code]
      const extraName = logObject.extra_name
      let extraData = undefined
      if (logObject.extra_name && log[extraName]) {
        const extData = logObject.extra_codes[log[extraName]]
        extraData = {
          ...extData,
          color: COLORS[extData?.severity]
        }
      }
      return {
        code: logObject.code,
        description: logObject.description,
        doc: logObject.doc,
        entity: logObject.entity,
        color: COLORS[logObject?.severity],
        extraName,
        extraData
      }

    },
    getLogValueOfProp (prop, item) {
      let res = prop.custom ? JSON.stringify(item[prop.name]) : item[prop.name]
      if (prop.name === 'event_code') {
        res = this.getLogDescriptionByItem(item)
      } else if (prop.name === 'timestamp' || prop.name === 'interval_begin' || prop.name === 'interval_end') {
        res = date.formatDate(item[prop.name] * 1000, 'DD/MM/YYYY HH:mm:ss')
      } else if (prop.name === 'host') {
        res = item.host || item.source || ''
      }
      return res
    }
  }
}
