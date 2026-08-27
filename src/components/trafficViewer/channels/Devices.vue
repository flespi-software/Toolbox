<template>
  <div ref="wrapper">
    <q-resize-observer @resize="wrapperResizeHandler"/>
    <div>
      <q-toolbar class="bg-grey-9">
        <q-input v-model="filter" class="full-width" outlined hide-bottom-space rounded dense color="white" dark placeholder="ident" :debounce="500">
          <template #prepend><q-icon  name="mdi-magnify" color="white" /></template>
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
            @mouseenter="previewDeviceHandler(item)"
            @mouseleave="previewDeviceCloseHandler(item)"
          />
        </VirtualList>
      </template>
      <empty-pane v-else :config="config.emptyState"/>
    </div>
  </div>
</template>

<script>
import VirtualList from 'src/qvirtualscroll/components/VirtualList'
import DeviceListItem from './DeviceListItem.vue'
import EmptyPane from '../../EmptyPane.vue'
import DeviceSkeleton from './DeviceSkeleton.vue'
import { useMainStore } from 'src/stores/main'
import { useTrafficViewerStore } from 'src/stores/traffic/trafficViewer'

export default {
  props: [
    'activeId',
    'device',
    'config',
    'view'
  ],
  /* the viewer registered this store as a Vuex module and reached it by name */
  setup (props) {
    const mainStore = useMainStore()
    const trafficStore = useTrafficViewerStore({ name: props.config.vuexModuleName })
    return { mainStore, trafficStore }
  },
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
      const channel = this.mainStore.channels[this.activeId]
      const features = this.mainStore.channelsProtocols[channel.protocol_id].features
      channel.features = features
      return channel
    },
    devices: {
      get () {
        return this.trafficStore.devices
      },
      set (val) {
        this.trafficStore.setDevices(val)
      }
    },
    devicesByIndex () {
      return Object.values(this.trafficStore.devices)
    },
    filter: {
      get () { return this.trafficStore.deviceFilter },
      set (filter) {
        this.trafficStore.setDeviceFilter(filter)
        this.trafficStore.getDevices()
          .then(() => {
            this.$nextTick(() => {
              if (this.$refs.scroller) {
                this.$refs.scroller.forceRender()
              }
            })
          })
      }
    },
    active: {
      get () {
        return this.trafficStore.active
      },
      async set (id) {
        if (this.realtimeEnabled) {
          await this.trafficStore.removePollingGetDevices()
        }
        this.trafficStore.setActive(id)
        this.trafficStore.clearDevices()
        await this.trafficStore.getDevices()
        if (!this.selectedChannel.features.shared_connection) {
          await this.trafficStore.pollingGetDevices()
        }
      }
    },
    realtimeEnabled () {
      return this.trafficStore.realtimeEnabled
    },
    loadingFlag () {
      return !!this.trafficStore.isLoading
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
      this.trafficStore.setIdent(content.ident)
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
    const filter = this.$route.query.filter
    if (filter) { this.trafficStore.setDeviceFilter(filter) }
    if (this.activeId) {
      this.active = this.activeId
    }
  },
  mounted () {
    this.resetParams()
  },
  beforeUnmount() {
    this.trafficStore.removePollingGetDevices()
  },
  components: { VirtualList, DeviceListItem, EmptyPane, DeviceSkeleton }
}
</script>
