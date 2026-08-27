/*
 * The streamTraffic store — the Vuex module the Vue 2 build registered under the viewer's name,
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

export function createStreamTrafficStore ({ name }) {
  const logger = appLogger.extendName(name)

  return defineStore(`streamTraffic-${name}`, {
    state: () => ({
      messages: [],
      active: null,
      limit: 0,
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
      setMessages (messages) {
      this.messages = messages
      },
      setMessagesAppend (messages) {
      this.messages.splice(this.messages.length, 0, ...messages)
      },
      setMessagesPrepend (messages) {
      this.messages.splice(0, 0, ...messages)
      },
      setTo (to) {
      this.to = to
      },
      setFrom (from) {
      this.from = from
      },
      clean () {
      this.messages = []
      this.to = 0
      this.from = 0
      this.active = null
      },
      reqStart (payload) {
      logger.info(`[streamTraffic]reqStart: ${JSON.stringify(payload)}`)
      },
      reqFailed (e) {
      logger.info(`[streamTraffic]reqFailed: ${JSON.stringify(e)}`)
      },
      async initTime () {
      let timestamp = Date.now()
      try {
        const params = { data: { count: 1, reverse: true } }
        const resp = await connector.gw.getStreamsPackets(this.active, params)
        logger.info(`[streamTraffic]getMessages`)
        this.reqStart({ endpoint: 'getStreamsPackets', ids: this.active, params })
        timestamp = get(resp, 'data.result[0].timestamp', Math.floor(Date.now() / 1000))
        timestamp = Math.round(timestamp * 1000)
      } catch (e) {}
      const day = getFromTo(timestamp)
      this.setFrom(day.from)
      this.setTo(day.to)
      },
      async getMessages () {
      if (typeof this.isLoading !== 'undefined') {
        this.isLoading = true
      }
      try {
        const now = Date.now()
        const to = this.to > now ? now : this.to
        const params = { data: { from: this.from / 1000, to: to / 1000, count: this.limit } }
        const resp = await connector.gw.getStreamsPackets(this.active, params)
        logger.info(`[streamTraffic]getMessages`)
        this.reqStart({ endpoint: 'getStreamsPackets', ids: this.active, params })
        const messages = get(resp, 'data.result', [])
        this.setMessages(messages)
      } catch (e) {
        console.log('------------- 1')
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
        const resp = await connector.gw.getStreamsPackets(this.active, params)
        logger.info(`[streamTraffic]getMessagesTail`)
        this.reqStart({ endpoint: 'getStreamsPackets', ids: this.active, params })
        const messages = get(resp, 'data.result', [])
        messages.reverse()
        this.setMessages(messages)
      } catch (e) {
        console.log('------------- 2')
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
        const params = { data: { count: this.limit, from, to: this.to / 1000 } }
        const resp = await connector.gw.getStreamsPackets(this.active, params)
        logger.info(`[streamTraffic]getMessagesNext`)
        this.reqStart({ endpoint: 'getStreamsPackets', ids: this.active, params })
        messages = get(resp, 'data.result', [])
        this.setMessagesAppend(messages)
      } catch (e) {
        console.log('------------- 3')
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
        const resp = await connector.gw.getStreamsPackets(this.active, params)
        logger.info(`[streamTraffic]getMessagesPrev`)
        this.reqStart({ endpoint: 'getStreamsPackets', ids: this.active, params })
        messages = get(resp, 'data.result', [])
        messages.reverse()
        this.setMessagesPrepend(messages)
      } catch (e) {
        console.log('------------- 4')
        this.reqFailed(e)
      }
      this.requestStatus = false
      return messages
      },
      pollingGetMessages () {
      this.mesagesPollingId = setInterval(async () => {
        try {
          const from = this.messages[this.messages.length - 1].timestamp + 0.000001
          const to = Math.ceil(Date.now() / 1000)
          const params = { data: { from, to } }
          const resp = await connector.gw.getStreamsPackets(this.active, params)
          logger.info(`[streamTraffic]pollingGetMessages`)
          this.reqStart({ endpoint: 'getStreamsPackets', ids: this.active, params })
          const messages = get(resp, 'data.result', [])
          this.setMessagesAppend(messages)
        } catch (e) {
          console.log('------------- 5')
          this.reqFailed(e)
        }
      }, 10000)
      this.messagePolling = true
      },
      removePollingGetMessages () {
      clearInterval(this.mesagesPollingId)
      this.mesagesPollingId = 0
      this.messagePolling = false
      logger.info(`[streamTraffic]removePollingGetMessages`)
      },
      async getExportData ({ from, to }) {
      let messages = []
      try {
        const params = { data: { from, to } }
        const resp = await connector.gw.getStreamsPackets(this.active, params)
        logger.info(`[streamTraffic]getExportData`)
        this.reqStart({ endpoint: 'getStreamsPackets', ids: this.active, params })
        messages = get(resp, 'data.result', [])
      } catch (e) {
        console.log('------------- 6')
        this.reqFailed(e)
      }
      return messages
      },
    }
  })
}

export function useStreamTrafficStore (config) {
  return useListStore(createStreamTrafficStore, config)
}
