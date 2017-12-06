<template>
  <div>
    <template  v-if="!active">
      <div class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem">
        <div class="text-grey-3" style="margin-top: 50px">
          <q-btn flat style="display: flex; flex-wrap: nowrap; margin-top: 20px" icon-right="mdi-menu-down" v-if="items.length">
            Select channel
            <q-popover fit ref="popoverNotActive">
              <q-list link separator class="scroll">
                <q-item
                  v-for="(item, index) in items"
                  :key="index"
                  @click="active = item.id, $refs.popoverNotActive.close()"
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name}}<q-tooltip v-if="$q.platform.is.desktop">{{item.name}}</q-tooltip></q-item-tile>
                    <q-item-tile sublabel><small>{{item.protocol_name}}</small></q-item-tile>
                    <q-item-tile sublabel><small>{{item.uri}}</small></q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-right"><small>#{{item.id.toString()}}</small></q-item-side>
                </q-item>
              </q-list>
            </q-popover>
          </q-btn>
          <div v-if="!items.length">Channels is empty</div>
        </div>
      </div>
    </template>
    <template v-else>
      <q-toolbar color="dark">
        <q-item class="no-padding" style="max-width: 50%">
          <q-item-main>
            <q-tooltip><small>{{selectedItem.protocol_name}}</small></q-tooltip>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{selectedItem.name}}</q-item-tile>
            <q-item-tile sublabel style="font-size: 0.8rem">{{selectedItem.uri}}</q-item-tile>
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
                  <q-item-tile sublabel><small>{{item.protocol_name}}</small></q-item-tile>
                  <q-item-tile sublabel><small>{{item.uri}}</small></q-item-tile>
                </q-item-main>
                <q-item-side class="text-right"><small>#{{item.id.toString()}}</small></q-item-side>
              </q-item>
            </q-list>
          </q-popover>
        </q-item>
        <q-btn flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'">{{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}</q-btn>
        <q-icon v-if="isCustomer" size="1.5rem" style="position: absolute;right: 0;" class="on-left cursor-pointer" name="mdi-format-align-middle" @click="settingsClickHandler"/>
      </q-toolbar>
      <logs
        ref="logs"
        :mode="mode"
        :activeId="active"
        :isEnabled="!!+size[0]"
        originPattern="gw/channels/:id"
        :delay="delay"
        :config="config.logs"
        v-if="isCustomer && +size[0]"
        :style="{minHeight: `calc(${size[0]}vh - ${+size[1] ? '50px' : '100px'})`, position: 'relative'}"
        @view-log-message="viewLogMessagesHandler"
      />
      <messages
        ref="messages"
        @view-data="viewDataHandler"
        :mode="mode"
        :activeId="active"
        :isEnabled="!!+size[1]"
        :delay="delay"
        :limit="limit"
        :config="config.messages"
        v-if="+size[1]"
        :style="{minHeight: `calc(${size[1]}vh - ${+size[0] ? '50px' : '100px'})`, position: 'relative'}"
      />
    </template>
  </div>
</template>

<script>
  import { QToolbar, QSelect, QInput, Dialog, QIcon, QBtn, LocalStorage, QPopover, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip } from 'quasar-framework'
  import logs from '../logs/Index.vue'
  import messages from './messages/Index.vue'

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
        ratio: this.isCustomer ? '50/50' : '0/100',
        isInit: false,
        ratioOptions: [
          {label: 'only logs', value: '100/0'},
          {label: '60/40', value: '60/40'},
          {label: '50/50', value: '50/50'},
          {label: '40/60', value: '40/60'},
          {label: 'only messages', value: '0/100'}
        ]
      }
    },
    computed: {
      size () {
        return this.ratio.split('/')
      },
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
      settingsClickHandler () {
        Dialog.create({
          title: 'Ratio',
          form: {
            ratio: {
              type: 'radio',
              model: this.ratio,
              items: this.ratioOptions
            }
          },
          buttons: [
            'Cancel',
            {
              label: 'Ok',
              handler: (data) => {
                this.ratio = data.ratio
              }
            }
          ]
        })
      },
      viewDataHandler (content) {
        this.$emit('view-data', content)
      },
      viewLogMessagesHandler (content) {
        this.$emit('view-log-message', content)
      },
      unselect () {
        this.$refs.messages.unselect()
      }
    },
    created () {
      this.$store.dispatch('getItems', 'channels')
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
        val ? this.$router.push(`/channels/${val}`) : this.$router.push('/channels')
      },
      isCustomer (val) {
        if (!val) {
          this.ratio = '0/100'
        }
        else {
          this.ratio = '50/50'
        }
      }
    },
    components: { logs, messages, QToolbar, QSelect, QInput, QIcon, QBtn, QPopover, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip }
  }
</script>
<style>
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
</style>

