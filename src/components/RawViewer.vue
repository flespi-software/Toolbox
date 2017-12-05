<template>
  <q-modal @open="openHandler" @close="tabModel = ''" ref="modal" :content-css="{maxWidth: '100vw', maxHeight: '100vh', width: '700px', height: '700px', padding: '50px 0'}" :content-classes="{'bg-dark': inverted !== undefined, 'modal-tabs': true}">
    <q-modal-layout>
      <q-toolbar slot="footer" color="dark"  style="justify-content: flex-end;">
        <q-btn flat @click="$refs.modal.close()">Close</q-btn>
      </q-toolbar>
      <div v-if="!hasData" class="text-center" style="font-size: 2rem; margin-top: 50px" :class="{'text-white': inverted !== undefined}">No additional data available</div>
      <q-tabs color="dark" no-pane-border v-model="tabModel" v-if="hasData">
        <template v-for="(item, key, index) in config" v-if="item.data">
          <q-tab slot="title" :name="key" :label="item.title"/>
          <q-tab-pane :name="key">
            <component v-if="item.wrapper && typeof item.wrapper === 'object'" :is="item.wrapper" :data="item.data" :inverted="inverted"/>
            <component v-if="item.wrapper && typeof item.wrapper === 'string'" :is="item.wrapper" :class="{'text-white': inverted !== undefined}">{{item.data}}</component>
            <div v-if="!item.wrapper" :class="{'text-white': inverted !== undefined}">{{item.data}}</div>
          </q-tab-pane>
        </template>
      </q-tabs>
    </q-modal-layout>
  </q-modal>
</template>

<script>
  import { QModal, QModalLayout, QToolbar, QBtn, QTabs, QTab, QTabPane } from 'quasar-framework'

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
        this.$refs.modal.open()
      },
      openHandler () {
        let index = 0,
          hasData = Object.keys(this.config).some((element, elementIndex) => {
            index = elementIndex
            return !!this.config[element].data
          })
        this.tabModel = hasData ? Object.keys(this.config)[index] : Object.keys(this.config)[0] ? Object.keys(this.config)[index] : ''
      }
    },
    components: { QModal, QModalLayout, QToolbar, QBtn, QTabs, QTab, QTabPane }
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
