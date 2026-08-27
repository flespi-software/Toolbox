<template>
  <div class="cols-additing q-pa-sm">
    <q-input v-model="filter" color="white" dark type="text" label="Column name" hide-bottom-space outlined dense autofocus />
    <q-list dark class="scroll q-mt-sm" style="max-height: calc(100% - 90px)" v-if="filteredCols.length" bordered separator>
      <q-item v-for="col in filteredCols" :key="col" clickable @click="$emit('add', col)" class="col-item" dense>
        <q-item-section>
          <q-item-label class="ellipsis">{{col}}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon name="mdi-table-column-plus-after" color="white"/>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else class="q-pt-md">
      <template v-if="filter">
        <div class="text-bold text-white text-center">Column with this name is absent</div>
        <q-btn color="white" :label="filter" class="full-width ellipsis" icon="mdi-plus" @click="$emit('add', filter)" flat>
          <q-tooltip>Add column {{filter}}</q-tooltip>
        </q-btn>
      </template>
      <div v-else class="text-bold text-white text-center">Enter a column name, please</div>
    </div>
    <q-btn label="Done" @click="$emit('done')" color="white" flat class="full-width absolute-bottom" style="bottom: 8px;" icon="mdi-check"/>
  </div>
</template>

<script>
export default {
  props: ['cols'],
  data () {
    return {
      filter: ''
    }
  },
  computed: {
    filteredCols () {
      let cols = this.cols
      if (this.filter) {
        cols = cols.filter(col => {
          return col.indexOf(this.filter) !== -1
        })
      }
      return cols
    }
  },
  created () {
    /* the Vue 2 build left this listener behind on every menu open */
    this.keyupHandler = (e) => {
      if (e.which === 13 && !this.filteredCols.length) {
        this.$emit('add', this.filter)
      }
    }
    document.addEventListener('keyup', this.keyupHandler)
  },
  beforeUnmount () {
    document.removeEventListener('keyup', this.keyupHandler)
  }
}
</script>
