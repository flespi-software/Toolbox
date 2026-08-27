/*
 * The logs list store. It is the Vuex module the Vue 2 build registered under the list's name, with
 * mutations and actions folded into one flat list of Pinia actions under their old names.
 *
 * `messagesBuffer` and `loopId` used to be closure variables of the module factory; they live in the
 * store now so that a store handed back from the registry keeps the buffer it is actually rendering.
 */
import { defineStore } from 'pinia'
import _get from 'lodash/get'
import { connector } from 'src/services/connector'
import { useMainStore } from 'src/stores/main'
import appLogger from 'src/infrastructure/appLogger'
import defaultCols from './logsDefaultCols'
import { getColsLS, setColsLS } from './ls'
import { useListStore, disposeListStore } from './registry'

function getDefaultColsSchema (cols) {
  return {
    activeSchema: '_default',
    schemas: {
      _default: {
        name: '_default',
        cols: cols.map(col => ({ name: col.name, width: col.width }))
      }
    },
    enum: cols.reduce((res, col) => {
      res[col.name] = { ...col }
      delete res[col.name].width
      return res
    }, {})
  }
}

function getFromTo (val) {
  const now = val || Date.now(),
    from = new Date(now).setHours(0, 0, 0, 0),
    to = from + 86399999.999
  return { from, to }
}

export function createLogsStore ({ name, lsNamespace, storage, errorHandler, newMessagesInterseptor }) {
  const logger = appLogger.extendName(name)
  let messagesKeyPointer = 0

  function messagesIndexing (messages) {
    if (!messages.length) { return }
    messages.forEach((message, index) => {
      Object.defineProperty(messages[index], 'x-flespi-message-key', {
        value: messagesKeyPointer++,
        enumerable: false
      })
    })
  }

  return defineStore(`qvs-logs-${name}`, {
    state: () => ({
      name,
      lsNamespace,
      isLoading: false,
      origin: '',
      messages: [],
      pages: [],
      filter: '',
      realtimeEnabled: false,
      from: 0,
      to: 0,
      cid: null,
      limit: 1000,
      reverse: false,
      itemtype: null,
      cols: undefined,
      offline: false,
      selected: [],
      isItemDeleted: false,
      hasNewMessages: null,
      messagesBuffer: [],
      loopId: 0,
      /* set by the list component the first time it sets this store up — see `clear` in its init */
      initialized: false
    }),

    actions: {
      /* ---------------------------------------------------------------- mutations */
      setMessages (messages) {
        this.messages = messages
      },

      setRTMessages (data) {
        if (data && data.length) {
          messagesIndexing(data)
          const messages = this.messages
          newMessagesInterseptor && newMessagesInterseptor(data)
          messages.splice(messages.length, 0, ...data)
          this.limiting({ type: 'rt', count: data.length })
        }
        logger.info(`setRTMessages: length: ${data.length}`)
      },

      prependMessages (data) {
        if (data && data.length) {
          data.reverse()
          const messages = this.messages
          messagesIndexing(data)
          newMessagesInterseptor && newMessagesInterseptor(data)
          messages.splice(0, 0, ...data)
        }
        logger.info(`prependMessages: length: ${data.length}`)
      },

      appendMessages (data) {
        if (data && data.length) {
          const messages = this.messages
          messagesIndexing(data)
          newMessagesInterseptor && newMessagesInterseptor(data)
          messages.splice(messages.length, 0, ...data)
        }
        logger.info(`appendMessages: length: ${data.length}`)
      },

      setHistoryMessages (data) {
        if (this.reverse) {
          data.reverse()
        }
        messagesIndexing(data)
        newMessagesInterseptor && newMessagesInterseptor(data)
        this.messages = data
        logger.info(`setHistoryMessages: length: ${data.length}, reverse:${this.reverse}`)
      },

      clearMessages () {
        this.messages.splice(0, this.messages.length)
        newMessagesInterseptor && newMessagesInterseptor([])
        this.clearSelected()
        logger.info('clearMessages')
      },

      setLimit (count) {
        this.limit = count
      },

      limiting ({ type, count }) {
        if (!this.limit) { return false }
        const messages = this.messages
        const pages = this.pages
        switch (type) {
          case 'init': {
            this.pages = count ? [count] : []
            break
          }
          case 'prev': {
            if (!count) { break }
            const pagesCount = pages.length
            if (pagesCount === 3) {
              const removeMessagesCount = pages[2]
              this.pages = [count, ...pages.slice(0, -1)]
              messages.splice(messages.length - removeMessagesCount, removeMessagesCount)
            } else {
              this.pages = [count, ...pages]
            }
            break
          }
          case 'next': {
            if (!count) { break }
            const pagesCount = pages.length
            if (pagesCount === 3) {
              const removeMessagesCount = pages[0]
              this.pages = [...pages.slice(1, 3), count]
              messages.splice(0, removeMessagesCount)
            } else if (pagesCount < 3) {
              pages.push(count)
            }
            break
          }
          case 'rt_init': {
            pages.push(0)
            break
          }
          case 'rt_deinit': {
            const removeMessagesCount = pages.pop()
            messages.splice(messages.length - removeMessagesCount, removeMessagesCount)
            break
          }
          case 'rt': {
            const pagesCount = pages.length
            const rtCount = pages[pagesCount - 1] || 0
            if (rtCount + count > this.limit) {
              if (pagesCount > 3) {
                const removeMessagesCount = pages[0]
                this.pages = [...pages.slice(1, -1), rtCount + count, 0]
                messages.splice(0, removeMessagesCount)
              } else {
                this.pages = [...pages.slice(0, -1), rtCount + count, 0]
              }
            } else {
              this.pages[pagesCount - 1] = rtCount + count
            }
          }
        }
        logger.info(`limiting: ${type} - count: ${count}`)
      },

      setFilter (value) {
        if (this.filter !== value) {
          this.filter = value
        }
        logger.info(`setFilter: ${value}`)
      },

      setItemtype (itemtype) {
        this.itemtype = itemtype
        logger.info(`setItemtype: ${itemtype}`)
      },

      setFrom (from) {
        this.from = from
        logger.info(`setFrom: ${from}`)
      },

      setTo (to) {
        this.to = to
        logger.info(`setTo: ${to}`)
      },

      reqStart (params) {
        logger.info(`reqStart: ${JSON.stringify(params)}`)
      },

      reqFullfiled () {
        logger.info('reqFullfiled')
      },

      reqError (error) {
        logger.info(`reqError: ${JSON.stringify(error)}`)
      },

      setReverse (val) {
        this.reverse = val
        logger.info(`setReverse: ${val}`)
      },

      async clear () {
        const api = this.origin.split('/')[0],
          origin = this.origin.replace(`${api}/`, '').replace(/\*/g, '+')
        this.clearMessages()
        this.filter = ''
        this.from = 0
        this.to = 0
        this.limit = 1000
        this.reverse = false
        await connector.unsubscribeLogs(api, origin, '#')
        logger.info('clear module')
        logger.info(`unsubscribeLogs ${api} ${origin}`)
      },

      setOrigin (origin) {
        this.origin = origin
        logger.info(`setOrigin: ${origin}`)
      },

      setCols (cols) {
        setColsLS(storage, this.lsNamespace, this.name, this.origin, cols)
        this.cols = cols
      },

      updateCols (cols) {
        this.setCols(cols)
      },

      setOffline () {
        this.offline = {
          start: Date.now() / 1000,
          lastMessageIndex: this.messages.length - 1
        }
        logger.info('setOffline')
      },

      setReconnected () {
        this.offline.end = Date.now() / 1000
        logger.info('setReconnected')
      },

      clearOfflineState () {
        this.offline = false
      },

      setMissingMessages ({ data, index }) {
        this.messages.splice(index + 1, 0, ...data)
        logger.info(`setMissingMessages: ${data.length}`)
      },

      setSelected (indexes) {
        this.selected = indexes
      },

      clearSelected () {
        this.selected = []
      },

      setItemDeletedStatus (flag) {
        this.isItemDeleted = flag
      },

      setCid (cid) {
        this.cid = cid
        logger.info(`setCid: ${cid}`)
      },

      /* ---------------------------------------------------------------- helpers */
      getParams () {
        const params = { filter: [] }
        if (this.limit) {
          params.count = this.limit
        }
        if (this.filter) {
          params.filter.push(`${this.filter}`)
        }
        if (this.from) {
          params.from = this.from / 1000
        }
        if (this.to) {
          params.to = this.to / 1000
        }
        if (this.reverse) {
          params.reverse = this.reverse
        }
        if (params.filter.length) {
          params.filter = params.filter.join(',')
        } else {
          delete params.filter
        }
        if (this.itemtype) {
          params.item_type = this.itemtype
        }
        return params
      },

      getHeaders () {
        const headers = {}
        if (this.cid) {
          headers['x-flespi-cid'] = this.cid
        }
        return headers
      },

      errorsCheck (data) {
        if (data.errors) {
          this.reqError(data.errors)
          data.errors.forEach((error) => {
            const errObject = new Error(error.reason)
            errorHandler && errorHandler(errObject)
          })
        } else {
          this.reqFullfiled()
        }
      },

      getLogsEntries (origin, deletedStatus) {
        const parts = origin.split('/'),
          id = parts.pop(),
          namespace = deletedStatus
            ? connector.http.platform.deleted
            : parts.reduce((result, part) => {
              return result[part]
            }, connector.http)
        let handler
        if (id === '*') {
          handler = (params) => {
            this.reqStart({ endpoint: 'getLogs', params })
            return namespace.logs.get({ data: JSON.stringify(params.data) }, { headers: params.headers })
          }
        } else if (deletedStatus) {
          handler = (params) => {
            this.reqStart({ endpoint: 'getLogs', params })
            return namespace.logs.get(encodeURIComponent(`origin=${origin}`), { data: JSON.stringify(params.data) }, { headers: params.headers })
          }
        } else {
          handler = (params) => {
            this.reqStart({ endpoint: 'getLogs', params })
            return namespace.logs.get(id, { data: JSON.stringify(params.data) }, { headers: params.headers })
          }
        }
        return handler
      },

      /* build the realtime MQTT topic (api, origin and $filter prefix) for the
         current state. MUST be used by both subscribe (pollingGet) and unsubscribe
         (unsubscribePooling) so the exact same topic is targeted — otherwise the
         old subscription is not removed and keeps delivering unfiltered logs. */
      getRealtimeTopic () {
        let api = this.origin.split('/')[0].replace(/\*/g, '+'),
          origin = this.origin.replace(`${api}/`, '').replace(/\*/g, '+')
        const f = []
        if (this.filter) {
          f.push(this.filter)
        }
        if (this.itemtype) {
          f.push('origin_type==' + this.itemtype)
          switch (this.itemtype) {
            case 4:
              origin = 'limits/+'
              break
            case 29:
              origin = 'realms/+'
              break
            case 33:
              origin = 'tokens/+'
              break
            case 37:
              origin = 'grants/+'
              break
            case 38:
              origin = 'identity-providers/+'
              break
            case 40:
              api = 'gw'
              origin = 'geofences/+'
              break
          }
        }
        let prefix = f.length ? `$filter/payload=${encodeURIComponent(f.join('&&'))}${this.cid ? `&cid=${this.cid}` : ''}` : undefined
        if (!prefix && this.cid) {
          prefix = `$filter/cid=${this.cid}`
        }
        return { api, origin, prefix }
      },

      initRenderLoop () {
        return setInterval(() => {
          if (this.messagesBuffer.length) {
            this.setRTMessages([...this.messagesBuffer])
            this.messagesBuffer = []
          }
        }, 500)
      },

      /* ---------------------------------------------------------------- actions */
      async getCols (initCols) {
        const colsSchema = getDefaultColsSchema(initCols || defaultCols)
        colsSchema.schemas._default.cols.push({ name: 'etc', width: 150, __dest: 'etc' })
        colsSchema.enum.etc = { name: 'etc', __dest: 'etc' }
        /* LS processing */
        const colsFromStorage = await getColsLS(storage, this.lsNamespace, this.name)
        const customColsSchemas = (colsFromStorage && colsFromStorage['custom-cols-schemas'])
          ? colsFromStorage['custom-cols-schemas'] : {}
        if (colsFromStorage && colsFromStorage[this.origin]) {
          const colsSchemaLS = colsFromStorage[this.origin]
          colsSchema.activeSchema = colsSchemaLS.activeSchema
          colsSchema.schemas = { ...colsSchema.schemas, ...colsSchemaLS.schemas, ...customColsSchemas, _default: colsSchema.schemas._default }
        }
        this.setCols(colsSchema)
      },

      async initTime () {
        const mainStore = useMainStore()
        if (mainStore.token && this.origin) {
          try {
            this.isLoading = true
            const params = {
              data: {
                reverse: true,
                count: 1,
                fields: 'timestamp'
              },
              headers: this.getHeaders()
            }
            if (this.itemtype) {
              params.data.item_type = this.itemtype
            }
            const resp = await this.getLogsEntries(this.origin, this.isItemDeleted)(params)
            const data = resp.data
            this.errorsCheck(data)
            let date = Date.now()
            if (data.result.length) {
              date = Math.round(data.result[0].timestamp * 1000)
            }
            const day = getFromTo(date)
            this.setFrom(day.from)
            this.setTo(day.to)
            if (day.to < Date.now()) {
              await this.newMessagesCheck()
            }
            this.isLoading = false
          } catch (e) {
            errorHandler && errorHandler(e)
            if (DEV) { console.log(e) }
            this.isLoading = false
          }
        }
      },

      async getLogs (params) {
        const mainStore = useMainStore()
        let result = []
        if (mainStore.token && this.origin) {
          const isLoadingActive = this.isLoading
          try {
            !isLoadingActive && (this.isLoading = true)
            const resp = await this.getLogsEntries(this.origin, this.isItemDeleted)({ data: params, headers: this.getHeaders() })
            const data = resp.data
            this.errorsCheck(data)
            !isLoadingActive && (this.isLoading = false)
            result = data.result || []
          } catch (e) {
            errorHandler && errorHandler(e)
            if (DEV) { console.log(e) }
            !isLoadingActive && (this.isLoading = false)
          }
        }
        return result
      },

      async getLogsByInitTimestamp (initTimestamp) {
        const params = this.getParams()
        const beforeMessagesParams = {
          ...params,
          from: this.from / 1000,
          to: initTimestamp,
          reverse: true,
          count: this.limit / 2
        }
        const beforeMessages = await this.getLogs(beforeMessagesParams)
        const afterMessagesParams = {
          ...params,
          from: initTimestamp + 0.000001,
          to: this.to / 1000,
          count: this.limit - beforeMessages.length
        }
        const afterMessages = await this.getLogs(afterMessagesParams)
        return [...beforeMessages.reverse(), ...afterMessages]
      },

      async get (initTimestamp) {
        if (!this.isLoading) {
          this.isLoading = true
          if (this.loopId) {
            await this.unsubscribePooling()
          }
          const start = (Date.now() + 0.000999) / 1000
          let messagesCount = 0
          let messages = []
          const params = this.getParams()
          if (initTimestamp) {
            messages = await this.getLogsByInitTimestamp(initTimestamp)
          } else {
            messages = await this.getLogs(params)
          }
          messagesCount += messages.length
          const now = (Date.now() + 0.000999) / 1000
          const needRT = (params.to >= now && (this.limit && messages.length < this.limit) && !this.loopId)
          let startRTRender = () => {}
          if (needRT) {
            startRTRender = await this.pollingGet()
            if (initTimestamp) {
              const stop = (Date.now() + 0.000999) / 1000
              const params = this.getParams()
              params.from = start
              params.to = stop
              const missedMessages = await this.getLogs(params)
              messagesCount += missedMessages.length
              messages.splice(0, 0, ...missedMessages)
            }
          } else if ((params.to < now || (this.limit && messages.length >= this.limit)) && this.loopId) {
            await this.unsubscribePooling()
          }
          this.limiting({ type: 'init', count: messagesCount })
          this.setHistoryMessages(messages)
          if (needRT || this.realtimeEnabled) {
            startRTRender()
            this.limiting({ type: 'rt_init' })
          }
          this.isLoading = false
        }
      },

      async getHistory (count) {
        const limit = this.limit
        this.clearMessages()
        this.setReverse(true)
        this.setLimit(count)
        await this.get()
        this.setReverse(false)
        this.setLimit(limit)
      },

      async getPrevPage () {
        if (!this.isLoading) {
          this.isLoading = true
          const to = _get(this, 'messages[0].timestamp', this.to) - 0.000001
          const params = this.getParams()
          params.to = to
          params.reverse = true
          if (this.itemtype) {
            params.item_type = this.itemtype
          }
          if (this.loopId && this.messages.length > this.limit * 2) {
            await this.unsubscribePooling()
            this.limiting({ type: 'rt_deinit' })
          }
          const messages = await this.getLogs(params)
          if (!messages.length) {
            this.isLoading = false
            return 0
          }
          this.limiting({ type: 'prev', count: messages.length })
          this.prependMessages(messages)
          this.isLoading = false
          return messages.length
        }
      },

      async getNextPage () {
        if (!this.isLoading) {
          if (this.realtimeEnabled) { return }
          this.isLoading = true
          const start = Date.now()
          const from = _get(this, `messages[${this.messages.length - 1}].timestamp`, this.from) + 0.000001
          const params = this.getParams()
          let messagesCount = 0
          params.from = from
          const messages = await this.getLogs(params)
          messagesCount += messages.length
          const needRT = (params.to > Math.floor(Date.now() / 1000) && (this.limit && messages.length < this.limit) && !this.loopId)
          let startRTRender = () => {}
          if (needRT) {
            startRTRender = await this.pollingGet()
            const stop = Date.now()
            const params = this.getParams()
            params.from = start / 1000
            params.to = stop / 1000
            const missedMessages = await this.getLogs(params)
            messagesCount += missedMessages.length
            messages.splice(messages.length, 0, ...missedMessages)
          }
          this.limiting({ type: 'next', count: messagesCount })
          this.appendMessages(messages)
          if (needRT) {
            startRTRender()
            this.limiting({ type: 'rt_init' })
          }
          this.isLoading = false
          return messagesCount
        }
      },

      async pollingGet () {
        const { api, origin, prefix } = this.getRealtimeTopic()
        await connector.subscribeLogs(api, origin, '#', (message) => {
          this.messagesBuffer.push(JSON.parse(message))
        }, { rh: 2, prefix })
        this.realtimeEnabled = true
        logger.info(`subscribed to Logs ${api} ${origin} ${prefix || ''}`)
        return () => {
          this.loopId = this.initRenderLoop()
        }
      },

      /* getting missed messages after offline */
      async getMissedMessages () {
        const mainStore = useMainStore()
        if (mainStore.token && this.origin) {
          try {
            this.isLoading = true
            const { start, end, lastMessageIndex } = this.offline
            const params = {
              data: {
                from: start,
                to: end
              },
              headers: this.getHeaders()
            }
            if (this.filter) { params.data.filter = this.filter }
            const resp = await this.getLogsEntries(this.origin, this.isItemDeleted)(params)
            const data = resp.data
            this.errorsCheck(data)
            this.setMissingMessages({ data: data.result, index: lastMessageIndex })
            this.isLoading = false
          } catch (e) {
            errorHandler && errorHandler(e)
            if (DEV) { console.log(e) }
            this.isLoading = false
          }
        }
      },

      /* unsubscribe from current active topic */
      async unsubscribePooling () {
        const { api, origin, prefix } = this.getRealtimeTopic()
        if (this.loopId) {
          clearInterval(this.loopId)
          this.messagesBuffer = []
          this.loopId = 0
        }
        await connector.unsubscribeLogs(api, origin, '#', undefined, { prefix })
        this.realtimeEnabled = false
        logger.info(`unsubscribed to Logs ${api} ${origin} ${prefix || ''}`)
      },

      async newMessagesCheck () {
        const api = this.origin.split('/')[0].replace(/\*/g, '+'),
          origin = this.origin.replace(`${api}/`, '').replace(/\*/g, '+')
        let properties = {}
        if (this.cid) {
          properties = { userProperties: { cid: this.cid } }
        }
        this.hasNewMessages = false
        await connector.subscribeLogs(api, origin, '#', () => {
          this.hasNewMessages = true
          this.unsubscribePooling()
        }, { rh: 2, properties })
        logger.info(`newMessagesCheck subscribed to messagesLogs ${api} ${origin}`)
      }
    }
  })
}

export function useLogsStore (config) {
  return useListStore(createLogsStore, config)
}

export { disposeListStore }
