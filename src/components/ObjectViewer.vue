<template>
  <div>
    <q-item class="q-pa-none">
      <q-item-section avatar><q-icon color="white" size="1.8rem" name="mdi-view-list"/></q-item-section>
      <q-item-section>
        <q-item-label class="ellipsis text-bold text-white">Message</q-item-label>
      </q-item-section>
      <q-item-section side><q-icon color="white" class="pull-right cursor-pointer" name="mdi-close" @click.native="$emit('close')" size="1.8rem" /></q-item-section>
    </q-item>
    <q-item  class="q-pa-none">
      <q-item-section class="q-px-sm">
        <q-input type="text" color="white" dark label="Search" v-model="search" class="q-py-none" outlined/>
      </q-item-section>
    </q-item>
    <q-list separator dark>
      <q-item v-if="!Object.keys(object).length || !Object.keys(filteredObject).length">
        <q-item-section>
          <q-item-label header class="ellipsis text-bold text-center text-white">No parameters</q-item-label>
          <q-item-label v-if="!Object.keys(object).length" caption class="ellipsis text-center text-white">Message has not fields</q-item-label>
          <q-item-label v-if="!Object.keys(filteredObject).length && this.search" caption class="ellipsis text-center text-white">Nothing found on your search</q-item-label>
        </q-item-section>
      </q-item>
      <template v-if="Object.keys(filteredObject).length">
        <q-item v-for="(key) in Object.keys(filteredObject)" :key="key">
          <q-item-section>
            <q-item-label header class="ellipsis text-bold text-white q-pa-none">{{key}}<q-tooltip>{{key}}</q-tooltip></q-item-label>
            <q-item-label v-if="key.indexOf('image.bin.') === -1" caption class="ellipsis text-white">{{JSON.stringify(filteredObject[key])}}<q-tooltip>{{JSON.stringify(filteredObject[key])}}</q-tooltip></q-item-label>
            <q-item-label v-else caption><img class="image-bin" :src="`data:image/${key.split('.')[2]};base64, ${filteredObject[key]}`" :alt="key"></q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script>
export default {
  props: ['object'],
  data () {
    return {
      search: ''
    }
  },
  computed: {
    filteredObject () {
      return Object.keys(this.object).reduce((acc, key) => {
        if (key.indexOf(this.search) !== -1) {
          acc[key] = this.object[key]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="stylus">
  .image-bin
    max-width 265px
</style>
