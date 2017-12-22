<template>
  <div>
    <div v-if="!isInit" class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem">
      <div class="text-grey-3" style="margin-top: 50px">
        <div v-if="isLoading">Fetching data..</div>
      </div>
    </div>
    <template v-else>
      <q-toolbar slot="header" color="dark">
        <q-btn flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'"  :rounded="$q.platform.is.mobile">
          <q-tooltip>Mode (Real-time/History)</q-tooltip>
          {{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}
        </q-btn>
      </q-toolbar>
      <logs
        ref="logs"
        v-if="isCustomer"
        :mode="mode"
        :item="true"
        originPattern="mqtt/sessions/*"
        :isEnabled="true"
        :delay="delay"
        :config="config.logs"
        :style="{minHeight: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
        @view-log-message="viewLogMessagesHandler"
      />
      <div class="text-center" style="font-size: 1.5rem; margin-top: 30px; color: white" v-if="!isCustomer">Nothing to show by MQTT <div style="font-size: 0.9rem">or you haven`t access</div></div>
    </template>
  </div>
</template>

<script>
  import { QToolbar, QSelect, QInput, QIcon, QBtn, LocalStorage, QPopover, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip } from 'quasar-framework'
  import logs from '../logs/Index.vue'

  export default {
    props: [
      'limit',
      'delay',
      'isCustomer',
      'isLoading',
      'isVisibleToolbar',
      'config'
    ],
    data () {
      let mode = LocalStorage.get.item('Toolbox-mode')
      return {
        mode: typeof mode === 'number' ? mode : 1,
        isInit: false
      }
    },
    computed: {
      modeModel: {
        get () {
          return !!this.mode
        },
        set (val) {
          let now = Date.now()
          this.date = val ? 0 : now - (now % 86400000)
          this.mode = Number(val)
          this.$emit('view-data-hide')
        }
      }
    },
    methods: {
      viewDataHandler (content) {
        this.$emit('view-data', content)
      },
      viewLogMessagesHandler (content) {
        this.$emit('view-log-message', content)
      }
    },
    created () {
      this.$store.dispatch('getCustomer')
        .then(() => { this.isInit = true })
    },
    destroyed () {
      this.$store.commit('clearItems')
    },
    components: { logs, QToolbar, QSelect, QInput, QIcon, QBtn, QPopover, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip }
  }
</script>
<style>
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
</style>
