<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}" :class="[this.color]">
    <span class="list__item item_actions" v-if="actionsVisible">
      <i v-for="(action, i) in actions" :key="i" @click="clickHandler(index, action.type, item)" :class="action.classes" class="material-icons cursor-pointer">{{action.icon}}</i>
    </span>
    <span v-for="(prop, k) in cols" :key="k" class="list__item" :class="{[`item_${k}`]: true}">{{getValueOfProp(prop)}}</span>
    <span v-if="etcVisible" class="list__item item_etc">{{etc}}</span>
  </div>
</template>

<script>
  export default {
    props: [
      'item',
      'index',
      'actions',
      'cols',
      'etcVisible',
      'actionsVisible',
      'itemHeight',
      'rowWidth'
    ],
    computed: {
      etc () {
        let etcKeys = Object.keys(this.item).filter(key => !this.hasInCols(key))
        return etcKeys.reduce((acc, key) => {
          acc += `${key}: ${JSON.stringify(this.item[key])}; `
          return acc
        }, '') || '*Empty*'
      },
      color () {
        switch (this.item.event) {
          case 1: // return 'connection established'
          case 13: // return 'command successfully executed'
            return 'text-green'
          case 14: // return 'connected device successfully identified'
            return 'text-yellow'
          case 2: // return 'connection closed by tracking device'
          case 3: // return 'connection successfully processed and closed'
          case 9: // return 'connection closed: channel\'s parameters changed'
          case 10: // return 'connection closed upon user\'s request'
          case 11: // return 'connection closed: terminal mode ended'
            return 'text-grey-6'

          case 4: // return 'connection closed: received data violates channel\'s protocol'
          case 5:
          case 6:
          case 7:
          case 8: // return 'connection closed: internal error'
          case 12: // return 'message registration error'
          case 15: // return 'failed to start channel due to invalid configuration'
            return 'text-red'
          default:
            return ''
        }
      },
      description () {
        let types = {
          1: '1: connection established',
          2: '2: connection closed by tracking device',
          3: '3: connection successfully processed and closed',
          4: '4: connection closed: received data violates channel\'s protocol',
          5: '5: connection closed: internal error',
          6: '6: connection closed: data parsing error',
          7: '7: connection closed: server updated',
          8: '8: connection closed: channel protocol was modified on the server',
          9: '9: connection closed: channel\'s parameters changed',
          10: '10: connection closed upon user\'s request',
          11: '11: connection closed: terminal mode ended',
          12: '12: message registration error',
          13: '13: command successfully executed',
          14: '14: connected device successfully identified',
          15: '15: failed to start channel due to invalid configuration'
        }
        return types[this.item.event]
      }
    },
    methods: {
      hasInCols (prop) {
        return !!this.cols.filter(col => prop === col.name).length
      },
      clickHandler (index, type, content) {
        this.$emit(`action`, {index, type, content})
      },
      getValueOfProp (prop) {
        return prop.custom ? JSON.stringify(this.item[prop.name]) : prop.name === 'event' ? this.description : this.item[prop.name]
      }
    }
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
