<template>
  <q-page>
    <div v-if="!isInit" class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem">
      <div class="text-grey-3" style="margin-top: 50px">
        <div v-if="isLoading">Fetching data..</div>
      </div>
    </div>
    <template v-else>
      <q-toolbar color="dark" class="justify-between">
        <div></div>
        <q-btn title="Mode (Real-time/History)" flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'"  :rounded="$q.platform.is.mobile">
          {{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}
          <q-chip small square color="red" v-if="newMessagesCount" class="cursor-pointer q-ml-sm">{{newMessagesCount}}</q-chip>
        </q-btn>
        <div class="flex">
          <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp">
            <div title="Clear all panes" class="on-left cursor-pointer pull-right text-center" v-if="modeModel && !isEmptyMessages" @click="clearHandler">
              <q-icon size="1.5rem" color="white" name="mdi-playlist-remove"/>
              <div style="font-size: .9rem;">Clear</div>
            </div>
          </transition>
        </div>
      </q-toolbar>
      <logs
        ref="logs"
        :mode="mode"
        :item="true"
        :limit="limit"
        originPattern="mqtt/*"
        :isEnabled="true"
        :config="config.logs"
        :style="{minHeight: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
        @view-log-message="viewLogMessagesHandler"
      />
    </template>
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import { mapState } from 'vuex'
import init from '../../mixins/entitiesInit'

export default {
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config'
  ],
  mixins: [init],
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
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to clear all data from the panes?',
        ok: true,
        cancel: true
      }).then(() => { this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`) })
        .catch(() => {})
    },
    init () {
      this.isInit = true
    }
  },
  components: { logs }
}
</script>
<style>
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
</style>
