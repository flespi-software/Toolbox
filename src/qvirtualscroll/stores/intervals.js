/*
 * The intervals list store — the Vuex module the Vue 2 build registered under the list's name,
 * with mutations and actions folded into one flat list of Pinia actions under their old names.
 *
 * `messagesBuffer` and `loopId` used to be closure variables of the module factory; they live in
 * the store now so that a store handed back from the registry keeps the buffer it is rendering.
 */
import { defineStore } from 'pinia'
import { getColsLS, setColsLS } from './ls'
import { connector } from 'src/services/connector'
import { useMainStore } from 'src/stores/main'
import appLogger from 'src/infrastructure/appLogger'
import { useListStore } from './registry'

const defaultCols = ['begin', 'end', 'duration', 'timestamp', 'id']

export function createIntervalsStore ({ name, lsNamespace, storage, errorHandler, newMessagesInterseptor }) {
  const logger = appLogger.extendName(name)

  return defineStore(`qvs-intervals-${name}`, {
    state: () => ({
      name,
      lsNamespace,
      isLoading: false,
      active: 0,
      activeDevice: 0,
      messages: {},
      filter: '',
      sysFilter: '',
      begin: Date.now() - 86400000,
      end: Date.now(),
      limit: 1000,
      reverse: false,
      cols: undefined,
      selected: [],
      sortBy: null,
      messagesBuffer: [],
      intervalId: 0,
      /* set by the list component the first time it sets this store up */
      initialized: false,
      /* the hex viewer needs the component to build it, so it is settable rather than captured by the factory */
      newMessagesInterseptor
    }),

    actions: {
      setMessages (data) {
        if (data && data.length) {
          if (this.reverse) {
            data.reverse()
          }
          let messages = this.messages
          this.newMessagesInterseptor && this.newMessagesInterseptor(data)
          messages = data.reduce((result, message) => {
            result[message.id] = message
            return result
          }, {})
          this.messages = messages
        } else {
          this.messages = []
        }
        logger.info(`setMessages: length: ${data.length}`)
      },

      clearMessages () {
        this.messages = []
        this.newMessagesInterseptor && this.newMessagesInterseptor([])
        this.clearSelected()
        logger.info(`clearMessages`)
      },

      setLimit (count) {
        this.limit = count
      },

      setFilter (value) {
        if (this.filter !== value) {
          this.filter = value
        }
        logger.info(`setFilter: ${value}`)
      },

      setBegin (begin) {
        this.begin = begin
        logger.info(`setBegin: ${begin}`)
      },

      setEnd (end) {
        this.end = end
        logger.info(`setEnd: ${end}`)
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
        this.newMessagesCount = 0
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
        this.begin = 0
        this.end = 0
        this.limit = 1000
        this.reverse = false
        await connector.unsubscribeIntervals(this.active)
        logger.info(`clear module`)
        logger.info(`unsubscribeIntervals ${this.active}`)
      },

      setCols (cols) {
        setColsLS(storage, this.lsNamespace, this.name, this.active, cols)
        this.cols = cols
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

      setActiveDevice (id) {
        this.activeDevice = id
        logger.info(`setActiveDevice: ${id}`)
      },

      getParams () {
        const params = {}
        if (this.limit) {
          params.count = this.limit
        }
        if (this.filter && this.sysFilter) {
          params.filter = `${this.sysFilter},${this.filter}`
        } else if (this.sysFilter && !this.filter) {
          params.filter = `${this.sysFilter}`
        } else if (!this.sysFilter && this.filter) {
          params.filter = `${this.filter}`
        }
        if (this.begin && !this.reverse) {
          if (!this.reverse) {
            params.begin = Math.floor(this.begin / 1000)
          }
        }
        if (this.end) {
          params.end = Math.floor(this.end / 1000)
        }
        if (this.reverse) {
          params.reverse = this.reverse
        }
        return params
      },

      getDefaultEnum () {
        const locale = new Date().toString().match(/([-+][0-9]+)\s/)[1]
        return defaultCols.reduce((res, name) => {
          res[name] = { name }
          if (name.match(/timestamp$/) || name === 'begin' || name === 'end') {
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
            },
            _protocol: {
              name: '_protocol',
              cols: defaultCols.map(name => ({ name, width: 150 }))
            }
          },
          enum: this.getDefaultEnum()
        }
      },

      async getCols (counters) {
        let colsFromStorage = await getColsLS(storage, this.lsNamespace, this.name)
        /* named presets are shared by every calculator of the list, so they are read before narrowing down to one */
        const customColsSchemas = (colsFromStorage && colsFromStorage['custom-cols-schemas'])
          ? colsFromStorage['custom-cols-schemas'] : {}
        colsFromStorage = colsFromStorage[this.active]
        const colsSchema = colsFromStorage || this.getDefaultColsSchema()
        if (!colsSchema.enum) {
          colsSchema.enum = this.getDefaultEnum()
        }
        colsSchema.schemas = { ...colsSchema.schemas, ...customColsSchemas }
        /* the protocol schema is not stored — rebuild it from the calculator counters on every load */
        colsSchema.schemas._protocol = {
          name: '_protocol',
          cols: defaultCols.map(name => ({ name, width: 150 }))
        }
        const locale = new Date().toString().match(/([-+][0-9]+)\s/)[1]
        counters.forEach(counter => {
          const name = counter.name
          const enumCol = {
            name,
            description: `${counter.name}[${counter.type}]`
          }
          const schemaCol = {
            name,
            width: 100
          }
          if (name.match(/timestamp$/) || name === 'begin' || name === 'end') {
            enumCol.addition = `${locale.slice(0, 3)}:${locale.slice(3)}`
            enumCol.type = ''
            enumCol.unit = ''
            schemaCol.width = 190
          }
          colsSchema.schemas._protocol.cols.push(schemaCol)
          colsSchema.enum[name] = enumCol
        })
        colsSchema.schemas._protocol.cols.push({ name: 'etc', width: 150, __dest: 'etc' })
        !colsFromStorage && colsSchema.schemas._default.cols.push({ name: 'etc', width: 150, __dest: 'etc' })
        colsSchema.enum.etc = { name: 'etc', __dest: 'etc' }
        this.setCols(colsSchema)
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

      async initTime () {
            const mainStore = useMainStore()
        if (mainStore.token && this.active && this.activeDevice) {
          try {
            this.isLoading = true
            const params = {
              reverse: true,
              count: 1,
              fields: 'end,begin'
            }
            const resp = await connector.gw.getCalcsDevicesIntervals(this.active, this.activeDevice, 'all', { data: JSON.stringify(params) })
            this.reqStart({ endpoint: 'getCalcsDevicesIntervals-initTime', active: this.active, device: this.activeDevice, data: JSON.stringify(params) })
            const data = resp.data
            this.errorsCheck(data)
            let dateBegin = Date.now(),
              dateEnd = Date.now()
            if (data.result.length) {
              dateBegin = Math.round(data.result[0].begin * 1000)
              dateEnd = Math.round(data.result[0].end * 1000)
            }
            dateBegin = new Date(dateBegin)
            dateBegin.setHours(0, 0, 0, 0)
            dateEnd = new Date(dateEnd)
            dateEnd.setHours(23, 59, 59, 999)
            this.setBegin(dateBegin.valueOf())
            this.setEnd(dateEnd.valueOf() + 0.999)
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
        let messages = []
        this.reqStart()
        if (mainStore.token && this.active && this.activeDevice) {
          try {
            this.isLoading = true
            const resp = await connector.gw.getCalcsDevicesIntervals(this.active, this.activeDevice, 'all', { data: JSON.stringify(params) })
            this.reqStart({ endpoint: 'getCalcsDevicesIntervals', active: this.active, device: this.activeDevice, data: JSON.stringify(params) })
            const data = resp.data
            this.errorsCheck(data)
            messages = data.result
            this.isLoading = false
          } catch (e) {
            errorHandler && errorHandler(e)
            if (DEV) { console.log(e) }
            this.isLoading = false
          }
        }
        return messages
      },

      async get () {
        const messages = await this.getMessages(this.getParams())
        this.setMessages(messages)
      },

      messageProcessing (packet) {
        const message = JSON.parse(packet.payload)
        const topic = packet.topic
        const event = topic.split('/').slice(-1)[0]
        switch (event) {
          case 'created': {
            const begin = this.begin,
              end = this.end,
              endDate = new Date(end),
              intervalBegin = message.begin * 1000,
              intervalEnd = message.end * 1000,
              nowDate = new Date(),
              isCurrentEndInTodayRange = endDate.getDate() === nowDate.getDate() && endDate.getMonth() === nowDate.getMonth() && endDate.getFullYear() === nowDate.getFullYear()
            if ((intervalBegin <= end && intervalEnd >= begin) || isCurrentEndInTodayRange) {
              this.messages[message.id] = message
            }
            break
          }
          case 'updated': {
            if (this.messages[message.id]) {
              this.messages[message.id] = message
            }
            break
          }
          case 'finished': {
            if (this.messages[message.id]) {
              this.messages[message.id] = message
            }
            break
          }
          case 'deleted': {
            if (this.messages[message.id]) {
              delete this.messages[message.id]
            }
            break
          }
        }
      },

      initRenderLoop () {
        return setInterval(() => {
          if (this.messagesBuffer.length) {
            this.messagesBuffer.forEach(message => this.messageProcessing(message))
            this.messagesBuffer = []
          }
        }, 500)
      },

      async pollingGet () {
        this.intervalId = this.initRenderLoop()
        await connector.subscribeIntervals(this.active, this.activeDevice, '+', (message, topic, packet) => {
          this.messagesBuffer.push(packet)
        }, { rh: 2 })
        logger.info(`subscribed to Intervals ${this.active} - ${this.activeDevice}`)
      },

      async unsubscribePooling () {
        if (this.intervalId) { clearInterval(this.intervalId) }
        await connector.unsubscribeIntervals(this.active, this.activeDevice, '+')
        logger.info(`unsubscribed to Intervals ${this.active} - ${this.activeDevice}`)
      },

      updateCols (cols) {
        this.setCols(cols)
      },
    }
  })
}

export function useIntervalsStore (config) {
  return useListStore(createIntervalsStore, config)
}
