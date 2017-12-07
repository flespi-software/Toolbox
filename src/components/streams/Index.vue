<template>
  <div>
    <div v-if="!active" class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem">
      <div class="text-grey-3" style="margin-top: 50px">
        <q-btn flat style="display: flex; flex-wrap: nowrap; margin-top: 20px" icon-right="mdi-menu-down" v-if="items.length">
          Select stream
          <q-popover fit ref="popoverNotActive">
            <q-list link separator class="scroll">
              <q-item
                v-if="items.length"
                v-for="(item, index) in items"
                :key="index"
                @click="active = item.id, $refs.popoverNotActive.close()"
              >
                <q-item-main>
                  <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name}}<q-tooltip v-if="$q.platform.is.desktop">{{item.name}}</q-tooltip></q-item-tile>
                  <q-item-tile v-if="item.configuration" sublabel><small>{{item.configuration.protocol}}</small></q-item-tile>
                  <q-item-tile v-if="item.configuration" sublabel><small>{{item.configuration.uri}}</small></q-item-tile>
                </q-item-main>
                <q-item-side class="text-right"><small>#{{item.id.toString()}}</small></q-item-side>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <div v-if="!items.length">Streams not found</div>
      </div>
    </div>
    <template v-else>
      <q-toolbar slot="header" color="dark">
        <q-item class="no-padding" style="max-width: 50%">
          <q-item-main>
            <q-tooltip><small>{{selectedItem.configuration.protocol}}</small></q-tooltip>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{selectedItem.name}}</q-item-tile>
            <q-item-tile sublabel style="font-size: 0.8rem">{{selectedItem.configuration.uri}}</q-item-tile>
          </q-item-main>
          <q-item-side class="text-right"><q-icon color="white" size="2rem" name="mdi-menu-down" /></q-item-side>
          <q-popover fit ref="popoverActive">
            <q-list link separator class="scroll">
              <q-item
                v-for="(item, index) in items"
                :key="index"
                @click="active = item.id, $refs.popoverActive.close(), $emit('view-data-hide')"
              >
                <q-item-main>
                  <q-item-tile label class="ellipsis overflow-hidden">{{item.name}}</q-item-tile>
                  <q-item-tile sublabel><small>{{item.configuration.protocol}}</small></q-item-tile>
                  <q-item-tile sublabel><small>{{item.configuration.uri}}</small></q-item-tile>
                </q-item-main>
                <q-item-side class="text-right"><small>#{{item.id.toString()}}</small></q-item-side>
              </q-item>
            </q-list>
          </q-popover>
        </q-item>
        <q-btn flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'"  :rounded="$q.platform.is.mobile">
          <q-tooltip>Mode (Real-time/History)</q-tooltip>
          {{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}
        </q-btn>
      </q-toolbar>
      <logs
        ref="logs"
        v-if="isCustomer"
        :mode="mode"
        :activeId="active"
        originPattern="registry/streams/:id"
        :isEnabled="true"
        :delay="delay"
        :config="config.logs"
        :style="{minHeight: `calc(100vh - 100px)`, position: 'relative'}"
        @view-log-message="viewLogMessagesHandler"
      />
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
      'config'
    ],
    data () {
      let mode = LocalStorage.get.item('Toolbox-mode')
      return {
        mode: typeof mode === 'number' ? mode : 1,
        active: null,
        isInit: false
      }
    },
    computed: {
      items () {
        return this.$store.state.items
      },
      selectedItem () {
        return this.items.filter(item => item.id === this.active)[0]
      },
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
      this.$store.dispatch('getItems', 'streams')
        .then(() => { this.$store.dispatch('getCustomer') })
        .then(() => {
          this.isInit = true
          if (this.$route.params && this.$route.params.id) {
            if (this.items.filter(item => item.id === Number(this.$route.params.id)).length) {
              this.active = Number(this.$route.params.id)
            }
            else {
              this.active = null
            }
          }
        })
    },
    watch: {
      $route (route) {
        if (route.params && route.params.id) {
          if (this.items.filter(item => item.id === Number(route.params.id)).length) {
            this.active = Number(route.params.id)
          }
          else if (this.isInit) {
            this.active = null
          }
        }
        else if (route.params && !route.params.id) {
          this.active = null
        }
      },
      active (val) {
        val ? this.$router.push(`/streams/${val}`) : this.$router.push('/streams')
      }
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

