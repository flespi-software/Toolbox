<template>
  <div>
    <q-layout ref="layout" view="hHh LpR lFf" class="bg-dark">
      <q-layout-header v-if="isVisibleToolbar">
        <q-toolbar color="dark" class="header__main-toolbar">
          <q-btn flat icon="mdi-menu" @click="sides.left = !sides.left"/>
          <q-toolbar-title :style="{minWidth: $q.platform.is.mobile ? '60px' : '210px'}">
            <img class="gt-sm" src="statics/toolbox50.png" alt="Toolbox" style="height: 30px">
            <img class="lt-md" src="statics/toolbox_mobile.png" alt="Toolbox" style="height: 30px">
            <sup class="version" :class="{'version--mobile': $q.platform.is.mobile}">{{version}}</sup>
            <span v-if="configByEntity" style="position: relative; top: -5px; margin-left: 10px;">{{configByEntity.label}}</span>
          </q-toolbar-title>
          <q-btn v-if="errors.length" @click="clearNotificationCounter" small flat round icon="notifications">
            <q-chip v-if="newNotificationCounter" floating color="red">{{newNotificationCounter}}</q-chip>
            <q-popover fit ref="popoverError">
              <q-list no-border style="max-height: 200px" link separator class="scroll q-py-none">
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
      <q-layout-drawer side="left" v-model="sides.left" :content-class="{'bg-white':true}" v-if="isVisibleToolbar">
        <q-list separator class="q-py-none">
          <q-item v-if="renderEntities.includes('platform')" to='/platform' class="q-pt-md q-pb-md">
            <q-item-side color="red" :icon="config.platform.icon"></q-item-side>
            <q-item-main><q-item-tile>{{config.platform.label}}</q-item-tile></q-item-main>
          </q-item>
          <q-collapsible
            v-if="renderEntities.includes('channels') || renderEntities.includes('devices') || renderEntities.includes('streams') || renderEntities.includes('modems')"
            group="menu"
            label="Telematics Hub"
            icon="mdi-sitemap"
            class="q-pt-md q-pb-md"
            :value="hubGroupModel"
          >
            <div>
              <q-list class="row q-py-none">
                <q-item v-if="renderEntities.includes('channels')" to='/channels' class="col-6">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.channels.icon" size="2.6em"/>
                    </div>
                    <div>{{config.channels.label}}</div>
                  </q-item-main>
                </q-item>
                <q-item v-if="renderEntities.includes('devices')" to='/devices' class="col-6">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.devices.icon" size="2.6em"/>
                    </div>
                    <div>{{config.devices.label}}</div>
                  </q-item-main>
                </q-item>
                <q-item v-if="renderEntities.includes('streams')" to='/streams' class="col-6">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.streams.icon" size="2.6em"/>
                    </div>
                    <div>{{config.streams.label}}</div>
                  </q-item-main>
                </q-item>
                <q-item v-if="renderEntities.includes('modems')" to='/modems' class="col-6">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.modems.icon" size="2.6em"/>
                    </div>
                    <div>{{config.modems.label}}</div>
                  </q-item-main>
                </q-item>
                <q-item-separator style="width: 100%" v-if="renderEntities.includes('channels') || renderEntities.includes('devices') || renderEntities.includes('streams') || renderEntities.includes('modems')"/>
                <q-item v-if="renderEntities.includes('calcs')" to='/calcs' class="col-6">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.calcs.icon" size="2.6em"/>
                    </div>
                    <div>{{config.calcs.label}}</div>
                  </q-item-main>
                </q-item>
                <q-item-separator style="width: 100%" v-if="renderEntities.includes('calcs')"/>
                <q-list-header class="col-12" v-if="renderEntities.includes('hexViewer')">Tools</q-list-header>
                <q-item to='/tools/hex' class="col-6" v-if="renderEntities.includes('hexViewer')">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.hexViewer.icon" size="2.6em"/>
                    </div>
                    <div>{{config.hexViewer.label}}</div>
                  </q-item-main>
                </q-item>
              </q-list>
            </div>
          </q-collapsible>
          <q-collapsible
            v-if="renderEntities.includes('containers') || renderEntities.includes('cdns')"
            group="menu"
            label="Storage"
            icon="mdi-database"
            class="q-pt-md q-pb-md"
            :value="storageGroupModel"
          >
            <div>
              <q-list class="row q-py-none">
                <q-item v-if="renderEntities.includes('containers')" to='/containers' class="col-6">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.containers.icon" size="2.6em"/>
                    </div>
                    <div>{{config.containers.label}}</div>
                  </q-item-main>
                </q-item>
                <q-item v-if="renderEntities.includes('cdns')" to='/cdns' class="col-6">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.cdns.icon" size="2.6em"/>
                    </div>
                    <div>{{config.cdns.label}}</div>
                  </q-item-main>
                </q-item>
              </q-list>
            </div>
          </q-collapsible>
          <q-collapsible
            group="menu"
            label="MQTT"
            icon="mdi-access-point-network"
            class="q-pt-md q-pb-md"
            :value="mqttGroupModel"
            v-if="renderEntities.includes('mqtt') || renderEntities.includes('mqttClient')"
          >
            <div>
              <q-list class="row q-py-none">
                <q-item v-if="renderEntities.includes('mqtt')" to='/mqtt' class="col-6">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.mqtt.icon" size="2.6em"/>
                    </div>
                    <div>{{config.mqtt.label}}</div>
                  </q-item-main>
                </q-item>
                <q-item-separator v-if="renderEntities.includes('mqtt')" style="width: 100%"/>
                <q-list-header class="col-12">Tools</q-list-header>
                <q-item to='/tools/mqtt' class="col-6">
                  <q-item-main class="text-center">
                    <div>
                      <q-icon :name="config.mqttClient.icon" size="2.6em"/>
                    </div>
                    <div>{{config.mqttClient.label}}</div>
                  </q-item-main>
                </q-item>
              </q-list>
            </div>
          </q-collapsible>
        </q-list>
      </q-layout-drawer>
      <q-page-container class="bg-dark">
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
      </q-page-container>
    </q-layout>
    <q-inner-loading :visible="loadingFlag" style="z-index: 2001" dark>
      <q-spinner-gears size="100px" color="white" />
    </q-inner-loading>
  </div>
</template>

<script>
import Vue from 'vue'
import { date } from 'quasar'
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
        left: !this.$q.platform.within.iframe,
        right: false
      },
      currentLimit: 1000,
      rawConfig: {},
      entity: '',
      isVisibleToolbar: true,
      connectFlag: false,
      isTabsVisible: true,
      entityByGroup: ['platform', 'channels', 'calcs', 'devices', 'streams', 'modems', 'containers', 'cdns', 'mqtt', 'mqttClient', 'hexViewer'],
      isNeedSelect: true,
      isInit: Vue.connector.socket.connected()
    }
  },
  computed: {
    ...mapState({
      token: (state) => state.token,
      isLoading (state) {
        return state.isLoading ||
          !!(this.configByEntity && this.configByEntity.messages && state[this.configByEntity.messages.vuexModuleName] && state[this.configByEntity.messages.vuexModuleName].isLoading) ||
          !!(this.configByEntity && this.configByEntity.logs && state[this.configByEntity.logs.vuexModuleName] && state[this.configByEntity.logs.vuexModuleName].isLoading)
      },
      config: state => state.config,
      errors: state => state.errors,
      newNotificationCounter: state => state.newNotificationCounter
    }),
    loadingFlag () {
      return this.connectFlag || this.isLoading
    },
    hubGroupModel () {
      let entity = this.entity
      return entity === 'channels' || entity === 'calcs' || entity === 'devices' || entity === 'streams' || entity === 'modems' || entity === 'hexViewer' || entity === 'intervals'
    },
    storageGroupModel () {
      let entity = this.entity
      return entity === 'containers' || entity === 'cdns'
    },
    mqttGroupModel () {
      let entity = this.entity
      return entity === 'mqtt' || entity === 'mqttClient'
    },
    configByEntity () {
      if (this.entity === 'intervals') {
        return this.config['devices']
      }
      return this.config[this.entity]
    },
    renderEntities () {
      return this.entityByGroup.filter((name) => {
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
          'log object': {
            title: 'log object',
            description: this.currentData._description,
            wrapper: JsonTree,
            data: this.currentData
          },
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
            title: `${this.currentData.name} [${date.formatDate(this.currentData.timestamp * 1000, 'HH:mm:ss')}]`,
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
    viewDataHandler (content) {
      /* remove system field */
      content = Object.keys(content).reduce((content, name) => {
        if (name.indexOf('x-flespi') === 0) {
          delete content[name]
        }
        return content
      }, content)
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
    getGroups (groups) {
      return groups.reduce((result, group) => {
        if (['hub', 'storage', 'mqtt', 'platform'].includes(group)) {
          switch (group) {
            case 'hub': {
              result.push('channels')
              result.push('calcs')
              result.push('devices')
              result.push('streams')
              result.push('modems')
              result.push('hexViewer')
              break
            }
            case 'storage': {
              result.push('containers')
              result.push('cdns')
              break
            }
            case 'mqtt': {
              result.push('mqtt')
              result.push('mqttClient')
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
      this.clearToken()
      this.$router.push(`/login`)
      if (errMessage) {
        this.addError(errMessage)
      }
    },
    setDefaultEntity () {
      if (this.renderEntities.length) {
        this.$router.push(`/${this.config[this.renderEntities[0]].path || this.renderEntities[0]}`)
        this.entity = this.renderEntities[0]
      } else {
        this.reset('Nothing to show by current token')
      }
    },
    routeProcess (route) {
      if (route.params.group) {
        let routeProcessIndex = Vue.connector.socket.on('connect', () => {
          let groups = this.$route.params.group.split(','),
            entityByGroups = this.getGroups(groups)
          if (entityByGroups.length) {
            this.entityByGroup = entityByGroups
            this.setDefaultEntity()
          }
          Vue.connector.socket.off('connect', routeProcessIndex)
        })
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
      this.$q.sessionStorage.set('toolbox-session-settings', { isNeedSelect: this.isNeedSelect, isVisibleToolbar: this.isVisibleToolbar })
      this.setToken(route.params.token)
      if (route.params.id && route.params.type) {
        let routeProcessIndex = Vue.connector.socket.on('connect', () => {
          if (this.renderEntities.includes(route.params.type)) {
            this.entity = this.$route.params.type
            this.$router.push(`/${route.params.type}/${route.params.id}`)
          } else {
            this.reset('Nothing to show by current token')
          }
          Vue.connector.socket.off('connect', routeProcessIndex)
        })
      }
    },
    routeMainProcess (route) {
      if (route.path === '/') { // if main route
        this.setDefaultEntity()
      } else { // go to send route
        if (this.$route.meta.moduleName) {
          this.entity = this.$route.meta.moduleName
          if (this.$route.meta.moduleName === this.entity) { return false }
          this.$router.push(this.$route.path)
        } else {
          this.$router.push(this.$route.path)
        }
      }
    },
    connectionPreserveHandler () {
      this.isInit = true
      this.connectFlag = false
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
    }
  },
  created () {
    this.routeProcess(this.$route)
    let sessionSettings = this.$q.sessionStorage.get.item('toolbox-session-settings')
    if (sessionSettings) {
      this.isNeedSelect = sessionSettings.isNeedSelect
      this.isVisibleToolbar = sessionSettings.isVisibleToolbar
    }
    if (!this.isInit) {
      this.connectFlag = true
      this.connectionPreserveHandlerIndex = Vue.connector.socket.on('connect', this.connectionPreserveHandler)
    }
  },
  beforeDestroy () {
    this.connectionPreserveHandlerIndex !== undefined && Vue.connector.socket.off('connect', this.connectionPreserveHandlerIndex)
  },
  components: { ObjectViewer, RawViewer }
}
</script>

<style lang="stylus">
  .version
    position absolute
    left 175px
    top 4px
    font-size 0.7rem
    &--mobile
      left 105px
  .header__main-toolbar
    padding 1px 12px
</style>
