<template>
  <div v-if="tabModel">
    <q-layout ref="layout" v-model="sides" view="hHh LpR lFf" :page-style="{background: '#333'}" :right-class="{'bg-dark':true}">
      <q-toolbar slot="header" color="dark" class="header__main-toolbar" v-if="isVisibleToolbar">
        <q-toolbar-title :style="{minWidth: $q.platform.is.mobile ? '100px' : '210px'}">
          <img :src="$q.platform.is.mobile ? 'statics/toolbox_mobile.png':'statics/toolbox50.png'" alt="Track it!" style="height: 30px"> <sup>{{version}}</sup>
        </q-toolbar-title>
        <q-tabs color="dark" v-model="tabModel" :style="{maxWidth: 'calc(100% - 270px)'}" v-if="$q.platform.is.desktop">
          <q-route-tab
            v-for="(moduleConfig, moduleName, index) in config"
            :key="index"
            slot="title"
            :name="`${moduleName}`"
            :label="moduleConfig.label"
            hide="label"
            :to="`/${moduleName}`"
          />
        </q-tabs>
        <q-btn flat style="display: flex; flex-wrap: nowrap; width: 50%" v-if="$q.platform.is.mobile">
          <q-item style="padding-left: 0; padding-right: 0"  v-if="configByEntity">
            <q-item-side :icon="configByEntity.icon" style="min-width: 20px" color="white"/>
            <q-item-main>
              <q-item-tile label class="ellipsis overflow-hidden">{{configByEntity.label}}</q-item-tile>
            </q-item-main>
            <q-item-side right icon="mdi-menu-down" style="min-width: 20px; margin-left: 10px" color="white"/>
          </q-item>
          <q-popover fit ref="popoverTab">
            <q-list link separator class="scroll">
              <q-item
                v-for="(moduleConfig, moduleName, index) in config"
                :key="index"
                :to="`/${moduleName}`"
              >
                <q-item style="padding: 0" @click="tabModel = moduleName, $refs.popoverTab.close()">
                  <q-item-side :icon="moduleConfig.icon"/>
                  <q-item-main>
                    <q-item-tile label>{{moduleName}}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
        <q-btn @click="settingsHandler" small flat round icon="mdi-settings"/>
        <q-btn @click="confirmExitHandler" small  flat round icon="mdi-exit-to-app"/>
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
        :isLoading="loadingFlag"
        :isVisibleToolbar="isVisibleToolbar"
        :config="configByEntity"
      >
      </router-view>
    </q-layout>
    <q-inner-loading :visible="loadingFlag" style="z-index: 2001" dark>
      <q-spinner-gears size="100px" color="white" />
    </q-inner-loading>
  </div>
</template>

<script>
  import { debounce, QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QTabs, QRouteTab, LocalStorage, Dialog, Toast, Alert, date, QItem, QItemMain, QItemTile, QItemSide, QPopover, QList, QInnerLoading, QSpinnerGears } from 'quasar-framework'
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
        tabModel: '',
        isVisibleToolbar: true,
        loadingFlag: false
      }
    },
    computed: {
      ...mapState({
        token: (state) => state.token,
        isCustomer: (state) => state.isCustomer,
        isLoading: (state) => state.isLoading
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
              html: 'Please set the count to more than 100.',
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
              html: `You are setting the row count to more than 2000. This can affect your browser performance. Do you want to continue?`,
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
        let config = {
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
          },
          hasData = Object.keys(config).reduce((result, key) => {
            return result || !!config[key].data
          }, false)
        return hasData ? config : hasData
      }
    },
    methods: {
      ...mapMutations([
        'setToken',
        'clearToken'
      ]),
      exitHandler () {
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
      confirmExitHandler () {
        Dialog.create({
          title: 'Confirm',
          message: 'Do you really want to exit?',
          buttons: [
            {
              label: 'No'
            },
            {
              label: 'Yes',
              handler: () => {
                this.exitHandler()
              }
            }
          ]
        })
      },
      settingsHandler () {
        Dialog.create({
          title: 'Settings',
          form: {
            delay: {
              type: 'number',
              label: 'Real-time logs refresh time, sec',
              model: this.delay,
              min: 2
            },
            limit: {
              type: 'number',
              label: 'Page row count',
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
        if (this.logMessageConfig) {
          this.rawConfig = this.logMessageConfig
          this.$refs.rawViewer.open()
        }
        else {
          Toast.create({
            html: 'No additional data available',
            timeout: 1500
          })
        }
      },
      disableLoading: debounce((ctx) => {
        ctx.loadingFlag = false
      }, 200)
    },
    watch: {
      token (val) {
        if (!val) {
          this.$router.push('/login')
        }
      },
      $route (route) {
        if (route.params.token && route.params.id && route.params.type) {
          this.isVisibleToolbar = !route.params.fullscreen
          this.setToken(route.params.token)
          if (Object.keys(config).includes(route.params.type)) {
            this.tabModel = this.$route.params.type
            this.$router.push(`/${route.params.type}/${route.params.id}`)
          }
          else {
            this.tabModel = 'channels'
            this.$router.push('/channels')
          }
        }
        else if (!this.token) { // if not logged in
          this.$router.push('/login')
        }
        else {
          if (route.path === '/') { // if main route
            this.tabModel = 'channels'
            this.$router.push('/channels')
          }
          else { // go to send route
            this.tabModel = this.$route.path.split('/')[1] // rebase logic
            this.$router.push(route.path)
          }
        }
        this.$refs.layout.hideRight()
        this.currentMessage = {}
      },
      isLoading (flag) {
        if (flag) { this.loadingFlag = flag }
        else { this.disableLoading(this) }
      }
    },
    created () {
      let localStorageToken = LocalStorage.get.item('X-Flespi-Token')
      if (this.$route.params.token && this.$route.params.id && this.$route.params.type) {
        this.isVisibleToolbar = !this.$route.params.fullscreen
        this.setToken(this.$route.params.token)
        if (Object.keys(config).includes(this.$route.params.type)) {
          this.tabModel = this.$route.params.type
          this.$router.push(`/${this.$route.params.type}/${this.$route.params.id}`)
        }
        else {
          this.tabModel = 'channels'
          this.$router.push('/channels')
        }
      }
      else if (!this.token && !localStorageToken) { // if not logged in
        this.$router.push('/login')
      }
      else {
        if (localStorageToken) { // if token saved in local-storage
          this.setToken(localStorageToken)
        }
        if (this.$route.path === '/') { // if main route
          this.tabModel = 'channels'
          this.$router.push('/channels')
        }
        else { // go to send route
          this.tabModel = this.$route.path.split('/')[1] // rebase logic
          this.$router.push(this.$route.path)
        }
      }
    },
    components: { QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QTabs, QRouteTab, ObjectViewer, RawViewer, QItem, QItemMain, QItemTile, QItemSide, QPopover, QList, QInnerLoading, QSpinnerGears }
  }
</script>

<style>
  .header__main-toolbar {
    padding: 1px 12px;
  }
</style>
