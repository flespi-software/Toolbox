<template>
  <div>
    <devices
      v-if="!activeDevice"
      v-show="$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"
      ref="devices"
      :activeId="active"
      :config="config.messages"
      :device="activeDevice"
      :view="typeOfHexView"
      :style="{height: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', width: $q.platform.is.desktop ? '25%' : '100%', minWidth: '250px'}"
      @view-data="(content) => { selectedMessages = content }"
      @change:device="content => { $emit('change-active-device', content) }"
      @close="() => { $emit('change-active-device', null), selectedMessages = '' }"
      @device:preview="previewShow"
      @device:preview-hide="previewHide"
    />
    <messages
      v-else
      v-show="$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"
      ref="messages"
      :activeId="active"
      :limit="limit"
      :config="config.messages"
      :device-closeble="deviceCloseble"
      :device="activeDevice"
      :view="typeOfHexView"
      :style="{height: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', width: $q.platform.is.desktop ? '25%' : '100%', minWidth: '250px'}"
      @view-data="(content) => { selectedMessages = content }"
      @close="() => { $emit('change-active-device', null), selectedMessages = '' }"
    />
    <div v-show="$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)" :style="{width: $q.platform.is.desktop ? '75%' : '100%', maxWidth: $q.platform.is.desktop ? 'calc(100% - 250px)' : ''}">
      <q-toolbar class="bg-grey-9" v-if="activeDevice">
        <q-icon color="white" size="1.5rem" class="cursor-pointer" name="mdi-close" v-if="$q.platform.is.mobile" @click.native="() => { selectedMessages = '' }"/>
        <q-toolbar-title>
          <div class="text-white">{{activeDevice.ident}}</div>
        </q-toolbar-title>
        <q-btn color="white" flat dense :icon="typeOfHexView === 'hex' ? 'mdi-matrix' : 'mdi-format-text'" @click="typeOfHexView = typeOfHexView === 'hex' ? 'text' : 'hex'">
          <q-tooltip>Change view mode (hex/text)</q-tooltip>
        </q-btn>
        <q-btn v-if="activeDevice" color="white" flat dense icon="mdi-export-variant" @click="$refs.messages && $refs.messages.exportModalOpen()">
          <q-tooltip>Export</q-tooltip>
        </q-btn>
      </q-toolbar>
      <packet-view
        v-if="activeDevice"
        :style="{height: `calc(100vh - ${isVisibleToolbar ? activeDevice ? '150px' : '100px' : '100px'})`, position: 'relative', overflow: 'auto'}"
        :packets="selectedMessages"
        :view="typeOfHexView"
      />
      <div v-else-if="$q.platform.is.desktop && devicePreview && devicePreviewMessages.length" class="q-pa-md" style="overflow: hidden; max-height: calc(100vh - 100px);">
        <q-timeline layout="loose" color="white" dark>
          <message-preview-item v-for="(message, index) in devicePreviewMessages" :key="index" :message="message" :view="typeOfHexView"/>
        </q-timeline>
      </div>
      <div style="text-align: center; color: #9e9e9e; font-size: 3rem; padding-top: 40px;" v-else>
        <div>Select ident</div>
        <q-icon name="mdi-arrow-down-bold-outline" size="3rem"/>
        <div>Find message</div>
        <q-icon name="mdi-arrow-down-bold-outline" size="3rem"/>
        <div>Analyze data</div>
      </div>
    </div>
  </div>
</template>

<script>
import Messages from './Messages'
import Devices from './Devices'
import MessagePreviewItem from './MessagePreviewItem'
import PacketView from './PacketView'
import trafficViewerVuexModule from '../../store/modules/trafficViewer'
import convertMixin from '../../mixins/convert'
export default {
  props: ['active', 'activeDevice', 'isVisibleToolbar', 'config', 'deviceCloseble'],
  data () {
    return {
      devicePreview: null,
      typeOfHexView: 'hex',
      limit: 1000,
      selectedMessages: '',
      moduleName: this.config.messages.vuexModuleName,
      devicePreviewMessages: []
    }
  },
  computed: {
    hex () {
      if (this.selectedMessages && this.activeDevice) {
        return this.selectedMessages.reduce((hex, message) => {
          hex += this.base64ToHex(message.data) || ''
          return hex
        }, '')
      }
      return false
    }
  },
  methods: {
    async previewShow (device) {
      this.devicePreview = device
      this.devicePreviewMessages = await this.$store.dispatch(`${this.moduleName}/getDevicePreview`, device)
    },
    previewHide (device) {
      this.devicePreview = null
    }
  },
  created () {
    if (!this.$store.state[this.moduleName]) {
      this.$store.registerModule(
        this.moduleName,
        trafficViewerVuexModule
      )
    }
  },
  destroyed () {
    this.$store.commit(`${this.moduleName}/clean`)
    this.$store.dispatch(`${this.moduleName}/removePollingGetDevices`)
    this.$store.unregisterModule(this.moduleName)
  },
  watch: {
    active () {
      this.selectedMessages = ''
      this.devicePreview = null
    }
  },
  mixins: [convertMixin],
  components: { Devices, Messages, MessagePreviewItem, PacketView }
}
</script>
