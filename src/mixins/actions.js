import { parse } from 'json2csv'
import { date } from 'quasar'
export default {
  data () {
    return {
      isFileCsvLoading: false
    }
  },
  methods: {
    async exportCsv () {
      const moduleState = this.$store.state[this.moduleName]
      const params = {
        filter: `${moduleState.filter}`,
        from: Math.floor(moduleState.from / 1000),
        to: Math.floor(moduleState.to / 1000)
      }
      this.isFileCsvLoading = true
      const messages = await this.$store.dispatch(`${this.moduleName}/getMessages`, params)
      const colsSchema = moduleState.cols
      const cols = colsSchema.schemas[colsSchema.activeSchema].cols.map(col => col.name)
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
          fileName = `${this.item.name || '*NoName*'}[${date.formatDate(moduleState.from, 'DD.MM.YYYY HH-mm-ss')}-${date.formatDate(moduleState.to, 'DD.MM.YYYY HH-mm-ss')}].csv`
        link.setAttribute('href', data)
        link.setAttribute('download', fileName)
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      this.isFileCsvLoading = false
    }
  }
}
