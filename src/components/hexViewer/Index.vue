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
      @change:connection="changeConnectionHandler"
      @close="closeHandler"
      @connection:preview="connection => connectionPreview = connection"
      @connection:preview-hide="connection => connectionPreview = null"
      @connection:add="msg => activeConnection.messages.push(msg)"
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
        <q-btn color="white" flat dense icon="mdi-export-variant">
          <q-tooltip>Export packets</q-tooltip>
          <q-menu no-route-dismiss>
            <q-list style="min-width: 150px" class="bg-grey-8 text-white">
              <div class="q-pa-sm">
                <div style="font-size: .8rem">Copy selected packets as</div>
                <div>
                  <q-btn v-close-popup :disable="!selectedMessages.length" dense flat label="shown" @click="copySelected()" />
                  <q-btn v-close-popup :disable="!selectedMessages.length" dense flat label="hex" @click="copySelected('hex')" />
                  <q-btn v-close-popup :disable="!selectedMessages.length" dense flat label="raw" @click="copySelected('text')" />
                </div>
              </div>
              <q-separator />
              <div class="q-pa-sm">
                <div style="font-size: .8rem">Export selected packets as</div>
                <div>
                  <q-btn v-close-popup :disable="!selectedMessages.length" dense flat label="shown" @click="exportSelected()" />
                  <q-btn v-close-popup :disable="!selectedMessages.length" dense flat label="hex" @click="exportSelected('hex')" />
                  <q-btn v-close-popup :disable="!selectedMessages.length" dense flat label="raw" @click="exportSelected('text')" />
                </div>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <hex-viewer
        v-if="activeConnection && !loadingFlag && hex"
        :style="{height: `calc(100vh - ${(isVisibleToolbar ? activeConnection ? 150 : 100 : 100) + (converter ? 17 : 0)}px)`, marginTop: `${converter ? 17 : 0}px)`, position: 'relative', overflow: 'auto'}"
        :hex="hex"
        :view="typeOfHexView"
        @selectedBytes="convertSelectedBytes"
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
      <div v-if="converter" class=" text-white text-bold q-px-xs row" style="font-family: 'PT Mono', monospace;background: rgba(0,0,0,.8);">
        <template v-if="selectedbytes.length <= 256">
          <small class="col-2 ellipsis q-pr-md">
            <span class="text-yellow">HEX({{selectedbytes.length / 2}}):</span> {{selectedbytes}}
          </small>
          <small class="col ellipsis q-pr-md">
            <span class="text-yellow">Dec:</span> {{parseInt(selectedbytes, 16)}}
          </small>
          <small class="col ellipsis q-pr-md">
            <span class="text-yellow">BIN:</span> {{hex2bin(selectedbytes)}}
          </small>
        </template>
        <template v-else>
          <small>Too big to convert</small>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Messages from '../../components/hexViewer/Messages'
import MessagePreviewItem from '../../components/hexViewer/MessagePreviewItem'
import HexViewer from '../HexViewer'
import { mapState } from 'vuex'
import { date } from 'quasar'
import hexProcessing from '../../mixins/hexProcessing'
export default {
  props: ['active', 'activeDevice', 'isVisibleToolbar', 'config'],
  data () {
    return {
      selectedbytes: '',
      converter: false,
      connectionPreview: null,
      typeOfHexView: 'hex',
      selectedMessages: '',
      activeConnection: this.activeDevice || null
    }
  },
  computed: {
    ...mapState({
      isEmptyMessages (state) {
        return this.config.messages && state[this.config.messages.vuexModuleName] && !state[this.config.messages.vuexModuleName].messages.length
      }
    }),
    loadingFlag () {
      const state = this.$store.state[this.config.messages.vuexModuleName]
      return !!(state && state.isLoading)
    },
    hex () {
      if (this.selectedMessages && this.activeConnection) {
        let result = this.selectedMessages.reduce((hex, message) => {
          hex += message['proxy.payload.hex'] || ''
          return hex
        }, '')
        if (result.length > 100000) {
          result = result.substring(0, 10000)
          this.$q.notify({
            type: 'warning',
            message: 'Render limited to 10 000 characters',
            timeout: 5000
          })
        }
        return result
      }
      return ''
    }
  },
  methods: {
    getHeader (packet) {
      const eventsDesc = {
        0: 'Data received',
        1: 'Connect',
        2: 'Disconnect'
      }
      const info = packet['proxy.source'] === 0 ? 'incoming' : `target ${packet['proxy.source']}`
      let header = ''
      header += eventsDesc[packet['proxy.event']]
      header += `[${info}]`
      header += '('
      header += date.formatDate(packet.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')
      if (packet['proxy.payload.hex']) {
        header += ` size: ${packet['proxy.payload.size']}B`
      }
      header += ')'
      return header
    },
    getContentBySelected (type) {
      return this.selectedMessages.reduce((content, packet) => {
        content += this.getHeader(packet)
        if (packet['proxy.payload.hex']) {
          content += this.getContent(type, packet['proxy.payload.hex'], this.typeOfHexView)
        }
        content += '\r\n'
        return content
      }, '')
    },
    copySelected (type = 'view') {
      const content = this.getContentBySelected(type)
      this.copy(content, type)
    },
    exportSelected (type = 'view') {
      const content = this.getContentBySelected(type)
      this.exportData(content, type)
    },
    changeConnectionHandler (content) {
      this.activeConnection = content
      this.$emit('change-active-device', {ident: content.ident})
    },
    closeHandler () {
      this.activeConnection = null
      this.selectedMessages = ''
      this.$emit('change-active-device', null)
    },
    convertSelectedBytes (bytes) {
      if (bytes) {
        this.selectedbytes = bytes
        this.converter = true
      } else {
        this.converter = false
      }
    },
    hex2bin(hex){
      return (parseInt(hex, 16).toString(2)).padStart(8, '0');
    }
  },
  watch: {
    active () {
      this.activeConnection = null
      this.selectedMessages = ''
      this.connectionPreview = null
    }
  },
  mixins: [hexProcessing],
  components: { Messages, MessagePreviewItem, HexViewer }
}
</script>
