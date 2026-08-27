/*
 * The devicesMessages list store — the Vuex module the Vue 2 build registered under the list's name,
 * with mutations and actions folded into one flat list of Pinia actions under their old names.
 *
 * `messagesBuffer` and `loopId` used to be closure variables of the module factory; they live in
 * the store now so that a store handed back from the registry keeps the buffer it is rendering.
 */
import { defineStore } from 'pinia'
import _get from 'lodash/get'
import { getColsLS, setColsLS } from './ls'
import { connector } from 'src/services/connector'
import { useMainStore } from 'src/stores/main'
import appLogger from 'src/infrastructure/appLogger'
import { useListStore } from './registry'

const defaultCols = ['timestamp', 'server.timestamp', 'ident', 'position.latitude', 'position.longitude', 'position.altitude', 'position.speed']

export function createDevicesMessagesStore ({ name, lsNamespace, storage, errorHandler, newMessagesInterseptor }) {
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

  return defineStore(`qvs-devicesMessages-${name}`, {
    state: () => ({
      name,
      lsNamespace,
      isLoading: false,
      active: 0,
      messages: [],
      pages: [],
      filter: '',
      settings: {},
      realtimeEnabled: false,
      from: 0,
      to: 0,
      limit: 1000,
      reverse: false,
      cols: undefined,
      offline: false,
      selected: [],
      sortBy: null,
      hasNewMessages: null,
      messagesBuffer: [],
      loopId: 0,
      /* set by the list component the first time it sets this store up */
      initialized: false,
      /* the hex viewer needs the component to build it, so it is settable rather than captured by the factory */
      newMessagesInterseptor
    }),

    actions: {
      setRTMessages (data) {
        if (data && data.length) {
          messagesIndexing(data)
          const messages = this.messages
          if (this.sortBy) {
            /* write by sorted field */
            const message = data[0],
              fieldName = this.sortBy,
              length = this.messages.length - 1
            let index = null,
              escapeFlag = true
            if (length > 0) {
              for (let i = length; i !== 0 || escapeFlag; i--) {
                if (messages[i][fieldName] > message[fieldName]) {
                  index = i
                  if (i === 0) {
                    escapeFlag = false
                  }
                } else {
                  escapeFlag = false
                }
              }
            }
            this.newMessagesInterseptor && this.newMessagesInterseptor(data)
            if (index) {
              messages.splice(index, 0, ...data)
            } else {
              messages.splice(messages.length, 0, ...data)
            }
          } else {
            this.newMessagesInterseptor && this.newMessagesInterseptor(data)
            messages.splice(messages.length, 0, ...data)
          }
          this.limiting({ type: 'rt', count: data.length })
          logger.info(`setRTMessages: length: ${data.length}`)
        }
      },

      prependMessages (data) {
        if (data && data.length) {
          data.reverse()
          const messages = this.messages
          messagesIndexing(data)
          this.newMessagesInterseptor && this.newMessagesInterseptor(data)
          messages.splice(0, 0, ...data)
        }
        logger.info(`prependMessages: length: ${data.length}`)
      },

      appendMessages (data) {
        if (data && data.length) {
          const messages = this.messages
          messagesIndexing(data)
          this.newMessagesInterseptor && this.newMessagesInterseptor(data)
          messages.splice(messages.length, 0, ...data)
        }
        logger.info(`appendMessages: length: ${data.length}`)
      },

      setHistoryMessages (data) {
        if (this.reverse) {
          data.reverse()
        }
        messagesIndexing(data)
        this.newMessagesInterseptor && this.newMessagesInterseptor(data)
        this.messages = data
        logger.info(`setHistoryMessages: length: ${data.length}, reverse:${this.reverse}`)
      },

      clearMessages () {
        this.messages.splice(0, this.messages.length)
        this.newMessagesInterseptor && this.newMessagesInterseptor([])
        this.clearSelected()
        logger.info(`clearMessages`)
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
        logger.info(`reqFullfiled`)
      },

      reqError (error) {
        logger.info(`reqError: ${JSON.stringify(error)}`)
      },

      setActive (id) {
        this.active = id
        logger.info(`setActive: ${id}`)
      },

      setReverse (val) {
        this.reverse = val
        logger.info(`setReverse: ${val}`)
      },

      async clear () {
        this.clearMessages()
        this.filter = ''
        this.from = 0
        this.to = 0
        this.limit = 1000
        this.reverse = false
        await connector.unsubscribeMessagesDevices(this.active)
        logger.info(`clear module`)
        logger.info(`unsubscribeMessagesDevices ${this.active}`)
      },

      setCols (cols) {
        setColsLS(storage, this.lsNamespace, this.name, this.settings.device_type_id, cols)
        this.cols = cols
      },

      setSettings (device) {
        this.settings = device
        logger.info(`setSettings: ${device}`)
      },

      setOffline () {
        this.offline = {
          start: Date.now() / 1000,
          lastMessageIndex: this.messages.length - 1
        }
        logger.info(`setOffline`)
      },

      setReconnected () {
        this.offline.end = Date.now() / 1000
        logger.info(`setReconnected`)
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

      setSortBy (field) {
        this.sortBy = field
      },

      clearSortBy () {
        this.sortBy = null
      },

      getParams () {
        const params = {}
        if (this.limit) {
          params.count = this.limit
        }
        if (this.filter) {
          params.filter = `${this.filter}`
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
        return params
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

      getDefaultEnum () {
        const locale = new Date().toString().match(/([-+][0-9]+)\s/)[1]
        return defaultCols.reduce((res, name) => {
          res[name] = { name }
          if (name.match(/timestamp$/)) {
            res[name].addition = `${locale.slice(0, 3)}:${locale.slice(3)}`
            res[name].type = ''
            res[name].unit = ''
          }
          return res
        }, {})
      },

      getDefaultColsSchema () {
        return {
          activeSchema: '_default',
          schemas: {
            _default: {
              name: '_default',
              cols: defaultCols.map(name => ({ name, width: 150 }))
            }
          },
          enum: this.getDefaultEnum()
        }
      },

      async getCols (sysColsNeedInitFlags) {
            const mainStore = useMainStore()
        const needEtc = sysColsNeedInitFlags.etc
        if (mainStore.token && this.active) {
          try {
            this.isLoading = true
            /* getting device info */
            const deviceResp = await connector.gw.getDevices(this.active)
            const deviceData = deviceResp.data
            this.errorsCheck(deviceData)
            const device = deviceData.result && deviceData.result[0]
            this.setSettings(device)
            let colsFromStorage = await getColsLS(storage, this.lsNamespace, this.name)
            const customColsSchemas = (colsFromStorage && colsFromStorage['custom-cols-schemas'])
            ? colsFromStorage['custom-cols-schemas'] : {}
            colsFromStorage = (colsFromStorage && colsFromStorage[device.device_type_id])
            const colsSchema = colsFromStorage || this.getDefaultColsSchema()
            colsSchema.schemas = { ...colsSchema.schemas, ...customColsSchemas }
            if (!colsSchema.enum) {
              colsSchema.enum = this.getDefaultEnum()
            }
            if (device.device_type_id) {
              /* getting protocol id */
              const protocolResp = await connector.gw.getChannelProtocolsDeviceTypes('all', device.device_type_id, { fields: 'protocol_id' })
              this.reqStart({ endpoint: 'getChannelProtocolsDeviceTypes', active:  device.device_type_id, fields: 'protocol_id' })
              const protocolData = protocolResp.data
              this.errorsCheck(protocolData)
              const protocolId = protocolData.result && protocolData.result[0] && protocolData.result[0].protocol_id
              /* gettings messages parameters */
              const messageParamsResp = await connector.gw.getChannelProtocols(protocolId, { fields: 'message_parameters' })
              this.reqStart({ endpoint: 'getChannelProtocols', active: protocolId, fields: 'message_parameters' })
              const messageParamsData = messageParamsResp.data
              this.errorsCheck(messageParamsData)
              const messageParams = messageParamsData.result && messageParamsData.result[0] && messageParamsData.result[0].message_parameters
              /* initing columns by message parameters */
              colsSchema.schemas._protocol = {
                name: '_protocol',
                cols: []
              }
              const locale = new Date().toString().match(/([-+][0-9]+)\s/)[1]
              messageParams.forEach((param) => {
                const name = param.name
                const enumCol = {
                  name,
                  type: param.type || '',
                  unit: param.unit || '',
                  description: param.info || ''
                }
                const schemaCol = {
                  name,
                  width: 150
                }
                if (name.match(/timestamp$/)) {
                  enumCol.addition = `${locale.slice(0, 3)}:${locale.slice(3)}`
                  enumCol.type = ''
                  enumCol.unit = ''
                  schemaCol.width = 190
                  if (name === 'timestamp') {
                    colsSchema.schemas._protocol.cols.unshift(schemaCol)
                    colsSchema.enum.timestamp = enumCol
                    return
                  }
                }
                colsSchema.schemas._protocol.cols.push(schemaCol)
                colsSchema.enum[name] = enumCol
              })
            }
            if (needEtc) {
              device.device_type_id && colsSchema.schemas._protocol.cols.push({ name: 'etc', width: 150, __dest: 'etc' })
              !colsFromStorage && colsSchema.schemas._default.cols.push({ name: 'etc', width: 150, __dest: 'etc' })
            }
            colsSchema.enum.etc = { name: 'etc', __dest: 'etc' }
            this.setCols(colsSchema)
            this.isLoading = false
          } catch (e) {
            errorHandler && errorHandler(e)
            if (DEV) { console.log(e) }
            this.isLoading = false
          }
        }
      },

      getFromTo (val) {
        const now = val || Date.now(),
          from = new Date(now).setHours(0, 0, 0, 0),
          to = from + 86399999.999
        return { from, to }
      },

      async initTime () {
            const mainStore = useMainStore()
        if (mainStore.token && this.active) {
          try {
            this.isLoading = true
            const params = {
              reverse: true,
              count: 1,
              fields: 'timestamp'
            }
            const resp = await connector.gw.getDevicesMessages(this.active, { data: JSON.stringify(params) })
            this.reqStart({ endpoint: 'getDevicesMessages-initTime', active: this.active, data: JSON.stringify(params) })
            const data = resp.data
            this.errorsCheck(data)
            let date = Date.now()
            if (data.result.length) {
              date = Math.round(data.result[0].timestamp * 1000)
            }
            const day = this.getFromTo(date)
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

      async getMessages (params) {
            const mainStore = useMainStore()
        let result = []
        if (mainStore.token && this.active) {
          const isLoadingActive = this.isLoading
          try {
            !isLoadingActive && (this.isLoading = true)
            const resp = await connector.gw.getDevicesMessages(this.active, { data: JSON.stringify(params) })
            this.reqStart({ endpoint: 'getDevicesMessages', active: this.active, data: JSON.stringify(params) })
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

      async getMessagesByInitTimestamp (initTimestamp) {
        const params = this.getParams()
        const beforeMessagesParams = {
          ...params,
          from: this.from / 1000,
          to: initTimestamp,
          reverse: true,
          count: this.limit / 2
        }
        const beforeMessages = await this.getMessages(beforeMessagesParams)
        const afterMessagesParams = {
          from: initTimestamp + 0.000001,
          to: this.to / 1000,
          count: this.limit - beforeMessages.length
        }
        const afterMessages = await this.getMessages(afterMessagesParams)
        const messages = [...beforeMessages.reverse(), ...afterMessages]
        return messages
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
            messages = await this.getMessagesByInitTimestamp(initTimestamp)
          } else {
            messages = await this.getMessages(params)
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
              const missedMessages = await this.getMessages(params)
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

      async getPrevPage () {
        if (!this.isLoading) {
          this.isLoading = true
          const to = _get(this, 'messages[0].timestamp', this.to) - 0.000001
          const params = this.getParams()
          params.to = to
          params.reverse = true
          if (this.loopId && this.messages.length > this.limit * 2) {
            await this.unsubscribePooling()
            this.limiting({ type: 'rt_deinit' })
          }
          const messages = await this.getMessages(params)
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
          const messages = await this.getMessages(params)
          messagesCount += messages.length
          const needRT = (params.to > Math.floor(Date.now() / 1000) && (this.limit && messages.length < this.limit) && !this.loopId)
          let startRTRender = () => {}
          if (needRT) {
            startRTRender = await this.pollingGet()
            const stop = Date.now()
            const params = this.getParams()
            params.from = start / 1000
            params.to = stop / 1000
            const missedMessages = await this.getMessages(params)
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

      async getHistory (count) {
        const limit = this.limit
        this.clearMessages()
        this.setReverse(true)
        this.setLimit(count)
        await this.get()
        this.setReverse(false)
        this.setLimit(limit)
      },

      initRenderLoop () {
        return setInterval(() => {
          if (this.messagesBuffer.length) {
            this.setRTMessages([...this.messagesBuffer])
            this.messagesBuffer = []
          }
        }, 500)
      },

      async pollingGet () {
        const filter = this.filter ? `$filter/payload=${encodeURIComponent(this.filter)}` : undefined
        await connector.subscribeMessagesDevices(this.active, (message) => {
          this.messagesBuffer.push(JSON.parse(message))
        }, { rh: 2, prefix: filter })
        this.realtimeEnabled = true
        logger.info(`subscribed to messagesDevices ${this.active} ${filter || ''}`)
        return () => {
          this.loopId = this.initRenderLoop()
        }
      },

      async unsubscribePooling () {
        if (this.loopId) {
          clearInterval(this.loopId)
          this.messagesBuffer = []
          this.loopId = 0
        }
        const filter = this.filter ? `$filter/payload=${encodeURIComponent(this.filter)}` : undefined
        await connector.unsubscribeMessagesDevices(this.active, undefined, { prefix: filter })
        this.realtimeEnabled = false
        logger.info(`unsubscribed to messagesDevices ${this.active} ${filter || ''}`)
      },

      async getMissedMessages () {
            const mainStore = useMainStore()
        if (mainStore.token && this.active) {
          try {
            this.isLoading = true
            const { start, end, lastMessageIndex } = this.offline
            const params = {
              from: start,
              to: end
            }
            if (this.filter) { params.data.filter = this.filter }
            const resp = await connector.gw.getDevicesMessages(this.active, { data: JSON.stringify(params) })
            this.reqStart({ endpoint: 'getDevicesMessages', active: this.active, data: JSON.stringify(params) })
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

      async newMessagesCheck () {
        this.hasNewMessages = false
        await connector.subscribeMessagesDevices(this.active, () => {
          this.hasNewMessages = true
          this.unsubscribePooling()
        }, { rh: 2 })
        logger.info(`newMessagesCheck subscribed to messagesDevice ${this.active}`)
      },

      updateCols (cols) {
        this.setCols(cols)
      },
    }
  })
}

export function useDevicesMessagesStore (config) {
  return useListStore(createDevicesMessagesStore, config)
}
