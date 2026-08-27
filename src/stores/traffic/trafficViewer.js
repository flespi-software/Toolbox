/*
 * The trafficViewer store — the Vuex module the Vue 2 build registered under the viewer's name,
 * with mutations and actions folded into one flat list of Pinia actions under their old names.
 */
import { defineStore } from 'pinia'
import get from 'lodash/get'
import { connector } from 'src/services/connector'
import appLogger from 'src/infrastructure/appLogger'
import { useListStore } from 'src/qvirtualscroll/stores/registry'

function getFromTo (val) {
  const now = val || Date.now(),
    from = new Date(now).setHours(0, 0, 0, 0),
    to = from + 86399999.999
  return { from, to }
}

export function createTrafficViewerStore ({ name }) {
  const logger = appLogger.extendName(name)

  return defineStore(`trafficViewer-${name}`, {
    state: () => ({
      devices: {},
      messages: [],
      active: null,
      ident: null,
      limit: 0,
      deviceFilter: '',
      from: 0,
      to: 0,
      isLoading: false,
      realtimeEnabled: false,
      messagePolling: false,
      /* module-level in the Vue 2 build, so every traffic page shared it */
      requestStatus: false,
      /* module-level in the Vue 2 build, so every traffic page shared it */
      mesagesPollingId: 0,
      initialized: false
    }),

    actions: {
      setLimit (limit) {
      this.limit = limit
      },
      setActive (active) {
      this.active = active
      },
      clearMessages () {
      this.messages = []
      },
      clearDevices () {
      this.devices = []
      },
      setDevices (devices) {
      this.devices = devices
      },
      setMessages (messages) {
      this.messages = messages
      },
      setMessagesAppend (messages) {
      if (messages.length) {
        this.messages.splice(this.messages.length, 0, ...messages)
      }
      },
      setMessagesPrepend (messages) {
      if (messages.length) {
        this.messages.splice(0, 0, ...messages)
      }
      },
      setTo (to) {
      this.to = to
      },
      setFrom (from) {
      this.from = from
      },
      setDeviceFilter (filter) {
      this.deviceFilter = filter
      },
      setIdent (ident) {
      this.ident = ident
      },
      clean () {
      this.devices = {}
      this.messages = []
      this.to = 0
      this.from = 0
      this.active = null
      this.ident = null
      },
      reqStart (payload) {
      logger.info(`[trafficViewer]reqStart: ${JSON.stringify(payload)}`)
      },
      reqFailed (e) {
      logger.info(`[trafficViewer]reqFailed: ${JSON.stringify(e)}`)
      },
      async initTime () {
      let timestamp = Date.now()
      try {
        const params = { data: { count: 1, reverse: true } }
        const resp = await connector.gw.getChannelsIdentsPackets(this.active, this.ident, params)
        logger.info(`[trafficViewer]initTime`)
        this.reqStart({ endpoint: 'getChannelsIdentsPackets', ids: this.active, ident: this.ident, params })
        timestamp = get(resp, 'data.result[0].timestamp', Math.floor(Date.now() / 1000))
        timestamp = Math.round(timestamp * 1000)
      } catch (e) {}
      const day = getFromTo(timestamp)
      this.setFrom(day.from)
      this.setTo(day.to)
      },
      async getDevices () {
      if (typeof this.isLoading !== 'undefined') {
        this.isLoading = true
      }
      try {
        const resp = await connector.gw.getChannelsIdents(this.active, this.deviceFilter ? `*${this.deviceFilter}*` : '*')
        this.reqStart({ endpoint: 'getChannelsIdents', ids: this.active, ident: this.deviceFilter ? `*${this.deviceFilter}*` : '*' })
        let idents = get(resp, 'data.result', [])
        idents = idents.reduce((idents, { ident, size }) => {
          idents[ident] = { ident, size }
          return idents
        }, {})
        this.setDevices(idents)
      } catch (e) {
        this.reqFailed(e)
      }
      if (typeof this.isLoading !== 'undefined') {
        this.isLoading = false
      }
      },
      async getMessages () {
      if (typeof this.isLoading !== 'undefined') {
        this.isLoading = true
      }
      try {
        const now = Date.now()
        const to = this.to > now ? now : this.to
        const params = { data: { from: this.from / 1000, to: to / 1000, count: this.limit } }
        const resp = await connector.gw.getChannelsIdentsPackets(this.active, this.ident, params)
        logger.info(`[trafficViewer]getMessages`)
        this.reqStart({ endpoint: 'getChannelsIdentsPackets', ids: this.active, ident: this.ident, params })
        const messages = get(resp, 'data.result', [])
        this.setMessages(messages)
      } catch (e) {
        this.reqFailed(e)
      }
      if (typeof this.isLoading !== 'undefined') {
        this.isLoading = false
      }
      },
      async getMessagesTail () {
      if (typeof this.isLoading !== 'undefined') {
        this.isLoading = true
      }
      try {
        const now = Date.now()
        const to = this.to > now ? now : this.to
        const params = { data: { count: this.limit, reverse: true, from: this.from / 1000, to: to / 1000 } }
        const resp = await connector.gw.getChannelsIdentsPackets(this.active, this.ident, params)
        logger.info(`[trafficViewer]getMessagesTail`)
        this.reqStart({ endpoint: 'getChannelsIdentsPackets', ids: this.active, ident: this.ident, params })
        const messages = get(resp, 'data.result', [])
        messages.reverse()
        this.setMessages(messages)
      } catch (e) {
        this.reqFailed(e)
      }
      if (typeof this.isLoading !== 'undefined') {
        this.isLoading = false
      }
      },
      async getMessagesNext () {
      if (!this.messages.length || this.requestStatus || this.messagePolling) { return }
      this.requestStatus = true
      let messages = []
      try {
        const from = this.messages[this.messages.length - 1].timestamp + 0.000001
        const params =  { data: { count: this.limit, from, to: this.to / 1000 } }
        const resp = await connector.gw.getChannelsIdentsPackets(this.active, this.ident, params)
        logger.info(`[trafficViewer]getMessagesNext`)
        this.reqStart({ endpoint: 'getChannelsIdentsPackets', ids: this.active, ident: this.ident, params })
        messages = get(resp, 'data.result', [])
        this.setMessagesAppend(messages)
      } catch (e) {
        this.reqFailed(e)
      }
      this.requestStatus = false
      return messages
      },
      async getMessagesPrev () {
      if (!this.messages.length || this.requestStatus) { return }
      this.requestStatus = true
      let messages = []
      try {
        const to = this.messages[0].timestamp - 0.000001
        const params = { data: { count: this.limit, from: this.from / 1000, to, reverse: true } }
        const resp = await connector.gw.getChannelsIdentsPackets(this.active, this.ident, params)
        logger.info(`[trafficViewer]getMessagesPrev`)
        this.reqStart({ endpoint: 'getChannelsIdentsPackets', ids: this.active, ident: this.ident, params })
        messages = get(resp, 'data.result', [])
        messages.reverse()
        this.setMessagesPrepend(messages)
      } catch (e) {
        this.reqFailed(e)
      }
      this.requestStatus = false
      return messages
      },
      async pollingGetDevices () {
      await connector.socket.subscribe({
        name: `flespi/log/gw/channels/${this.active}/connections/+/identified`,
        handler: (value, topic, packet) => {
          value = JSON.parse(value.toString())
          const ident = value.ident
          if (!this.devices[ident] && ident.indexOf(this.deviceFilter) !== -1) {
            this.devices[ident] = { ident }
          }
        }
      })
      this.realtimeEnabled = true
      logger.info(`[trafficViewer]pollingGetDevices`)
      logger.info(`[trafficViewer]subscribe: flespi/log/gw/channels/${this.active}/connections/+/identified`)
      },
      async removePollingGetDevices () {
      this.realtimeEnabled = false
      await connector.socket.unsubscribe(`flespi/log/gw/channels/${this.active}/connections/+/identified`)
      logger.info(`[trafficViewer]removePollingGetDevices`)
      logger.info(`[trafficViewer]unsubscribe: flespi/log/gw/channels/${this.active}/connections/+/identified`)
      },
      pollingGetMessages () {
      this.mesagesPollingId = setInterval(async () => {
        try {
          const from = this.messages[this.messages.length - 1].timestamp + 0.000001
          const to = Math.ceil(Date.now() / 1000)
          const params = { data: { from, to } }
          const resp = await connector.gw.getChannelsIdentsPackets(this.active, this.ident, params)
          logger.info(`[trafficViewer]pollingGetMessages`)
          this.reqStart({ endpoint: 'getChannelsIdentsPackets', ids: this.active, ident: this.ident, params })
          const messages = get(resp, 'data.result', [])
          this.setMessagesAppend(messages)
        } catch (e) {
          this.reqFailed(e)
        }
      }, 10000)
      this.messagePolling = true
      },
      removePollingGetMessages () {
      clearInterval(this.mesagesPollingId)
      this.mesagesPollingId = 0
      this.messagePolling = false
      logger.info(`[trafficViewer]removePollingGetMessages`)
      },
      async getDevicePreview (device) {
      let messages = []
      try {
        const params = { data: { count: 20, reverse: true } }
        const resp = await connector.gw.getChannelsIdentsPackets(this.active, device.ident, params)
        logger.info(`[trafficViewer]getDevicePreview`)
        this.reqStart({ endpoint: 'getChannelsIdentsPackets', ids: this.active, ident: device.ident, params })
        messages = get(resp, 'data.result', [])
      } catch (e) {
        this.reqFailed(e)
      }
      return messages
      },
      async getExportData ({ from, to }) {
      let messages = []
      try {
        const params = { data: { from, to } }
        const resp = await connector.gw.getChannelsIdentsPackets(this.active, this.ident, params)
        logger.info(`[trafficViewer]getExportData`)
        this.reqStart({ endpoint: 'getChannelsIdentsPackets', ids: this.active, ident: this.ident, params })
        messages = get(resp, 'data.result', [])
        console.log(messages);
      } catch (e) {
        this.reqFailed(e)
      }
      return messages
      },
    }
  })
}

export function useTrafficViewerStore (config) {
  return useListStore(createTrafficViewerStore, config)
}
