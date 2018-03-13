<template>
  <div>
    <div v-if="!isInit" class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem">
      <div class="text-grey-3" style="margin-top: 50px">
        <div v-if="isLoading">Fetching data..</div>
      </div>
    </div>
    <template v-else>
      <q-toolbar slot="header" color="dark" class="justify-between">
        <div></div>
        <q-btn flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'"  :rounded="$q.platform.is.mobile">
          <q-tooltip>Mode (Real-time/History)</q-tooltip>
          {{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}
          <q-chip small square pointing="left" color="red" v-if="newMessagesCount" class="cursor-pointer">{{newMessagesCount}}</q-chip>
        </q-btn>
        <div>
          <q-icon size="1.5rem" class="cursor-pointer pull-right" v-if="modeModel && !isEmptyMessages" color="white" name="mdi-playlist-remove" @click="clearHandler">
            <q-tooltip>Clear all panes</q-tooltip>
          </q-icon>
        </div>
      </q-toolbar>
      <logs
        ref="logs"
        v-if="isCustomer"
        :mode="mode"
        :item="true"
        originPattern="mqtt/*"
        :isEnabled="true"
        :config="config.logs"
        :style="{minHeight: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
        @view-log-message="viewLogMessagesHandler"
      />
      <div class="text-center" style="font-size: 1.5rem; margin-top: 30px; color: white" v-if="!isCustomer">Nothing to show by MQTT <div style="font-size: 0.9rem">or you haven`t access</div></div>
    </template>
  </div>
</template>

<script>
  import { QToolbar, QSelect, QInput, QIcon, QBtn, QPopover, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip, QChip, Dialog } from 'quasar-framework'
  import logs from '../logs/Index.vue'
  import { mapState } from 'vuex'

  export default {
    props: [
      'limit',
      'isCustomer',
      'isLoading',
      'isVisibleToolbar',
      'config'
    ],
    data () {
      return {
        mode: 1,
        isInit: false
      }
    },
    computed: {
      ...mapState({
        newMessagesCount (state) {
          return state[this.config.logs.vuexModuleName] ? state[this.config.logs.vuexModuleName].newMessagesCount : 0
        },
        isEmptyMessages (state) {
          return state[this.config.logs.vuexModuleName] ? !state[this.config.logs.vuexModuleName].messages.length : false
        }
      }),
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
      },
      clearHandler () {
        Dialog.create({
          title: 'Confirm',
          message: 'Do you really want to clear all data from the panes?',
          buttons: [
            'No',
            {
              label: 'Yes',
              handler: () => {
                this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`)
              }
            }
          ]
        })
      }
    },
    created () {
      this.$store.dispatch('getCustomer')
        .then(() => { this.isInit = true })
    },
    destroyed () {
      this.$store.commit('clearItems')
    },
    components: { logs, QToolbar, QSelect, QInput, QIcon, QBtn, QPopover, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip, QChip }
  }
</script>
<style>
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
</style>
