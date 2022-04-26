<template>
  <div>
    <messages
      v-show="$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"
      ref="messages"
      :activeId="active"
      :limit="limit"
      :config="config.messages"
      :view="typeOfHexView"
      :style="{height: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', width: $q.platform.is.desktop ? '25%' : '100%', minWidth: '250px'}"
      @view-data="(content) => { selectedMessages = content }"
      @close="() => { selectedMessages = '' }"
    />
    <div v-show="$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)" :style="{width: $q.platform.is.desktop ? '75%' : '100%', maxWidth: $q.platform.is.desktop ? 'calc(100% - 250px)' : ''}">
      <q-toolbar class="bg-grey-9" v-if="active">
        <q-icon color="white" size="1.5rem" class="cursor-pointer" name="mdi-close" v-if="$q.platform.is.mobile" @click.native="() => { selectedMessages = '' }"/>
        <q-toolbar-title/>
        <q-btn color="white" flat dense :label="typeOfHexView === 'hex' ? 'text' : 'hex'" :icon-right="typeOfHexView === 'hex' ? 'mdi-format-text' : 'mdi-matrix'" @click="typeOfHexView = typeOfHexView === 'hex' ? 'text' : 'hex'">
          <q-tooltip>Change view mode to {{typeOfHexView === 'hex' ? 'text' : 'hex'}}</q-tooltip>
        </q-btn>
        <q-btn v-if="active" color="white" flat dense icon="mdi-export-variant">
          <q-tooltip>Export</q-tooltip>
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
              <q-separator />
              <q-item clickable v-close-popup @click="$refs.messages && $refs.messages.exportModalOpen()">
                <q-item-section>Export by time</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <packet-view
        v-if="selectedMessages.length"
        :style="{height: `calc(100vh - ${isVisibleToolbar ? '150px' : '100px'})`, position: 'relative', overflow: 'auto'}"
        :packets="selectedMessages"
        :view="typeOfHexView"
      />
      <div style="text-align: center; color: #9e9e9e; font-size: 3rem; padding-top: 40px;" v-else>
        <div>Find message</div>
        <q-icon name="mdi-arrow-down-bold-outline" size="3rem"/>
        <div>Analyze data</div>
      </div>
    </div>
  </div>
</template>

<script>
import Messages from './Messages'
import PacketView from '../PacketView'
import deviceTrafficVuexModule from '../../../store/modules/deviceTraffic'
import hexProcessing from '../../../mixins/hexProcessing'
export default {
  props: ['active', 'isVisibleToolbar', 'config', 'deviceCloseble'],
  data () {
    return {
      typeOfHexView: 'hex',
      limit: 1000,
      selectedMessages: '',
      moduleName: this.config.messages.vuexModuleName
    }
  },
  computed: {
    hex () {
      if (this.selectedMessages && this.active) {
        return this.selectedMessages.reduce((hex, message) => {
          hex += this.base64ToHex(message.data) || ''
          return hex
        }, '')
      }
      return false
    }
  },
  methods: {
    getContentBySelected (type) {
      return this.selectedMessages.reduce((content, packet) => {
        content += this.getHeader(packet)
        content += '\r\n'
        if (packet.data) {
          content += this.getContent(type, this.base64ToHex(packet.data), this.typeOfHexView)
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
    }
  },
  created () {
    if (!this.$store.state[this.moduleName]) {
      this.$store.registerModule(
        this.moduleName,
        deviceTrafficVuexModule
      )
    }
  },
  destroyed () {
    this.$store.commit(`${this.moduleName}/clean`)
    this.$store.unregisterModule(this.moduleName)
  },
  watch: {
    active () {
      this.selectedMessages = ''
    }
  },
  mixins: [hexProcessing],
  components: { Messages, PacketView }
}
</script>
