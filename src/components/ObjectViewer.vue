<template>
  <div>
    <q-item>
      <q-item-side left><q-icon color="white" size="1.8rem" name="mdi-view-list"/></q-item-side>
      <q-item-main>
        <q-item-tile label class="ellipsis text-bold text-white">Message</q-item-tile>
      </q-item-main>
      <q-item-side right><q-icon color="white" class="pull-right cursor-pointer" name="mdi-close" @click="$emit('close')" size="1.8rem" /></q-item-side>
    </q-item>
    <q-item>
      <q-item-main>
        <q-input type="text" inverted color="none" float-label="Search" v-model="search" class="no-top-bottom-margin"/>
      </q-item-main>
    </q-item>
    <q-list separator no-border>
      <q-item v-if="!Object.keys(object).length || !Object.keys(filteredObject).length">
        <q-item-main>
          <q-item-tile label class="ellipsis text-bold text-center text-white">Message is empty</q-item-tile>
          <q-item-tile v-if="!Object.keys(object).length" sublabel class="ellipsis text-center text-white">Message has not fields</q-item-tile>
          <q-item-tile v-if="!Object.keys(filteredObject).length && this.search" sublabel class="ellipsis text-center text-white">Nothing found on your search</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item v-if="Object.keys(filteredObject).length" v-for="(key, index) in Object.keys(filteredObject)" :key="key">
        <q-item-main>
          <q-item-tile label class="ellipsis text-bold text-white">{{key}}<q-tooltip>{{key}}</q-tooltip></q-item-tile>
          <q-item-tile sublabel class="ellipsis text-white">{{filteredObject[key]}}<q-tooltip>{{filteredObject[key]}}</q-tooltip></q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>

<script>
  import { QList, QListHeader, QItem, QItemMain, QItemSide, QItemTile, QTooltip, QIcon, QInput } from 'quasar-framework'

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
    },
    components: { QList, QListHeader, QItem, QItemMain, QItemSide, QItemTile, QTooltip, QIcon, QInput }
  }
</script>

<style>
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
</style>
