<template>
  <q-dialog :maximized="$q.platform.is.mobile" ref="modal" :no-esc-dismiss="loadingFlag" :no-backdrop-dismiss="loadingFlag">
    <q-card class="bg-grey-9" :style="{minWidth: $q.platform.is.mobile ? '100%' : '310px', height: $q.platform.is.mobile ? '100%' : 'auto'}">
      <q-card-section :style="{height: 'calc(100% - 54px)'}" class="q-pa-sm">
        <date-range-picker
          :theme="{ color: 'white', bgColor: 'grey-9', contentInverted: true, controlsInverted: true }"
          v-model="currentDateRange"
        />
        <q-select
          :options="selectOpts" v-model="currentFormat" multiple dark
          outlined label="Format" hide-bottom-space dense color="white" bg-color="grey-9"
        />
        <q-toggle v-model="needTimeConvert" dark>
          <span class="text-white">Format timestamps</span>
        </q-toggle>
        <template v-if="needTimeConvert">
          <q-input v-model="timeFormat" outlined dense label="Date format" class="q-mb-sm" dark color="white" />
          <q-select
            :options="timezoneOptions" v-model="timezoneOffset" emit-value map-options dark
            outlined label="Timezone" hide-bottom-space dense color="white" bg-color="grey-9"
          />
        </template>
      </q-card-section>
      <q-separator color="grey-8"/>
      <q-card-actions align="right" class="bg-grey-9 text-white">
        <q-btn flat @click="hide" :disable="loadingFlag">Close</q-btn>
        <q-btn flat @click="importHandler" :disable="loadingFlag || currentFormat.length < 1" :loading="loadingFlag">Export</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { DateRangePicker } from 'datetimerangepicker'
import convertMixin from '../../mixins/convert'
import { date } from 'quasar'
export default {
  props: ['format', 'dateRange', 'config', 'ident', 'itemId'],
  data () {
    return {
      currentFormat: [this.format],
      currentDateRange: this.dateRange.map(date => new Date(date)),
      moduleName: this.config.vuexModuleName,
      loadingFlag: false,
      selectOpts: ['hex', 'text', 'base64'],
      needTimeConvert: false,
      timeFormat: 'YYYY/MM/DD HH:mm:ss.SSS',
      currentTimezoneOffset: -((new Date()).getTimezoneOffset() / 60),
      timezoneOffset: 'local',
      timezoneOptions: [
        { value: 'local', label: 'Local time (computer`s timezone)' },
        { value: -12, label: '(GMT -12:00) Eniwetok, Kwajalein' },
        { value: -11, label: '(GMT -11:00) Midway Island, Samoa' },
        { value: -10, label: '(GMT -10:00) Hawaii' },
        { value: -9, label: '(GMT -9:00) Alaska' },
        { value: -8, label: '(GMT -8:00) Pacific Time (US &amp; Canada)' },
        { value: -7, label: '(GMT -7:00) Mountain Time (US &amp; Canada)' },
        { value: -6, label: '(GMT -6:00) Central Time (US &amp; Canada), Mexico City' },
        { value: -5, label: '(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima' },
        { value: -4, label: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz' },
        { value: -3.5, label: '(GMT -3:30) Newfoundland' },
        { value: -3, label: '(GMT -3:00) Brazil, Buenos Aires, Georgetown' },
        { value: -2, label: '(GMT -2:00) Mid-Atlantic' },
        { value: -1, label: '(GMT -1:00 hour) Azores, Cape Verde Islands' },
        { value: 0, label: '(GMT) Western Europe Time, London, Lisbon, Casablanca' },
        { value: 1, label: '(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris' },
        { value: 2, label: '(GMT +2:00) Kaliningrad, South Africa' },
        { value: 3, label: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg' },
        { value: 3.5, label: '(GMT +3:30) Tehran' },
        { value: 4, label: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi' },
        { value: 4.5, label: '(GMT +4:30) Kabul' },
        { value: 5, label: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent' },
        { value: 5.5, label: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi' },
        { value: 5.75, label: '(GMT +5:45) Kathmandu' },
        { value: 6, label: '(GMT +6:00) Almaty, Dhaka, Colombo' },
        { value: 7, label: '(GMT +7:00) Bangkok, Hanoi, Jakarta' },
        { value: 8, label: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong' },
        { value: 9, label: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk' },
        { value: 9.5, label: '(GMT +9:30) Adelaide, Darwin' },
        { value: 10, label: '(GMT +10:00) Eastern Australia, Guam, Vladivostok' },
        { value: 11, label: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia' },
        { value: 12, label: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka' }
      ]
    }
  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    hide () {
      this.$refs.modal.hide()
    },
    formatData (base64, format) {
      let content = null
      if (format === 'hex') {
        content = this.base64ToHex(base64)
      } else if (format === 'text') {
        content = this.base64ToTextWithMnemoReplacing(base64)
      } else {
        content = base64
      }
      return content
    },
    dateByTimezone (timestamp, offset) {
      const date = new Date(timestamp)
      const localTime = date.getTime()
      const localOffset = date.getTimezoneOffset() * 60000
      const utcTime = localTime + localOffset
      const msOffset = offset * 3600000
      const adjTime = utcTime + msOffset
      return new Date(adjTime)
    },
    async importHandler () {
      this.loadingFlag = true
      const params = { from: Math.floor(this.currentDateRange[0].valueOf() / 1000), to: Math.floor(this.currentDateRange[1].valueOf() / 1000) }
      const events = await this.$store.dispatch(`${this.moduleName}/getExportData`, params)
      events.forEach((event, index) => {
        if (this.needTimeConvert) {
          const dateFormat = this.timeFormat || 'YYYY/MM/DD HH:mm:ss'
          if (this.timezoneOffset === 'local') {
            events[index].timestamp = date.formatDate(events[index].timestamp * 1000, dateFormat)
          } else {
            events[index].timestamp = date.formatDate(this.dateByTimezone(events[index].timestamp * 1000, this.timezoneOffset), dateFormat)
          }
        }
        if (!events[index].data) { return false }
        this.currentFormat.forEach(currentFormat => {
          events[index][currentFormat] = this.formatData(event.data, currentFormat)
        })
        events[index].data = undefined
      })
      const typeOfFile = 'application/json',
        link = document.createElement('a'),
        content = JSON.stringify(events, undefined, 2),
        blob = new Blob([content], { type: typeOfFile }),
        data = URL.createObjectURL(blob),
        fileNameRange = `[${date.formatDate(this.currentDateRange[0], 'DD.MM.YYYY HH-mm-ss')} - ${date.formatDate(this.currentDateRange[1], 'DD.MM.YYYY HH-mm-ss')}]`,
        fileNameTZ = this.timezoneOffset === 'local' ? this.currentTimezoneOffset : this.timezoneOffset,
        fileName = `${this.itemId}_${this.ident}${fileNameRange}_${fileNameTZ >= 0 ? `GMT+${fileNameTZ}` : `GMT${fileNameTZ}`}.json`
      link.setAttribute('href', data)
      link.setAttribute('download', fileName)
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
    format (format) { this.currentFormat = [format] }
  },
  components: { DateRangePicker },
  mixins: [convertMixin]
}
</script>
