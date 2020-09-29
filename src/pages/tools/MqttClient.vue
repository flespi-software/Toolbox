<template>
  <q-page class="bg-white flex flex-center full-width full-height">
    <iframe ref="iframe" :src="host" frameborder="0" :name="name" class="full-width full-height absolute-top-left absolute-bottom-right"></iframe>
  </q-page>
</template>

<script>
import init from '../../mixins/entitiesInit'

export default {
  name: 'MQTTClient',
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config'
  ],
  data () {
    return {
      name: 'mqttboard',
      host: 'https://mqttboard.flespi.io/#/integration',
      mqttBoardConfig: {
        settings: {
          clientId: `toolbox-mqtt-board-${Math.random().toString(16).substr(2, 8)}`,
          host: this.$flespiSocketServer,
          username: `FlespiToken ${this.$store.state.token}`
        },
        whiteLabel: 'MQTT Clients',
        useLS: false,
        clientsCloseable: false
      }
    }
  },
  mixins: [init],
  methods: {
    send (cmd, payload) {
      cmd = `MQTTBoard${this.name ? `|${this.name}` : ''}|${cmd}${payload ? `=>${JSON.stringify(payload)}` : ''}`
      this.$refs.iframe.contentWindow.postMessage(cmd, '*')
    },
    messageProcess (message) {
      let cmd = '',
        payload = null
      if (typeof message === 'string' && message.indexOf('MQTTBoard|') === 0) {
        let data = message.split('|')
        data = data[this.name ? 2 : 1].split('=>')
        cmd = data[0]
        try {
          payload = JSON.parse(data[1])
        } catch (e) {
          payload = data[1]
        }
      }
      return {
        cmd,
        payload,
        name: this.name
      }
    },
    setSettings (config) {
      this.send('SetSettings', config)
    }
  },
  created () {
    window.addEventListener('message', ({ data }) => {
      const { cmd, name } = this.messageProcess(data)
      if (name === this.name && cmd) {
        if (cmd === 'ready') {
          this.setSettings(this.mqttBoardConfig)
        }
      }
    })
  }
}
</script>
