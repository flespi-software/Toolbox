<template>
  <div style="height: 100%">
    <q-item  class="q-pa-none" style="position: sticky; top: 0px; z-index: 1;">
      <q-item-section class="q-px-sm">
        <q-input type="text" color="white" dark label="Search" v-model="search" class="q-py-none bg-grey-8" outlined dense/>
      </q-item-section>
    </q-item>
    <q-list separator dark>
      <q-item v-if="!Object.keys(data).length || !Object.keys(filteredObject).length">
        <q-item-section>
          <q-item-label header class="ellipsis text-bold text-center text-white">No parameters</q-item-label>
          <q-item-label v-if="!Object.keys(data).length" caption class="ellipsis text-center text-white">Message has not fields</q-item-label>
          <q-item-label v-if="!Object.keys(filteredObject).length && this.search" caption class="ellipsis text-center text-white">Nothing found on your search</q-item-label>
        </q-item-section>
      </q-item>
      <template v-if="Object.keys(filteredObject).length">
        <q-item
          v-for="(key) in Object.keys(filteredObject)" :key="key"
        >
          <q-item-section>
            <q-item-label header class="ellipsis text-bold q-pa-none text-white">
              <span>{{key}}</span>
              <span v-if='meta[key] && meta[key].unit' class="object-viewier__units">, {{meta[key].unit}}</span>
              <q-tooltip>
                <span>{{key}}</span>
                <span v-if='meta[key] && meta[key].unit'>, {{meta[key].unit}}</span>
              </q-tooltip>
            </q-item-label>
            <q-item-label v-if="filteredObject[key] && filteredObject[key].toString().match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/)" caption><img class="image-bin" :src="filteredObject[key]" :alt="key"></q-item-label>
            <q-item-label v-else-if="key.indexOf('image.bin.') === -1" caption class="ellipsis text-white">{{JSON.stringify(filteredObject[key])}}<q-tooltip>{{JSON.stringify(filteredObject[key])}}</q-tooltip></q-item-label>
            <q-item-label v-else-if="key.indexOf('image.bin.') === 0" caption><img class="image-bin" :src="`data:image/${key.split('.')[2]};base64, ${filteredObject[key].replace(/^data\:image\/\w*\;base64\,\s/, '')}`" :alt="key"></q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn v-if="meta[key]" flat dense icon="mdi-table-column-remove" @click="action('col-remove', key)" color='red-3'></q-btn>
            <q-btn v-else flat dense icon="mdi-table-column-plus-after" @click="action('col-add', key)" color="green-3"></q-btn>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script>
export default {
  props: ['data', 'meta'],
  data () {
    return {
      search: ''
    }
  },
  computed: {
    filteredObject () {
      return Object.keys(this.data).reduce((acc, key) => {
        if (key.indexOf(this.search) !== -1) {
          acc[key] = this.data[key]
        }
        return acc
      }, {})
    }
  },
  methods: {
    action (type, data) {
      this.$emit('action', {
        type,
        data
      })
    }
  }
}
</script>

<style lang="stylus">
  .object-viewier__units
    color $grey-4
    font-size .8rem
  .image-bin
    max-width 265px
</style>
