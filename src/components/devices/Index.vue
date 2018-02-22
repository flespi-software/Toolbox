<template>
  <div>
    <div class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem" v-if="!active">
      <div class="text-grey-3" style="margin-top: 50px">
        <q-btn flat style="display: flex; flex-wrap: nowrap; margin-top: 20px" icon-right="mdi-menu-down" v-if="items.length">
          Select device
          <q-popover fit ref="popoverNotActive">
            <q-list link separator class="scroll">
              <q-item
                v-for="(item, index) in items"
                :key="index"
                @click="active = item.id, $refs.popoverNotActive.close()"
                :class="{'text-grey-8': item.deleted}"
              >
                <q-item-main>
                  <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name || `#${item.id}`}}<q-tooltip v-if="$q.platform.is.desktop && item.name">{{item.name}}</q-tooltip></q-item-tile>
                  <q-item-tile sublabel><small>{{item.ident}}</small></q-item-tile>
                </q-item-main>
                <q-item-side class="text-center">
                  <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                  <q-item-tile><small>#{{item.id.toString()}}</small></q-item-tile>
                </q-item-side>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <div v-if="!items.length">{{isLoading ? 'Fetching data..' : 'Devices not found'}}</div>
      </div>
    </div>
    <template v-else>
      <q-toolbar slot="header" color="dark">
        <q-item class="no-padding" style="max-width: 50%">
          <q-item-main>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{selectedItem.name || `#${selectedItem.id}`}}</q-item-tile>
            <q-item-tile sublabel style="font-size: 0.8rem" v-if="selectedItem.ident">{{selectedItem.ident}}</q-item-tile>
          </q-item-main>
          <q-item-side class="text-right"><q-icon color="white" size="2rem" name="mdi-menu-down" /></q-item-side>
          <q-popover fit ref="popoverActive">
            <q-list link separator class="scroll">
              <q-item
                v-for="(item, index) in items"
                :key="index"
                @click="active = item.id, $refs.popoverActive.close(), $emit('view-data-hide')"
                :class="{'text-grey-8': item.deleted}"
              >
                <q-item-main>
                  <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name || `#${item.id}`}}</q-item-tile>
                  <q-item-tile sublabel><small>{{item.ident}}</small></q-item-tile>
                </q-item-main>
                <q-item-side class="text-center">
                  <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                  <q-item-tile><small>#{{item.id.toString()}}</small></q-item-tile>
                </q-item-side>
              </q-item>
            </q-list>
          </q-popover>
        </q-item>
        <q-btn v-if="!selectedItem.deleted" flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'"  :rounded="$q.platform.is.mobile">
          <q-tooltip>Mode (Real-time/History)</q-tooltip>
          {{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}
        </q-btn>
        <q-icon v-if="isCustomer && !selectedItem.deleted" size="1.5rem" style="position: absolute;right: 0;" class="on-left cursor-pointer" name="mdi-format-align-middle">
          <q-tooltip>Section ratio</q-tooltip>
          <q-popover ref="ratioPopover">
            <q-item style="width: 25rem; height: 100px" class="bg-dark">
              <q-item-side class="text-center">
                <q-item-tile color="grey-6">Logs</q-item-tile>
              </q-item-side>
              <q-item-main>
                <q-item-tile label class="ellipsis overflow-hidden" color="white">Ratio</q-item-tile>
                <q-item-tile sublabel>
                  <q-slider
                    v-model="ratio"
                    color="grey-6"
                    :min="0"
                    :max="100"
                    :step="25"
                    label
                    snap
                  />
                </q-item-tile>
              </q-item-main>
              <q-item-side class="text-center" right>
                <q-item-tile color="grey-6">Messages</q-item-tile>
              </q-item-side>
            </q-item>
          </q-popover>
        </q-icon>
        <q-icon v-if="messagesWithPosition.length && $q.platform.is.desktop" size="1.5rem" style="position: absolute;right: 34px;" class="on-left cursor-pointer" name="mdi-map" @click="isVisibleMap = !isVisibleMap">
          <q-tooltip>Map</q-tooltip>
        </q-icon>
      </q-toolbar>
      <div>
        <logs
          ref="logs"
          :mode="mode"
          :item="selectedItem"
          originPattern="gw/devices/:id"
          :isEnabled="!!+size[0]"
          v-if="isCustomer && +size[0]"
          :style="[{minHeight: `calc(${size[0]}vh - ${+size[1] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}, {maxWidth: mapMinimizedOptions.value && mapMinimizedOptions.type && mapMinimizedOptions.type === 'logs' ? '66%' : ''}]"
          @view-log-message="viewLogMessagesHandler"
          :config="config.logs"
        />
        <messages
          ref="messages"
          @view-data="viewDataHandler"
          :mode="mode"
          :activeId="active"
          :isEnabled="!!+size[1]"
          :limit="limit"
          v-if="+size[1]"
          :style="[{minHeight: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}, {maxWidth: mapMinimizedOptions.value && mapMinimizedOptions.type && mapMinimizedOptions.type === 'messages' ? '66%' : ''}]"
          :config="config.messages"
        />
      </div>
      <map-component
        ref="map"
        v-if="active && messagesWithPosition.length && $q.platform.is.desktop && isVisibleMap"
        :messages="messagesWithPosition"
        :device="selectedItem"
        :siblingHeight="siblingHeight"
        @map:close="isVisibleMap = false"
        @map:minimize="mapMinimizeHandler"
      />
      <div class="text-center" style="font-size: 1.5rem; margin-top: 30px; color: white" v-if="!isCustomer && selectedItem.deleted">Nothing to show by device &#171{{selectedItem.name || `#${selectedItem.id}`}}&#187 <div style="font-size: 0.9rem">or you haven`t access</div></div>
    </template>
  </div>
</template>

<script>
  import { QToolbar, QSelect, QInput, QIcon, QBtn, LocalStorage, QPopover, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip, QSlider } from 'quasar-framework'
  import logs from '../logs/Index.vue'
  import messages from './messages/Index.vue'
  import MapComponent from './MapComponent'

  export default {
    props: [
      'limit',
      'isCustomer',
      'isLoading',
      'isVisibleToolbar',
      'config'
    ],
    data () {
      let mode = LocalStorage.get.item('Toolbox-mode')
      return {
        mode: typeof mode === 'number' ? mode : 1,
        active: null,
        ratio: this.isCustomer ? 50 : 0,
        isInit: false,
        isVisibleMap: false,
        mapMinimizedOptions: {},
        siblingHeight: null
      }
    },
    computed: {
      size () {
        return [this.ratio, 100 - this.ratio]
      },
      messagesWithPosition () {
        return this.config && this.config.messages && this.$store.state[this.config.messages.vuexModuleName]
          ? this.$store.state[this.config.messages.vuexModuleName].messages.filter(message => !!message['position.latitude'] && !!message['position.longitude'])
          : []
      },
      items () {
        return this.$store.state.items
      },
      selectedItem () {
        return this.items.filter(item => item.id === this.active)[0] || {}
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
        if (this.isVisibleMap && content['position.latitude'] && content['position.longitude']) {
          this.$refs.map.flyTo([content['position.latitude'], content['position.longitude']])
        }
      },
      viewLogMessagesHandler (content) {
        this.$emit('view-log-message', content)
      },
      unselect () {
        this.$refs.messages.unselect()
      },
      mapMinimizeHandler (options) {
        this.mapMinimizedOptions = options
        if (options.type === 'messages') { this.siblingHeight = this.size[1] }
        else if (options.type === 'logs') { this.siblingHeight = this.size[0] }
        else { this.siblingHeight = null }
      }
    },
    created () {
      let activeFromLocaleStorage = LocalStorage.get.item('devices')
      this.$store.dispatch('getCustomer')
        .then(() => {
          this.$store.dispatch('getItems', 'devices')
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
              else if (activeFromLocaleStorage && this.items.filter(item => item.id === activeFromLocaleStorage).length) {
                this.active = activeFromLocaleStorage
              }
              // deleted item logic
              if (this.selectedItem.deleted) {
                this.mode = 0
                if (this.isCustomer) { this.ratio = 100 }
              }
            })
        })
    },
    destroyed () {
      this.$store.commit('clearItems')
    },
    watch: {
      ratio (val) {
        this.$nextTick(() => {
          if (+this.size[0] && this.active) {
            this.$refs.logs.resetParams()
            this.$emit('view-data-hide')
          }
          if (+this.size[1] && this.active) {
            this.$refs.messages.resetParams()
          }
        })
      },
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
        let currentItem = this.items.filter(item => item.id === val)[0] || {}
        if (val) {
          LocalStorage.set('devices', val)
          this.$router.push(`/devices/${val}`)
        }
        else {
          this.$router.push('/devices')
        }
        if (this.isCustomer) {
          if (currentItem.deleted) {
            this.ratio = 100
            this.mode = 0
          }
          else {
            this.ratio = currentItem.deleted ? 100 : 50
          }
        }
      },
      isCustomer (val) {
        if (!val) {
          this.ratio = 0
        }
        else {
          this.ratio = 50
        }
      }
    },
    components: { logs, messages, MapComponent, QToolbar, QSelect, QInput, QIcon, QBtn, QPopover, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip, QSlider }
  }
</script>
<style>
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
  .cheap-modifier {
    font-size: .7rem;
    font-weight: bolder;
    border-radius: 3px;
    background-color: #90a4ae;
    color: white;
    padding: 0 3px
  }
</style>

