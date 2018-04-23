<template>
  <div v-if="tabModel">
    <q-layout ref="layout" view="hHh LpR lFf">
      <q-layout-header v-if="isVisibleToolbar">
        <q-toolbar color="dark" class="header__main-toolbar">
          <q-toolbar-title :style="{minWidth: $q.platform.is.mobile ? '60px' : '210px'}">
            <img :src="$q.platform.is.mobile ? 'statics/toolbox_mobile.png':'statics/toolbox50.png'" alt="Track it!" style="height: 30px"> <sup class="gt-sm">{{version}}</sup>
          </q-toolbar-title>
          <q-window-resize-observable @resize="onResizeWindow" />
          <q-tabs color="dark" v-model="tabModel" :style="{maxWidth: 'calc(100% - 270px)'}" v-if="$q.platform.is.desktop && isTabsVisible">
            <q-route-tab
              v-for="(moduleName, index) in tabsByGroup"
              :key="index"
              slot="title"
              :name="`${moduleName}`"
              :label="config[moduleName].label"
              hide="label"
              :to="`/${moduleName}`"
            />
          </q-tabs>
          <q-btn flat style="display: flex; flex-wrap: nowrap; width: 50%" v-if="$q.platform.is.mobile || ($q.platform.is.desktop && !isTabsVisible)">
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
                  v-for="(moduleName, index) in tabsByGroup"
                  :key="index"
                  :to="`/${moduleName}`"
                >
                  <q-item style="padding: 0" @click="tabModel = moduleName, $refs.popoverTab.close()">
                    <q-item-side :icon="config[moduleName].icon"/>
                    <q-item-main>
                      <q-item-tile label>{{moduleName}}</q-item-tile>
                    </q-item-main>
                  </q-item>
                </q-item>
              </q-list>
            </q-popover>
          </q-btn>
          <q-btn @click="settingsHandler" small flat round icon="mdi-settings"/>
          <q-btn class="within-iframe-hide" @click="confirmExitHandler" small  flat round icon="mdi-exit-to-app"/>
        </q-toolbar>
      </q-layout-header>
      <q-layout-drawer side="right" no-swipe-open no-swipe-close v-model="sides.right" :content-class="{'bg-dark':true}">
        <object-viewer
          @close="hideRightHandler"
          :object="currentMessage"
          v-if="Object.keys(currentMessage).length"
        />
      </q-layout-drawer>
      <q-page-container :style="{background: '#333'}">
        <q-page>
          <raw-viewer
            ref="rawViewer"
            :config="rawConfig"
            inverted
          />
          <router-view
            ref='main'
            v-if="configByEntity"
            @view-data="viewDataHandler"
            @view-data-hide="sides.right = false, currentMessage = {}"
            @view-log-message="viewLogMessagesHandler"
            :limit="limit"
            :isCustomer="isCustomer"
            :isLoading="loadingFlag"
            :isVisibleToolbar="isVisibleToolbar"
            :isNeedSelect="isNeedSelect"
            :config="configByEntity"
          >
          </router-view>
        </q-page>
      </q-page-container>
    </q-layout>
    <q-inner-loading :visible="loadingFlag" style="z-index: 2001" dark>
      <q-spinner-gears size="100px" color="white" />
    </q-inner-loading>
  </div>
</template>

<script>
import { debounce, date } from 'quasar'
import config from '../config.json'
import { mapState, mapMutations } from 'vuex'
import dist from '../../package.json'
import ObjectViewer from '../components/ObjectViewer.vue'
import RawViewer from '../components/RawViewer.vue'
import JsonTree from '../components/JsonTree.vue'

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
      rawConfig: {},
      config: config,
      tabModel: '',
      isVisibleToolbar: true,
      loadingFlag: false,
      isTabsVisible: true,
      tabsByGroup: Object.keys(config),
      isNeedSelect: true
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
          this.$q.notify({
            type: 'negative',
            message: 'Please set the count to more than 100.',
            timeout: 1500
          })
          this.currentLimit = 100
        } else if (val > 2000 && this.currentLimit <= 2000) {
          this.$q.notify({
            color: 'amber-9',
            icon: 'warning',
            timeout: 10000,
            message: `You are setting the row count to more than 2000. This can affect your browser performance. Do you want to continue?`,
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
        } else {
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
          'properties': {
            title: 'properties',
            wrapper: JsonTree,
            data: this.currentData.properties
          },
          'pending': {
            title: 'pending',
            wrapper: JsonTree,
            data: this.currentData.pending
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
    onResizeWindow (size) {
      size.width > 767 ? this.isTabsVisible = true : this.isTabsVisible = false
    },
    viewDataHandler (content) {
      this.currentMessage = JSON.parse(JSON.stringify(content))
      setTimeout(() => { this.sides.right = true }, 20)
    },
    hideRight () {
      this.sides.right = false
      this.currentMessage = {}
    },
    hideRightHandler () {
      this.hideRight()
      this.$refs.main.unselect()
    },
    confirmExitHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to exit?',
        cancel: true,
        ok: true
      }).then(() => { this.exitHandler() })
        .catch(() => {})
    },
    settingsHandler () {
      this.$q.dialog({
        title: 'Settings',
        message: 'Page row count',
        prompt: {
          model: this.limit,
          type: 'number'
        },
        ok: true,
        cancel: true
      }).then((data) => { this.limit = data })
        .catch(() => {})
    },
    viewLogMessagesHandler (content) {
      this.currentData = JSON.parse(JSON.stringify(content))
      if (this.logMessageConfig) {
        this.rawConfig = this.logMessageConfig
        this.$refs.rawViewer.open()
      } else {
        this.$q.notify({
          message: 'No additional data available',
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
      if (this.$route.params.group) {
        let groups = this.$route.params.group.split(',')
        let tabsByGroups = groups.reduce((result, group) => {
          if (['hub', 'storage', 'mqtt', 'platform'].includes(group)) {
            switch (group) {
              case 'hub': {
                result.push('channels')
                result.push('devices')
                result.push('streams')
                result.push('modems')
                break
              }
              case 'storage': {
                result.push('containers')
                result.push('abques')
                result.push('cdns')
                break
              }
              case 'mqtt': {
                result.push('mqtt')
                break
              }
              case 'platform': {
                result.push('mqtt')
                break
              }
            }
          }
          return result
        }, [])
        if (tabsByGroups.length) { this.tabsByGroup = tabsByGroups }
      }
      if (route.params.token) {
        this.isNeedSelect = !this.$route.params.noselect
        this.isVisibleToolbar = !route.params.fullscreen
        this.setToken(route.params.token)
        if (route.params.id && route.params.type) {
          if (Object.keys(config).includes(route.params.type)) {
            this.tabModel = this.$route.params.type
            this.$router.push(`/${route.params.type}/${route.params.id}`)
          } else {
            this.tabModel = 'platform'
            this.$router.push('/platform')
          }
        } else {
          this.tabModel = this.tabsByGroup[0]
          this.$router.push(`/${this.tabsByGroup[0]}`)
        }
      } else if (!this.token) { // if not logged in
        this.$router.push('/login')
      } else {
        if (route.path === '/') { // if main route
          this.tabModel = this.tabsByGroup[0]
          this.$router.push(`/${this.tabsByGroup[0]}`)
        } else { // go to send route
          if (this.$route.meta.moduleName) {
            this.tabModel = this.$route.meta.moduleName
            this.$router.push(`/${this.$route.meta.moduleName}${this.$route.params.id ? `/${this.$route.params.id}` : ''}`)
          } else {
            this.$router.push(this.$route.path)
          }
        }
      }
      if (this.$refs.layout) {
        this.hideRight()
      }
    },
    isLoading (flag) {
      if (flag) {
        this.loadingFlag = flag
      } else {
        this.disableLoading(this)
      }
    }
  },
  created () {
    let localStorageToken = this.$q.localStorage.get.item('X-Flespi-Token')
    if (this.$route.params.group) {
      let groups = this.$route.params.group.split(',')
      let tabsByGroups = groups.reduce((result, group) => {
        if (['hub', 'storage', 'mqtt', 'platform'].includes(group)) {
          switch (group) {
            case 'hub': {
              result.push('channels')
              result.push('devices')
              result.push('streams')
              result.push('modems')
              break
            }
            case 'storage': {
              result.push('containers')
              result.push('abques')
              result.push('cdns')
              break
            }
            case 'mqtt': {
              result.push('mqtt')
              break
            }
            case 'platform': {
              result.push('platform')
              break
            }
          }
        }
        return result
      }, [])
      if (tabsByGroups.length) { this.tabsByGroup = tabsByGroups }
    }
    if (this.$route.params.token) {
      this.isNeedSelect = !this.$route.params.noselect
      this.isVisibleToolbar = !this.$route.params.fullscreen
      this.setToken(this.$route.params.token)
      if (this.$route.params.id && this.$route.params.type) {
        if (Object.keys(config).includes(this.$route.params.type)) {
          this.tabModel = this.$route.params.type
          this.$router.push(`/${this.$route.params.type}/${this.$route.params.id}`)
        } else {
          this.tabModel = 'platform'
          this.$router.push('/platform')
        }
      } else {
        this.tabModel = this.tabsByGroup[0]
        this.$router.push(`/${this.tabsByGroup[0]}`)
      }
    } else if (!this.token && !localStorageToken) { // if not logged in
      this.$router.push('/login')
    } else {
      if (localStorageToken) { // if token saved in local-storage
        this.setToken(localStorageToken)
      }
      if (this.$route.path === '/') { // if main route
        this.tabModel = this.tabsByGroup[0]
        this.$router.push(`/${this.tabsByGroup[0]}`)
      } else { // go to send route
        if (this.$route.meta.moduleName) {
          this.tabModel = this.$route.meta.moduleName
          this.$router.push(`/${this.$route.meta.moduleName}${this.$route.params.id ? `/${this.$route.params.id}` : ''}`)
        } else {
          this.$router.push(this.$route.path)
        }
      }
    }
  },
  components: { ObjectViewer, RawViewer }
}
</script>

<style>
  .header__main-toolbar {
    padding: 1px 12px;
  }
</style>