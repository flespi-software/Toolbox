<template>
  <div>
    <messages
      v-show="$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"
      ref="messages"
      :activeId="active"
      :limit="0"
      :config="config.messages"
      :connection="activeConnection"
      :type="activeConnection ? 'messages' : 'connections'"
      :view="typeOfHexView"
      :style="{height: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', width: $q.platform.is.desktop ? '25%' : '100%', minWidth: '180px'}"
      @view-data="(content) => { selectedMessages = content }"
      @change:connection="content => { activeConnection = content }"
      @close="() => { activeConnection = null, selectedMessages = '' }"
      @connection:preview="connection => connectionPreview = connection"
      @connection:preview-hide="connection => connectionPreview = null"
    />
    <div v-show="$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)" :style="{width: $q.platform.is.desktop ? '75%' : '100%'}">
      <q-toolbar class="bg-grey-9" v-if="activeConnection">
        <q-icon size="1.5rem" class="cursor-pointer" name="mdi-close" v-if="$q.platform.is.mobile" @click.native="() => { selectedMessages = '' }"/>
        <q-toolbar-title>
          <div class="text-white">{{activeConnection.peer}}</div>
          <div class="text-white" style="font-size: .7rem;">{{activeConnection.ident}}</div>
        </q-toolbar-title>
        <q-btn color="white" flat dense :icon="typeOfHexView === 'hex' ? 'mdi-matrix' : 'mdi-format-text'" @click="typeOfHexView = typeOfHexView === 'hex' ? 'text' : 'hex'">
          <q-tooltip>Change view mode (hex/text)</q-tooltip>
        </q-btn>
      </q-toolbar>
      <hex-viewer
        v-if="activeConnection"
        :style="{height: `calc(100vh - ${isVisibleToolbar ? activeConnection ? '150px' : '100px' : '100px'})`, position: 'relative', overflow: 'auto'}"
        :hex="hex"
        :view="typeOfHexView"
      />
      <div v-else-if="$q.platform.is.desktop && connectionPreview" class="q-pa-md" style="overflow: hidden; max-height: calc(100vh - 100px);">
        <q-timeline layout="loose" color="white" dark>
          <message-preview-item v-for="(message, index) in connectionPreview.messages.slice(0, 20)" :key="index" :message="message" :view="typeOfHexView"/>
        </q-timeline>
      </div>
      <div style="text-align: center; color: #9e9e9e; font-size: 3rem; padding-top: 40px;" v-else>
        <div>Select connection</div>
        <q-icon name="mdi-arrow-down-bold-outline" size="3rem"/>
        <div>Find message</div>
        <q-icon name="mdi-arrow-down-bold-outline" size="3rem"/>
        <div>Analyze data</div>
      </div>
    </div>
  </div>
</template>

<script>
import Messages from '../../components/hexViewer/Messages'
import MessagePreviewItem from '../../components/hexViewer/MessagePreviewItem'
import HexViewer from '../HexViewer'
import { mapState } from 'vuex'
export default {
  props: ['active', 'isVisibleToolbar', 'config'],
  data () {
    return {
      connectionPreview: null,
      typeOfHexView: 'hex',
      selectedMessages: '',
      activeConnection: null
    }
  },
  computed: {
    ...mapState({
      isEmptyMessages (state) {
        return this.config.messages && state[this.config.messages.vuexModuleName] && !state[this.config.messages.vuexModuleName].messages.length
      }
    }),
    hex () {
      if (this.selectedMessages && this.activeConnection) {
        return this.selectedMessages.reduce((hex, message) => {
          hex += message['proxy.payload.hex'] || ''
          return hex
        }, '')
      }
      return false
    }
  },
  methods: {},
  watch: {
    active () {
      this.activeConnection = null
      this.selectedMessages = ''
      this.connectionPreview = null
    }
  },
  components: { Messages, MessagePreviewItem, HexViewer }
}
</script>
