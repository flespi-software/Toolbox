<template>
  <div ref="wrapper">
    <q-resize-observer @resize="wrapperResizeHandler"/>
    <div>
      <q-toolbar class="bg-grey-9">
        <q-input v-model="filter" outlined hide-bottom-space rounded dense color="white" dark placeholder="ident" :debounce="500">
          <q-icon slot="prepend" name="mdi-magnify" color="white" />
        </q-input>
      </q-toolbar>
      <div v-if="loadingFlag && itemsCount > 0" class="absolute-bottom-right absolute-top-left" style="overflow: hidden; top: 50px;">
        <device-skeleton v-for="(_, index) in new Array(itemsCount).fill('')" :key="index"/>
      </div>
      <template v-else-if="!loadingFlag && devicesByIndex.length">
        <VirtualList
          ref="scroller"
          :style="{position: 'absolute', top: '50px', bottom: 0, right: 0, left: 0, height: 'auto'}"
          :class="{'bg-grey-9': true, 'text-white': true, 'cursor-pointer': true}"
          :size="itemHeight"
          :remain="itemsCount"
          wclass="q-w-list"
        >
          <device-list-item
            v-for="(item, index) in devices"
            :key="item.ident"
            :item="item"
            :index="index"
            :itemHeight="itemHeight"
            @item-click="deviceClickHandler"
            @mouseenter.native="previewDeviceHandler(item)"
            @mouseleave.native="previewDeviceCloseHandler(item)"
          />
        </VirtualList>
      </template>
      <empty-pane v-else :config="config.emptyState"/>
    </div>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import DeviceListItem from './DeviceListItem.vue'
import EmptyPane from '../EmptyPane'
import DeviceSkeleton from './DeviceSkeleton'

export default {
  props: [
    'activeId',
    'device',
    'config',
    'view'
  ],
  data () {
    return {
      theme: this.config.theme,
      viewConfig: this.config.viewConfig,
      actions: this.config.actions,
      moduleName: this.config.vuexModuleName,
      itemHeight: 48,
      itemsCount: 0,
      wrapperHeight: 0
    }
  },
  computed: {
    selectedChannel () {
      const channel = this.$store.state.channels[this.activeId]
      const features = this.$store.state.channelsProtocols[channel.protocol_id].features
      channel.features = features
      return channel
    },
    devices: {
      get () {
        return this.$store.state[this.moduleName].devices
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setDevices`, val)
      }
    },
    devicesByIndex () {
      return Object.values(this.$store.state[this.moduleName].devices)
    },
    filter: {
      get () { return this.$store.state[this.moduleName].deviceFilter },
      set (filter) {
        this.$store.commit(`${this.moduleName}/setDeviceFilter`, filter)
        this.$store.dispatch(`${this.moduleName}/getDevices`)
        this.$nextTick(() => {
          if (this.$refs.scroller) {
            this.$refs.scroller.forceRender()
          }
        })
      }
    },
    active: {
      get () {
        return this.$store.state[this.moduleName].active
      },
      async set (id) {
        if (this.realtimeEnabled) {
          await this.$store.dispatch(`${this.moduleName}/removePollingGetDevices`)
        }
        this.$store.commit(`${this.moduleName}/setActive`, id)
        this.$store.commit(`${this.moduleName}/clearDevices`)
        await this.$store.dispatch(`${this.moduleName}/getDevices`)
        if (!this.selectedChannel.features.shared_connection) {
          await this.$store.dispatch(`${this.moduleName}/pollingGetDevices`)
        }
      }
    },
    realtimeEnabled () {
      return this.$store.state[this.moduleName].realtimeEnabled
    },
    loadingFlag () {
      const state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    }
  },
  methods: {
    resetParams () {
      if (!this.$refs.wrapper) {
        return false
      }
      this.wrapperHeight = this.$refs.wrapper.offsetHeight - this.itemHeight // - header - scroll-bottom
      this.itemsCount = Math.ceil(this.wrapperHeight / this.itemHeight)
      this.$refs.scroller && this.$refs.scroller.forceRender()
    },
    wrapperResizeHandler () {
      this.resetParams()
    },
    deviceClickHandler ({ index, content, event }) {
      this.$store.commit(`${this.moduleName}/setIdent`, content.ident)
      this.$emit('change:device', content)
    },
    previewDeviceHandler (device) {
      this.$emit('device:preview', device)
    },
    previewDeviceCloseHandler (device) {
      this.$emit('device:preview-hide', device)
    },
    clearDevices () {
      this.devices = {}
    }
  },
  watch: {
    activeId (val) {
      this.active = val
    }
  },
  created () {
    if (this.activeId) {
      this.active = this.activeId
    }
  },
  mounted () {
    this.resetParams()
  },
  components: { VirtualList, DeviceListItem, EmptyPane, DeviceSkeleton }
}
</script>
