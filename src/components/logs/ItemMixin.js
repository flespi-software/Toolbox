import events from './events.json'
import { date } from 'quasar'
export default {
  methods: {
    getLogItemColor (code, closeCode, sendCode) {
      sendCode = sendCode || (this.item ? this.item.send_code : 0)
      closeCode = closeCode || (this.item ? this.item.close_code : 0)
      switch (code) {
        case 1:
        case 100:
        case 101:
        case 110:
        case 200:
        case 202:
        case 300:
        case 312:
        case 401:
        case 410:
        case 420:
        case 430:
        case 500:
        case 510:
        case 601:
        case 605:
          return 'text-green'
        case 2:
        case 3:
        case 21:
        case 111:
        case 112:
        case 302:
        case 303:
        case 311:
        case 314:
        case 321:
        case 411:
        case 412:
        case 502:
        case 504:
        case 511:
        case 600:
        case 603:
        case 604:
        case 900:
          return 'text-yellow'
        case 113:
        case 310:
        case 320:
        case 404:
        case 422:
        case 432:
        case 503:
        case 512:
        case 602:
        case 700:
        case 800:
          return 'text-grey-6'
        case 20:
        case 103:
        case 114:
        case 203:
        case 204:
        case 304:
        case 313:
        case 315:
        case 316:
        case 322:
        case 402:
        case 403:
        case 501:
          return 'text-red'
        case 201: {
          if (sendCode < 0) {
            return 'text-red'
          } else {
            return 'text-green'
          }
        }
        case 301:
        case 102: {
          switch (closeCode) {
            case 3: { return 'text-green' }
            case 2:
            case 12:
            case 15:
            case 16: { return 'text-grey-6' }
            case 4:
            case 5:
            case 6:
            case 11:
            case 13:
            case 14: { return 'text-red' }
            case 7:
            case 8:
            case 9:
            case 10: { return 'text-yellow' }
            default: { return 'text-grey-6' }
          }
        }
        default:
          return 'text-grey-6'
      }
    },
    getLogDescriptionByItem (item) {
      const types = events.types,
        closeCodes = events.closeCodes,
        errorCodes = events.errorCodes,
        sendCodes = events.sendCodes,
        codesByEvent = events.codesByEventcode
      let res = types[item.event_code] ? `${types[item.event_code]}` : item.event_code
      res += item.close_code
        ? ` (${closeCodes[item.close_code]})`
        : (closeCodes[item.close_code]
          ? `(${item.close_code})`
          : '')
      res += item.error_code
        ? ` (${item.error_code}: ${errorCodes[item.event_code][item.error_code]})`
        : (errorCodes[item.event_code] && errorCodes[item.event_code][item.error_code]
          ? `(${item.error_code})`
          : '')
      res += item.send_code
        ? ` (${item.send_code}: ${sendCodes[item.send_code]})`
        : (errorCodes[item.event_code] && errorCodes[item.event_code][item.send_code]
          ? `(${item.send_code})`
          : '')
      res += item.code && codesByEvent[item.event_code] && codesByEvent[item.event_code][item.code]
        ? ` (${item.code}: ${codesByEvent[item.event_code][item.code]})`
        : item.code && codesByEvent[item.event_code] && !codesByEvent[item.event_code][item.code]
          ? `(code: ${item.code})`
          : ''
      return res
    },
    getLogClearItem (item) {
      return Object.keys(item).reduce((result, key) => {
        if (key.indexOf('x-flespi') !== -1) {
          return result
        }
        result[key] = item[key]
        return result
      }, {})
    },
    getLogValueOfProp (prop, item) {
      let res = prop.custom ? JSON.stringify(item[prop.name]) : item[prop.name]
      if (prop.name === 'event_code') {
        res = this.getLogDescriptionByItem(item)
      } else if (prop.name === 'timestamp') {
        res = date.formatDate(item[prop.name] * 1000, 'DD/MM/YYYY HH:mm:ss')
      } else if (prop.name === 'host') {
        res = item.host || item.source || ''
      }
      return res
    }
  }
}
