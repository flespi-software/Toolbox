<template>
  <div class="q-v-date-range-picker" style="min-width: 180px">
    <q-btn :color="theme.color" flat dense @click="prevHandler" icon="keyboard_arrow_left">
      <q-tooltip>Previous time range</q-tooltip>
    </q-btn>
    <q-btn @click="dateRangeToggle" flat :color="theme.color" style="min-width: 124px; font-size: .8rem; line-height: .8rem;" class="q-pa-none">
      <div>
        <div>{{formatDate(date[0])}}</div>
        <div style="font-size: .5rem">|</div>
        <div>{{formatDate(date[1])}}</div>
      </div>
      <q-tooltip>Change time</q-tooltip>
    </q-btn>
    <q-btn :color="theme.color" flat dense @click="nextHandler" icon="keyboard_arrow_right">
      <q-tooltip>Next time range</q-tooltip>
    </q-btn>
    <q-dialog ref="dateRangePickerModal" class="modal-date-range" style="z-index: 90000;" no-route-dismiss>
      <q-card>
        <q-card-section class="scroll q-pa-none" :class="{[`bg-${theme.bgColor}`]: true, 'text-white': !!theme.bgColor}">
          <div class="flex flex-center">
            <date-range-picker
              class="q-ma-sm"
              v-model="dateModel"
              :mode="mode"
              :theme="theme"
              @change:mode="changeModeDateTimeRangeHandler"
              @error="flag => saveDisabled = flag"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right" :class="{[`bg-${theme.bgColor}`]: true, 'text-white': !!theme.bgColor}">
          <q-btn flat :color="theme.color" @click="dateRangeModalClose">close</q-btn>
          <q-btn flat :color="theme.color" @click="dateRangeModalSave" :disable="saveDisabled">apply</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date, debounce } from 'quasar'
import { DateRangePicker } from 'src/datetimerangepicker'
export default {
  name: 'DateRangeModal',
  emits: ['save'],
  props: ['theme', 'date'],
  data () {
    return {
      dateModel: this.date,
      mode: 0,
      saveDisabled: false
    }
  },
  methods: {
    dateRangeToggle () {
      if (new Date(this.dateModel[0]).toTimeString().split(' ')[0] !== '00:00:00' || new Date(this.dateModel[1]).toTimeString().split(' ')[0] !== '23:59:59') {
        this.mode = 3
      }
      this.$refs.dateRangePickerModal.toggle()
    },
    dateRangeModalClose () {
      this.$refs.dateRangePickerModal.hide()
    },
    changeModeDateTimeRangeHandler (mode) {
      this.mode = mode
    },
    dateRangeModalSave () {
      let [from, to] = this.dateModel
      if (this.mode == 3 ) {
        to += 999 // ms
      }
      this.save([from, to])
      this.dateRangeModalClose()
    },
    formatDate (timestamp) {
      return date.formatDate(timestamp, 'DD/MM/YYYY HH:mm:ss')
    },
    prevHandler () {
      const delta = Math.floor(this.dateModel[1]) - Math.floor(this.dateModel[0]),
        newTo = Math.floor(this.dateModel[0]) - 1, // ms
        newFrom = newTo - delta
      this.dateModel = [newFrom, newTo]
      this.debouncedSave([newFrom, newTo])
    },
    nextHandler () {
      const delta = Math.floor(this.dateModel[1]) - Math.floor(this.dateModel[0]),
        newFrom = Math.floor(this.dateModel[1]) + 1, // ms
        newTo = newFrom + delta
      this.dateModel = [newFrom, newTo]
      this.debouncedSave([newFrom, newTo])
    },
    save (date) {
      this.$emit('save', date)
    }
  },
  created () {
    this.debouncedSave = debounce(this.save, 300)
  },
  watch: {
    date (date, prev) {
      if (date[0] !== prev[0] || date[1] !== prev[1]) {
        this.dateModel = date
      }
    }
  },
  components: { DateRangePicker }
}
</script>

<style lang="scss">
  .q-v-date-range-picker {
    /*
     * Quasar 1 padded `.q-btn__wrapper`, which Quasar 2 does not have — the padding sits on the
     * button, and dense buttons also carry a min-width. Left as it was, the three buttons came to
     * 188px inside a 180px box and the "next range" arrow wrapped onto a second line.
     */
    .q-btn {
      padding-left: 0;
      padding-right: 0;
      min-width: 0;
    }
  }
  .modal-date-range {
    .q-dialog__inner--minimized {
      padding: 6px;
    }
  }
</style>
