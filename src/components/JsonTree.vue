<template>
  <div>
    <span :class="{'text-white': inverted !== undefined}">{{Array.isArray(data) ? '[' : '{'}}</span>
    <div class="margin-left" v-for="(value, key, index) in data" :key="`${key}-${index}`">
      <div v-if="value && typeof value === 'object'">
        <div @click="toggle(Array.isArray(data) ? key : index)" class="cursor-pointer">
          <span :class="[theme.label]">{{key}}</span><span :class="{'text-white': inverted !== undefined}"> : {{Array.isArray(value) ? `Array [${value.length}]` : 'Object'}}</span>
          <q-icon :color="inverted !== undefined ? 'white' : 'grey-9'" v-if="showObj[Array.isArray(data) ? key : index]" name="mdi-menu-down" style="vertical-align: baseline" />
          <q-icon :color="inverted !== undefined ? 'white' : 'grey-9'" v-else name="mdi-menu-right" style="vertical-align: baseline" />
        </div>
        <json-tree class="margin-left" v-if="showObj[Array.isArray(data) ? key : index]" :data='value' :inverted="inverted"/>
      </div>
      <div v-else>
        <span :class="[theme.label]">{{key}}</span><span :class="{'text-white': inverted !== undefined}"> : </span>
        <pre class="json-tree__field-value" :class="{[theme.typeNumberOrBool]: typeof value === 'number' || typeof value === 'boolean', [theme.typeString]: typeof value === 'string', [theme.typeEmpty]: typeof value === 'undefined' || value === null }" :title="key.indexOf('timestamp') >= 0 && typeof value === 'number' ? formatDate(value * 1000, 'DD/MM/YYYY HH:mm:ss'): ''">{{JSON.stringify(value)}}</pre>
      </div>
    </div>
    <span :class="{'text-white': inverted !== undefined}">{{Array.isArray(data) ? ']' : '}'}}</span>
  </div>
</template>

<script>
import Vue from 'vue'
import { date } from 'quasar'
export default {
  name: 'json-tree',
  props: {
    data: [Object, Array],
    inverted: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    const showObj = []
    const len = Object.keys(this.data).length
    for (let i = 0, l = len; i < l; i++) {
      showObj.push(true)
    }
    return {
      showObj: showObj
    }
  },
  computed: {
    theme () {
      return this.inverted !== undefined
        ? {
          label: 'text-pink-4',
          typeString: 'text-red-3',
          typeNumberOrBool: 'text-blue-3',
          typeEmpty: 'text-grey-5'
        }
        : {
          label: 'text-pink-8',
          typeString: 'text-red-6',
          typeNumberOrBool: 'text-blue-6',
          typeEmpty: 'text-grey-6'
        }
    }
  },
  methods: {
    toggle (index) {
      Vue.set(this.showObj, index, !this.showObj[index])
    },
    formatDate: date.formatDate
  }
}
</script>

<style lang='stylus'>
  .margin-left
    margin-left 16px
  .json-tree__field-value
    display inline
    white-space pre-wrap
    word-wrap break-word
</style>
