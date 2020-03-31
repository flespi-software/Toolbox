<template>
  <q-dialog :maximized="$q.platform.is.mobile" ref="modal" :no-esc-dismiss="loadingFlag" :no-backdrop-dismiss="loadingFlag">
    <q-card :style="{minWidth: $q.platform.is.mobile ? '100%' : '310px', height: $q.platform.is.mobile ? '100%' : 'auto'}">
      <q-card-section :style="{height: 'calc(100% - 54px)'}" class="q-pa-sm">
        <date-range-picker
          v-model="currentDateRange"
        />
        <q-select
          :options="selectOpts" v-model="currentFormat"
          filled label="Format" hide-bottom-space dense bg-color="grey-3"
        />
      </q-card-section>
      <q-separator color="white"/>
      <q-card-actions align="right" class="bg-grey-9 text-white">
        <q-btn flat @click="hide" :disable="loadingFlag">Close</q-btn>
        <q-btn flat @click="importHandler" :disable="loadingFlag" :loading="loadingFlag">Export</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { DateRangePicker } from 'datetimerangepicker'
import convertMixin from '../../mixins/convert'
import { date } from 'quasar'
export default {
  props: ['format', 'dateRange', 'config', 'ident'],
  data () {
    return {
      currentFormat: this.format,
      currentDateRange: this.dateRange.map(date => new Date(date)),
      moduleName: this.config.vuexModuleName,
      loadingFlag: false,
      selectOpts: ['hex', 'text', 'base64']
    }
  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    hide () {
      this.$refs.modal.hide()
    },
    formatData (base64) {
      let content = null
      if (this.currentFormat === 'hex') {
        content = this.base64ToHex(base64)
      } else if (this.currentFormat === 'text') {
        content = this.base64ToText(base64)
      } else {
        content = base64
      }
      return content
    },
    async importHandler () {
      this.loadingFlag = true
      const params = { from: Math.floor(this.currentDateRange[0].valueOf() / 1000), to: Math.floor(this.currentDateRange[1].valueOf() / 1000) }
      const events = await this.$store.dispatch(`${this.moduleName}/getExportData`, params)
      events.forEach((event, index) => {
        if (!events[index].data) { return false }
        events[index].data = this.formatData(event.data)
      })
      const typeOfFile = 'application/json',
        link = document.createElement('a'),
        content = JSON.stringify(events, undefined, 2),
        blob = new Blob([content], { type: typeOfFile }),
        data = URL.createObjectURL(blob)
      link.setAttribute('href', data)
      link.setAttribute('download', `${this.ident}[${date.formatDate(this.currentDateRange[0], 'DD.MM.YYYY HH-mm-ss')} - ${date.formatDate(this.currentDateRange[1], 'DD.MM.YYYY HH-mm-ss')}].json`)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.loadingFlag = false
      this.hide()
    }
  },
  watch: {
    dateRange (range) {
      this.currentDateRange = range.map(date => new Date(date))
    },
    format (format) { this.currentFormat = format }
  },
  components: { DateRangePicker },
  mixins: [convertMixin]
}
</script>
