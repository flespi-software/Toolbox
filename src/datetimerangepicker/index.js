/*
 * DateTimeRangePicker 3.0.4, ported to Vue 3. The published 5.x is a rewrite that dropped the Week
 * and Month modes and moved its model to seconds, so the version Toolbox actually runs on is kept
 * here instead. flatpickr underneath is plain JavaScript and needed no changes.
 */
import DateRangePicker from './components/DateRangePicker.vue'
import FlatPickr from './components/FlatPickr.vue'

export { DateRangePicker, FlatPickr }
export default DateRangePicker
