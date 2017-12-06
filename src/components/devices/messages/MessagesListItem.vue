<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`, backgroundColor: selected ? 'rgba(255,255,255,0.7)': '', color: selected ? '#333' : ''}">
    <span class="list__item item_actions" v-if="actionsVisible">
      <q-icon v-for="(action, i) in actions" :key="i" @click="clickHandler(index, action.type, item)" :class="action.classes" class="cursor-pointer on-left" :name="action.icon">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </span>
    <span v-for="(prop, k) in cols" :key="prop.name + k" class="list__item" :class="{[`item_${k}`]: true}">
      <q-tooltip>{{values[prop.name].value}}</q-tooltip>
      {{values[prop.name].value}}
    </span>
    <span v-if="etcVisible" class="list__item item_etc">{{values.etc.value || '*Empty*'}}</span>
  </div>
</template>

<script>
  import { QIcon, QTooltip, date } from 'quasar-framework'

  export default {
    props: [
      'item',
      'index',
      'actions',
      'cols',
      'itemHeight',
      'etcVisible',
      'rowWidth',
      'actionsVisible',
      'selected'
    ],
    computed: {
      values () {
        let vals = {}
        if (this.cols.length) {
          vals = this.cols.reduce((res, col, index, arr) => {
            res[col.name] = {value: null}
            if (index === arr.length - 1) {
              res.etc = {value: ''}
            }
            return res
          }, {})
        }
        else {
          vals = {
            etc: {value: ''}
          }
        }
        Object.keys(this.item).forEach((propName) => {
          if (propName.indexOf('#') !== -1) {
            let splitedName = propName.split('#'),
              name = splitedName[0],
              index = splitedName[1]
            if (vals[name]) {
              if (!vals[name].value) {
                vals[name].value = {}
              }
              vals[name].value[index] = this.item[propName]
            }
            else {
              vals.etc.value += `${propName}: ${this.item[propName]}; `
            }
          }
          else if (vals[propName]) {
            let value = this.item[propName]
            if (propName === 'timestamp') {
              value = date.formatDate(value * 1000, 'MM/DD/YYYY HH:mm:ss')
            }
            vals[propName].value = value
          }
          else {
            vals.etc.value += `${propName}: ${this.item[propName]}; `
          }
        })
        Object.keys(vals).forEach((key) => {
          if (typeof vals[key].value === 'object' && vals[key].value) {
            if (vals[key].value instanceof Array) {
              let buff = vals[key].value.reduce((acc, item, index, arr) => {
                acc += item
                if (index !== arr.length - 1) {
                  acc += ', '
                }
                return acc
              }, '')
              vals[key].value = buff
            }
            else if (vals[key].value instanceof Object) {
              let buff = Object.keys(vals[key].value).reduce((acc, name, index, arr) => {
                acc += `${name}: ${vals[key].value[name]}`
                if (index !== arr.length - 1) {
                  acc += ', '
                }
                return acc
              }, '')
              vals[key].value = buff
            }
          }
        })
        return vals
      }
    },
    methods: {
      clickHandler (index, type, content) {
        this.$emit(`action`, {index, type, content})
      }
    },
    components: { QIcon, QTooltip }
  }
</script>

<style lang="stylus">
  .list__item
    display inline-block
    white-space nowrap
    margin 0 10px 0 5px
    text-overflow ellipsis
    overflow hidden
</style>
