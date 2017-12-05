<template>
  <q-layout ref="layout" v-model="sides" view="hHh LpR lFf" :page-style="{background: '#333'}" :right-class="{'bg-dark':true}">
    <q-toolbar slot="header" color="dark" class="header__main-toolbar" v-if="isVisibleToolbar">
      <q-toolbar-title>
        <img :src="$q.platform.is.mobile ? 'statics/toolbox_mobile.png':'statics/toolbox50.png'" alt="Track it!" style="height: 30px"> <sup>{{version}}</sup>
      </q-toolbar-title>
      <q-tabs color="dark" v-model="tabModel">
        <q-route-tab
          v-for="(moduleConfig, moduleName, index) in config"
          :key="index"
          slot="title"
          :name="`${moduleName}`"
          :label="$q.platform.is.desktop ? moduleConfig.label : ''"
          hide="label"
          :icon="$q.platform.is.mobile ? moduleConfig.icon : ''"
          :to="`/${moduleName}`"
        />
      </q-tabs>
      <q-btn @click="settingsHandler" small flat round icon="mdi-settings"/>
      <q-btn @click="exitHandler" small  flat round icon="mdi-exit-to-app"/>
    </q-toolbar>
    <object-viewer
      slot="right"
      @close="hideRightHandler"
      :object="currentMessage"
      v-if="Object.keys(currentMessage).length"
    />
    <raw-viewer
      ref="rawViewer"
      :config="rawConfig"
      inverted
    />
    <router-view
      ref='main'
      v-if="configByEntity"
      @view-data="viewDataHandler"
      @view-data-hide="$refs.layout.hideRight(), currentMessage = {}"
      @view-log-message="viewLogMessagesHandler"
      :limit="limit"
      :delay="delay"
      :isCustomer="isCustomer"
      :config="configByEntity"
    >
    </router-view>
  </q-layout>
</template>

<script>
  import { QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QTabs, QRouteTab, LocalStorage, Dialog, Toast, Alert, date } from 'quasar-framework'
  import config from '../config.json'
  import 'quasar-extras/animate/bounceInRight.css'
  import 'quasar-extras/animate/bounceOutRight.css'
  import { mapState, mapMutations } from 'vuex'
  import dist from '../../package.json'
  import ObjectViewer from './ObjectViewer.vue'
  import RawViewer from './RawViewer.vue'
  import JsonTree from './JsonTree.vue'

  export default {
    data () {
      return {
        version: dist.version,
        currentMessage: {},
        currentData: {},
        sides: {
          left: false,
          right: false
        },
        currentLimit: 1000,
        delay: 2,
        rawConfig: {},
        config: config,
        tabModel: 'channels',
        isVisibleToolbar: true
      }
    },
    computed: {
      ...mapState({
        token: (state) => state.token,
        isCustomer: (state) => state.isCustomer
      }),
      configByEntity () {
        return this.config[this.tabModel]
      },
      limit: {
        get () {
          return this.currentLimit
        },
        set (val) {
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
            this.currentLimit = val
          }
        }
      },
      logMessageConfig () {
        return {
          'item_data': {
            title: 'item data',
            wrapper: JsonTree,
            data: this.currentData.item_data
          },
          'http_data': {
            title: 'http data',
            wrapper: JsonTree,
            data: this.currentData.http_data
          },
          'current': {
            title: `${this.currentData.name} [upd:${date.formatDate(this.currentData.updated * 1000, 'HH:mm:ss')}]`,
            wrapper: JsonTree,
            data: this.currentData.current
          }
        }
      }
    },
    methods: {
      ...mapMutations([
        'setToken',
        'clearToken'
      ]),
      exitHandler (e) {
        this.clearToken()
        this.$router.push('/login')
      },
      viewDataHandler (content) {
        this.currentMessage = JSON.parse(JSON.stringify(content))
        this.$refs.layout.showRight()
      },
      hideRight () {
        this.$refs.layout.hideRight()
        this.currentMessage = {}
      },
      hideRightHandler () {
        this.hideRight()
        this.$refs.main.unselect()
      },
      settingsHandler () {
        Dialog.create({
          title: 'Settings',
          form: {
            delay: {
              type: 'number',
              label: 'Delay',
              model: this.delay,
              min: 2
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
                this.delay = data.delay
              }
            }
          ]
        })
      },
      viewLogMessagesHandler (content) {
        this.currentData = JSON.parse(JSON.stringify(content))
        this.rawConfig = this.logMessageConfig
        this.$refs.rawViewer.open()
      }
    },
    watch: {
      token (val) {
        if (!val) {
          this.$router.push('/login')
        }
      },
      $route (route) {
        if (route.path === '/') {
          this.$router.push('/channels')
        }
        this.hideRight()
      }
    },
    created () {
      let localStorageToken = LocalStorage.get.item('X-Flespi-Token')
      if (this.$route.params.token && this.$route.params.id && this.$route.params.type) {
        if (this.$route.params.fullscreen) {
          this.isVisibleToolbar = false
        }
        this.setToken(this.$route.params.token)
        this.$router.push(`/${this.$route.params.type}/${this.$route.params.id}`)
      }
      else if (!this.token && !localStorageToken) { // if not logged in
        this.$router.push('/login')
      }
      else {
        if (localStorageToken) { // if token saved in local-storage
          this.setToken(localStorageToken)
        }
        if (this.$route.path === '/') { // if main route
          this.$router.push('/channels')
        }
        else { // go to send route
          this.$router.push(this.$route.path)
        }
      }
    },
    components: { QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QTabs, QRouteTab, ObjectViewer, RawViewer }
  }
</script>

<style>
  .header__main-toolbar {
    padding: 1px 12px;
  }
</style>
