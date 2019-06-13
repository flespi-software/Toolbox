<template>
  <div>
    <q-item>
      <q-item-side left><q-icon color="white" size="1.8rem" name="mdi-view-list"/></q-item-side>
      <q-item-main>
        <q-item-tile label class="ellipsis text-bold text-white">Object</q-item-tile>
      </q-item-main>
      <q-item-side right><q-icon color="white" class="pull-right cursor-pointer" name="mdi-close" @click.native="$emit('close')" size="1.8rem" /></q-item-side>
    </q-item>
    <q-item>
      <q-item-main>
        <q-input type="text" inverted color="none" float-label="Search" v-model="search" class="no-top-bottom-margin"/>
      </q-item-main>
    </q-item>
    <q-list separator no-border>
      <q-item v-if="!Object.keys(object).length || !Object.keys(filteredObject).length">
        <q-item-main>
          <q-item-tile label class="ellipsis text-bold text-center text-white">Object is empty</q-item-tile>
          <q-item-tile v-if="!Object.keys(object).length" sublabel class="ellipsis text-center text-white">Message has not fields</q-item-tile>
          <q-item-tile v-if="!Object.keys(filteredObject).length && this.search" sublabel class="ellipsis text-center text-white">Nothing found on your search</q-item-tile>
        </q-item-main>
      </q-item>
      <template v-if="Object.keys(filteredObject).length">
        <q-item v-for="(key) in Object.keys(filteredObject)" :key="key">
          <q-item-main>
            <q-item-tile label class="ellipsis text-bold text-white">{{key}}<q-tooltip>{{key}}</q-tooltip></q-item-tile>
            <q-item-tile v-if="key.indexOf('image.bin.') === -1" sublabel class="ellipsis text-white">{{JSON.stringify(filteredObject[key])}}<q-tooltip>{{JSON.stringify(filteredObject[key])}}</q-tooltip></q-item-tile>
            <q-item-tile v-else sublabel><img class="image-bin" :src="`data:image/${key.split('.')[2]};base64, ${filteredObject[key]}`" :alt="key"></q-item-tile>
          </q-item-main>
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

<style>
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
  .image-bin {
    max-width: 265px;
  }
</style>
