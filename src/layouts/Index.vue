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
              v-for="(moduleName, index) in renderEntities"
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
                  v-for="(moduleName, index) in renderEntities"
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
          <q-btn v-if="errors.length" @click="clearNotificationCounter" small flat round icon="notifications">
            <q-chip v-if="newNotificationCounter" floating color="red">{{newNotificationCounter}}</q-chip>
            <q-popover fit ref="popoverError">
              <q-list no-border style="max-height: 200px" link separator class="scroll">
                <q-item
                  v-for="(error, index) in errors"
                  :key="index"
                  style="cursor: default"
                >
                  <q-item-main>
                    <q-item-tile label>{{error}}</q-item-tile>
                  </q-item-main>
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
            v-if="configByEntity && isInit"
            @view-data="viewDataHandler"
            @view-data-hide="sides.right = false, currentMessage = {}"
            @view-log-message="viewLogMessagesHandler"
            :limit="limit"
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
import Vue from 'vue'
import { debounce, date } from 'quasar'
import { mapState, mapMutations, mapActions } from 'vuex'
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
      tabModel: '',
      isVisibleToolbar: true,
      loadingFlag: false,
      isTabsVisible: true,
      tabsByGroup: ['platform', 'channels', 'devices', 'streams', 'modems', 'containers', 'abques', 'cdns', 'mqtt'],
      isNeedSelect: true,
      isInit: false
    }
  },
  computed: {
    ...mapState({
      token: (state) => state.token,
      isLoading: (state) => state.isLoading,
      config: state => state.config,
      errors: state => state.errors,
      newNotificationCounter: state => state.newNotificationCounter
    }),
    configByEntity () {
      return this.config[this.tabModel]
    },
    renderEntities () {
      return this.tabsByGroup.filter((name) => {
        return this.config[name].isDrawable
      })
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
      'clearToken',
      'reqFailed',
      'addError',
      'clearNotificationCounter'
    ]),
    ...mapActions(['getTokenInfo']),
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
      }).then(() => { this.reset() })
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
    }, 200),
    getGroups (groups) {
      return groups.reduce((result, group) => {
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
    },
    reset (errMessage) {
      Vue.connector.socket.off('error')
      this.clearToken()
      this.$router.push(`/login`)
      if (errMessage) {
        this.addError(errMessage)
      }
    },
    setDefaultTabModel () {
      if (this.renderEntities.length) {
        this.tabModel = this.renderEntities[0]
        this.$router.push(`/${this.renderEntities[0]}`)
      } else {
        this.reset('Nothing to show by current token')
      }
    },
    routeProcess (route) {
      if (route.params.group) {
        let groups = this.$route.params.group.split(','),
          tabsByGroups = this.getGroups(groups)
        if (tabsByGroups.length) { this.tabsByGroup = tabsByGroups }
      }
      if (route.params.token) {
        this.routeParamsProcess(route)
      } else if (!this.token) { // if not logged in
        this.$router.push({name: 'simpleLogin', params: { goto: route.path }})
      } else {
        this.routeMainProcess(route)
      }
    },
    routeParamsProcess (route) {
      this.isNeedSelect = !this.$route.params.noselect
      this.isVisibleToolbar = !route.params.fullscreen
      this.setToken(route.params.token)
      this.getTokenInfo().then(() => {
        if (route.params.id && route.params.type) {
          if (this.renderEntities.includes(route.params.type)) {
            this.tabModel = this.$route.params.type
            this.$router.push(`/${route.params.type}/${route.params.id}`)
          } else {
            this.reset('Nothing to show by current token')
          }
        } else {
          this.setDefaultTabModel()
        }
      })
    },
    routeMainProcess (route) {
      if (route.path === '/') { // if main route
        this.setDefaultTabModel()
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
  watch: {
    token (val) {
      if (!val) {
        this.$router.push('/login')
      }
    },
    $route (route) {
      this.routeProcess(route)
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
    this.routeProcess(this.$route)
    Vue.connector.socket.on('error', (error) => {
      this.reqFailed(error)
    })
    this.loadingFlag = true
    Vue.connector.socket.on('connect', () => {
      this.isInit = true
      this.loadingFlag = false
    })
  },
  beforeDestroy () {
    Vue.connector.socket.off('error')
    Vue.connector.socket.off('connect')
  },
  components: { ObjectViewer, RawViewer }
}
</script>

<style>
  .header__main-toolbar {
    padding: 1px 12px;
  }
</style>
