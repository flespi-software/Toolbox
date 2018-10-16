<template>
  <q-page class="bg-white">
    <mqtt-client :initSettings="settings"/>
  </q-page>
</template>

<script>
import MqttClient from 'mqtt-board'

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
      settings: {
        username: `FlespiToken ${this.$store.state.token}`
      }
    }
  },
  components: {
    MqttClient
  }
}
</script>
