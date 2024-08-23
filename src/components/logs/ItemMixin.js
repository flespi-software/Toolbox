import { date } from 'quasar'
import { mapState } from 'vuex'
export const COLORS = {
  alert: 'red',
  info: 'grey-6',
  notice: 'green',
  warning: 'yellow'
}
const TYPES = {
  1: 'customer',
  2: 'customer/oauth(DEPRECATED)',
  3: 'customer/tokens(DEPRECATED)',
  4: 'limits',
  5: 'subaccounts',
  6: 'containers',
  7: 'cdns',
  8: 'reserved [N/A]',
  9: 'channels',
  10: 'modems',
  11: 'devices',
  12: 'streams',
  13: 'calcs',
  14: 'mqtt sessions',
  15: 'no dedicated uri for rmtree items',
  16: 'protocols(DEPRECATED)',
  17: 'calcs/devices',
  18: 'mqtt subscriptions',
  19: 'channels/commands',
  20: 'streams/devices',
  21: 'streams/channels',
  22: 'devices/telemetry',
  23: 'devices/settings',
  24: 'devices/plugins',
  25: 'plugins',
  26: 'plugins/devices',
  27: 'channel-protocols',
  28: 'stream-protocols',
  29: 'realms',
  30: 'plugin-types',
  31: 'groups',
  32: 'billing',
  33: 'tokens',
  34: 'oauth',
  35: 'device-types',
  36: 'webhooks',
  37: 'grants',
  38: 'identity-providers',
  39: 'realms users',
  40: 'geofences'
}
export default {
  computed: mapState ({
    logsObject: state => state.logsObject
  }),
  methods: {
    getLogItemColorByCodes (code, extCode) {
      const logMeta = this.logsObject.codes[code]
      let color = COLORS[logMeta && logMeta.severity]
      if (extCode) {
        color = COLORS[logMeta.extra_codes[extCode] && logMeta.extra_codes[extCode].severity] || color
      }
      return color
    },
    getLogItemColorByLogEntry (log) {
      const logMeta = this.logsObject.codes[log.event_code]
      let color = COLORS[logMeta && logMeta.severity]
      const extraName = logMeta && logMeta.extra_name
      if (extraName && log[extraName]) {
        color = COLORS[logMeta.extra_codes[log[extraName]] && logMeta.extra_codes[log[extraName]].severity] || color
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
          color: COLORS[extData && extData.severity]
        }
      }
      return {
        code: logObject.code,
        description: logObject.description,
        doc: logObject.doc,
        entity: logObject.entity,
        color: COLORS[logObject && logObject.severity],
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
      } else if (prop.name === 'origin_type') {
        res = TYPES[item[prop.name]] || item[prop.name]
      }
      return res
    }
  }
}
