<template>
  <q-list dark class="bg-grey-7 q-py-sm">
    <q-item clickable dense v-ripple v-if="selection" @click="copyHandler" class="q-px-sm" v-close-popup>
      <q-item-section avatar class="q-pr-sm" style="min-width: 20px">
        <q-icon name="mdi-content-copy" />
      </q-item-section>
      <q-item-section>Copy</q-item-section>
    </q-item>
    <q-separator v-if="selection" spaced inset dark />
    <template v-if="row && row.actions">
      <q-item clickable v-ripple @click="$emit('action', action.type)" dense class="q-px-sm" v-for="action in getActions(row.actions)" :key="action.label" v-close-popup>
        <q-item-section avatar class="q-pr-sm" style="min-width: 20px">
          <q-icon :name="action.icon" />
        </q-item-section>
        <q-item-section>{{action.label}}</q-item-section>
      </q-item>
    </template>
    <q-separator v-if="row && row.actions" spaced inset dark />
    <q-item clickable dense v-ripple @click="add" class="q-px-sm" v-close-popup>
      <q-item-section avatar class="q-pr-sm" style="min-width: 20px">
        <q-icon name="mdi-plus-circle-outline" />
      </q-item-section>
      <q-item-section>Add column</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="$emit('remove')" dense class="q-px-sm" v-close-popup>
      <q-item-section avatar class="q-pr-sm" style="min-width: 20px">
        <q-icon name="mdi-table-column-remove" />
      </q-item-section>
      <q-item-section>Remove column</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { copyToClipboard } from 'quasar'
export default {
  props: ['col', 'row'],
  data () {
    const selection = this.getSelection()
    return {
      selection
    }
  },
  methods: {
    copyHandler () {
      copyToClipboard(this.selection)
        .then(() => {})
        .catch(() => {})
    },
    add () {
      this.$emit('add')
    },
    getSelection () {
      let data = this.col && this.row ? this.row.data[this.col.data.name] : null
      if (data && this.col.data.__dest) {
        data = null
      } else if ((data !== undefined && data !== null) && this.row.dataHandler) {
        data = this.row.dataHandler(this.col, this.row, data)
      }
      return data
    },
    getActions (actions) {
      if (typeof actions === 'function') {
        return actions()
      } else {
        return actions
      }
    }
  }
}
</script>
