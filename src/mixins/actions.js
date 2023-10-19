import { parse } from 'json2csv'
import { date } from 'quasar'
export default {
  data () {
    return {
      isFileCsvLoading: false
    }
  },
  methods: {
    async exportCsv (params, { from, to }, source) {
      this.$q.dialog(
        {
          title: 'Export CSV',
          cancel: {
            color: 'white',
            flat: true
          },
          ok: {
            color: 'white',
            flat: true
          },
          persistent: true,
          dark: true,
          options: {
            type: 'toggle',
            model: [],
            items: [
              { label: 'Format timestamps', value: 'needFormat', color: 'primary' }
            ]
          },
          noRouteDismiss: true
        }
      )
        .onOk((data) => {
          const moduleState = this.$store.state[this.moduleName]
          const colsSchema = moduleState.cols
          const cols = colsSchema.schemas[colsSchema.activeSchema].cols.filter(col => !col.__dest).map(col => col.name)
          this.isFileCsvLoading = true
          params.fields = cols.join(',')
          this.$store.dispatch(`${this.moduleName}/${this.actionName ? this.actionName : 'getMessages'}`, params)
            .then(messages => {
              if (!messages || !messages.length) {
                this.$q.notify({
                  type: 'negative',
                  message: `Messages are empty or file is too big.`,
                  position: 'bottom-right'
                })
                return false
              }
              if (data.includes('needFormat')) {
                messages.forEach(message => {
                  Object.keys(message).forEach(name => {
                    if (name.match(/timestamp$/) || name === 'begin' || name === 'end') {
                      const time = Math.floor(message[name] * 1000)
                      message[name] = date.formatDate(time, 'DD/MM/YYYY HH:mm:ss')
                    }
                  })
                })
              }
              if (this.getLogDescriptionByItem) {
                messages.forEach(message => {
                  if (message['event_code']) {
                    console.log('event_code')
                    message['event_code'] = message['event_code'] + ': ' + this.getLogDescriptionByItem(message)
                  }
                })
              }
              let csv = ''
              try {
                csv = parse(messages, { fields: cols })
              } catch (e) { console.log(e) }
              if (csv) {
                const typeOfFile = 'text/csv',
                  link = document.createElement('a'),
                  content = csv,
                  blob = new Blob([content], { type: typeOfFile }),
                  data = URL.createObjectURL(blob),
                  fileName = `${this.item.name || '*NoName*'}[${date.formatDate(from, 'DD.MM.YYYY HH-mm-ss')}-${date.formatDate(to, 'DD.MM.YYYY HH-mm-ss')}].csv`
                link.setAttribute('href', data)
                link.setAttribute('download', fileName)
                link.style.display = 'none'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
              this.isFileCsvLoading = false
            })
            .catch(e => {
              console.log(e)
              this.isFileCsvLoading = false
            })
        })
    }
  }
}
