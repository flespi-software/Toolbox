<template>
  <q-modal @show="openHandler" @hide="tabModel = ''" ref="modal" :content-css="{maxWidth: '100vw', maxHeight: '100vh', width: '700px', height: '700px'}" :content-classes="{'bg-dark': inverted !== undefined, 'modal-tabs': true}">
    <q-modal-layout>
      <q-toolbar slot="footer" color="dark"  style="justify-content: flex-end;">
        <q-btn flat @click="$refs.modal.hide()">Close</q-btn>
      </q-toolbar>
      <div v-if="!hasData" class="text-center" style="font-size: 2rem; margin-top: 50px" :class="{'text-white': inverted !== undefined}">No additional data available</div>
      <q-tabs color="dark" no-pane-border v-model="tabModel" v-if="hasData">
        <template v-for="(item, key) in config">
          <template v-if="item.data">
            <q-tab slot="title" :name="key" :label="item.title" :key="`tab-${key}`"/>
            <q-tab-pane :name="key" :key="`tab-pane-${key}`">
              <div style="font-size: 1.1rem" class="text-center q-mb-sm" :class="[item.data._color]" v-if="item.description">{{item.description}}</div>
              <component v-if="item.wrapper && typeof item.wrapper === 'object'" :is="item.wrapper" :data="getData(item.data)" :inverted="inverted"/>
              <component v-else-if="item.wrapper && typeof item.wrapper === 'string'" :is="item.wrapper" :class="{'text-white': inverted !== undefined}">{{getData(item.data)}}</component>
              <div v-else :class="{'text-white': inverted !== undefined}">{{getData(item.data)}}</div>
            </q-tab-pane>
          </template>
        </template>
      </q-tabs>
    </q-modal-layout>
  </q-modal>
</template>

<script>
export default {
  props: [
    'config',
    'inverted'
  ],
  data () {
    return {
      tabModel: ''
    }
  },
  computed: {
    hasData () {
      return Object.keys(this.config).reduce((res, key) => {
        if (this.config[key].data) {
          res = true
        }
        return res
      }, false)
    }
  },
  methods: {
    open () {
      this.$refs.modal.show()
    },
    openHandler () {
      let index = 0,
        hasData = Object.keys(this.config).some((element, elementIndex) => {
          index = elementIndex
          return !!this.config[element].data
        })
      this.tabModel = hasData ? Object.keys(this.config)[index] : Object.keys(this.config)[0] ? Object.keys(this.config)[index] : ''
    },
    getData (obj) {
      return Object.keys(obj).reduce((result, key) => {
        if (key === '_description' || key === '_color') { return result }
        result[key] = obj[key]
        return result
      }, {})
    }
  }
}
</script>

<style lang="stylus">
  .modal-tabs
    .q-tabs
      height 100%
      .q-tabs-panes
        height: 100%;
        overflow: auto;
</style>
