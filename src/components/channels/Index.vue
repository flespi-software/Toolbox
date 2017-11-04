<template>
  <div>
    <q-toolbar slot="header" color="dark" v-if="active">
      <q-select
        v-if="itemSelectOptions.length > 1"
        class="no-top-bottom-margin on-left"
        inverted
        color="none"
        v-model="active"
        :options="itemSelectOptions"
      />
      <q-btn flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'">{{modeModel ? 'Real-time' : 'History'}}</q-btn>
      <q-icon size="1.5rem" style="position: absolute;right: 0;" class="on-left cursor-pointer" name="settings" @click="settingsClickHandler"/>
    </q-toolbar>
    <div class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem" v-if="!active">
      <div class="text-grey-3" style="margin-top: 50px">
        Select channel
        <q-select
          v-if="itemSelectOptions.length > 1"
          class="no-top-bottom-margin on-left"
          :style="{maxWidth: $q.platform.is.mobile ? '100%' : '30%', marginTop: '20px', minWidth: '200px'}"
          inverted
          color="none"
          v-model="active"
          :options="itemSelectOptions"
        />
      </div>
    </div>
    <logs ref="logs" :mode="mode" :activeId="active" :isEnabled="!!+size[0]" v-if="+size[0] && active" :style="{minHeight: `calc(${size[0]}vh - ${+size[1] ? '50px' : '100px'})`, position: 'relative'}"/>
    <messages ref="messages" :mode="mode" :activeId="active" :isEnabled="!!+size[1]" v-if="+size[1] && active" :style="{minHeight: `calc(${size[1]}vh - ${+size[0] ? '50px' : '100px'})`, position: 'relative'}"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { QToolbar, QSelect, QInput, Toast, Alert, debounce, Dialog, QIcon, QBtn } from 'quasar-framework'
  import 'quasar-extras/animate/bounceInRight.css'
  import 'quasar-extras/animate/bounceOutRight.css'
  import { channelsLogsModule, channelsMessagesModule } from 'qvirtualscroll'
  import logs from './logs/Index.vue'
  import messages from './messages/Index.vue'

  export default {
    data () {
      return {
        mode: 1,
        active: null,
        ratio: '50/50',
        currentLimit: 1000,
        isInit: false,
        ratioOptions: [
          {label: 'disable messages', value: '100/0'},
          {label: 'disable logs', value: '0/100'},
          {label: '60/40', value: '60/40'},
          {label: '50/50', value: '50/50'},
          {label: '40/60', value: '40/60'}
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
      itemSelectOptions () {
        return this.items.reduce((res, item) => {
          let option = {
            label: item.name,
            value: item.id
          }
          res.push(option)
          return res
        }, [{label: '&lt;Available channels&gt;', value: null}])
      },
      modeModel: {
        get () {
          return !!this.mode
        },
        set (val) {
          let now = Date.now()
          this.date = val ? 0 : now - (now % 86400000)
          this.mode = Number(val)
        }
      },
      limit: {
        get () {
          return this.currentLimit
        },
        set: debounce(function (val) {
          console.log(val)
          if (val < 100) {
            Toast.create.negative({
              html: 'Set limit more than 100, please',
              timeout: 1500
            })
            this.currentLimit = 100
          }
          else if (val > 2000 && this.currentLimit <= 2000) {
            Alert.create({
              enter: 'bounceInRight',
              leave: 'bounceOutRight',
              color: 'amber-9',
              icon: 'warning',
              html: `You try set limit count more than 2000. This can affect the operation of your browser. Continue?`,
              position: 'top-right',
              actions: [
                {
                  label: 'Agree',
                  handler: () => {
                    this.$store.commit('channelsLogs/setLimit', val)
                    this.$store.commit('channelsMessages/setLimit', val)
                    this.currentLimit = val
                  }
                },
                {
                  label: 'Abort',
                  handler: this.settingsClickHandler
                }
              ]
            })
          }
          else {
            this.$store.commit('channelsLogs/setLimit', val)
            this.$store.commit('channelsMessages/setLimit', val)
            this.currentLimit = val
          }
        }, 200)
      }
    },
    methods: {
      settingsClickHandler () {
        Dialog.create({
          title: 'Settings',
          form: {
            ratioHeader: {
              type: 'heading',
              label: 'Ratio'
            },
            ratio: {
              type: 'radio',
              model: this.ratio,
              items: this.ratioOptions
            },
            limit: {
              type: 'number',
              label: 'Limit',
              model: this.limit,
              min: 100
            }
          },
          buttons: [
            'Cancel',
            {
              label: 'Ok',
              handler: (data) => {
                this.limit = data.limit
                this.ratio = data.ratio
              }
            }
          ]
        })
      }
    },
    beforeCreate () {
      this.$store.registerModule('channelsLogs', channelsLogsModule(this.$store, Vue))
      this.$store.registerModule('channelsMessages', channelsMessagesModule(this.$store, Vue))
    },
    created () {
      this.$store.dispatch('getItems', 'channels')
        .then(() => {
          this.isInit = true
          if (this.$route.params && this.$route.params.id) {
            if (this.itemSelectOptions.filter(item => item.value === Number(this.$route.params.id)).length) {
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
          }
          if (+this.size[1] && this.active) {
            this.$refs.messages.resetParams()
          }
        })
      },
      $route (route) {
        if (route.params && route.params.id) {
          if (this.itemSelectOptions.filter(item => item.value === Number(route.params.id)).length) {
            this.active = Number(route.params.id)
          }
          else if (this.isInit) {
            this.active = null
          }
        }
      },
      active (val) {
        val ? this.$router.push(`/channels/${val}`) : this.$router.push('/channels')
      }
    },
    components: { logs, messages, QToolbar, QSelect, QInput, QIcon, QBtn }
  }
</script>
<style>
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
</style>

