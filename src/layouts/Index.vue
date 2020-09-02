<template>
  <div>
    <q-layout ref="layout" view="hHh LpR lFf" class="bg-grey-9">
      <q-header v-if="isVisibleToolbar">
        <q-toolbar class="header__main-toolbar bg-grey-9">
          <q-btn flat icon="mdi-menu" @click="toggleMenu"/>
          <q-toolbar-title :style="{minWidth: $q.platform.is.mobile ? '60px' : '210px'}">
            <img class="gt-sm" src="statics/toolbox50.png" alt="Toolbox" style="height: 30px">
            <img class="lt-md" src="statics/toolbox_mobile.png" alt="Toolbox" style="height: 30px">
            <sup class="version" :class="{'version--mobile': $q.platform.is.mobile}">{{version}}({{localeName}})</sup>
            <span v-if="configByEntity" style="position: relative; top: -5px; margin-left: 10px;">{{configByEntity.label}}</span>
          </q-toolbar-title>
          <q-btn v-if="errors.length" @click="clearNotificationCounter" small flat round icon="notifications">
            <q-chip v-if="newNotificationCounter" color="red" size="xs" class="absolute-top-right q-ma-none text-white">{{newNotificationCounter}}</q-chip>
            <q-menu fit ref="popoverError">
              <q-list style="max-height: 200px" separator class="scroll q-py-none">
                <q-item
                  v-for="(error, index) in errors"
                  :key="index"
                  style="cursor: default"
                >
                  <q-item-section>
                    <q-item-label header>{{error}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn @click="settingsHandler" small flat round icon="mdi-settings">
            <settings ref="settings" :limit="limit" @input="saveSettings" @clear="clearSettings" />
          </q-btn>
          <q-btn class="within-iframe-hide" @click="confirmExitHandler" small  flat round icon="mdi-exit-to-app"/>
        </q-toolbar>
      </q-header>
      <q-drawer side="right" no-swipe-open no-swipe-close v-model="sides.right" :content-class="{'bg-grey-9':true}">
        <object-viewer
          @close="hideRightHandler"
          @update:col="updateColHandler"
          :object="currentMessage"
          :cols="messagesColsCollectionByEntity"
          v-if="Object.keys(currentMessage).length"
        />
        <cols-editor
          v-else-if="colsEditing"
          :cols="colsForEditing"
          @cols:close="sides.right = false"
          @cols:update="updateColsHandler"
          @cols:default="setDefaultColsHandler"
        />
      </q-drawer>
      <q-drawer side="left" v-model="sides.left" :content-class="{'bg-grey-7':true}" v-if="isVisibleToolbar">
        <q-list separator class="q-py-none">
          <q-item v-if="renderEntities.includes('platform')" to='/platform' active-class="bg-grey-6 text-white">
            <q-item-section avatar>
              <q-icon :name="config.platform.icon" color="red"/>
            </q-item-section>
            <q-item-section class="text-white">
              {{config.platform.label}}
            </q-item-section>
          </q-item>
          <q-expansion-item
            v-if="renderEntities.includes('channels') || renderEntities.includes('devices') || renderEntities.includes('streams') || renderEntities.includes('modems')"
            group="menu"
            label="Telematics Hub"
            icon="mdi-sitemap"
            :value="hubGroupModel"
            dark
          >
            <div>
              <q-list class="row q-py-none">
                <q-item v-if="renderEntities.includes('channels')" to='/channels' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.channels.icon" size="2.6em"/>
                    </div>
                    <div>{{config.channels.label}}</div>
                  </q-item-section>
                </q-item>
                <q-item v-if="renderEntities.includes('devices')" to='/devices' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.devices.icon" size="2.6em"/>
                    </div>
                    <div>{{config.devices.label}}</div>
                  </q-item-section>
                </q-item>
                <q-item v-if="renderEntities.includes('streams')" to='/streams' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.streams.icon" size="2.6em"/>
                    </div>
                    <div>{{config.streams.label}}</div>
                  </q-item-section>
                </q-item>
                <q-item v-if="renderEntities.includes('modems')" to='/modems' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.modems.icon" size="2.6em"/>
                    </div>
                    <div>{{config.modems.label}}</div>
                  </q-item-section>
                </q-item>
                <q-separator style="width: 100%" v-if="renderEntities.includes('channels') || renderEntities.includes('devices') || renderEntities.includes('streams') || renderEntities.includes('modems')"/>
                <!-- <q-item v-if="renderEntities.includes('intervals')" to='/device/null/calc/null/intervals' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.intervals.icon" size="2.6em"/>
                    </div>
                    <div>{{config.intervals.label}}</div>
                  </q-item-section>
                </q-item> -->
                <q-item v-if="renderEntities.includes('calcs')" to='/calcs' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.calcs.icon" size="2.6em"/>
                    </div>
                    <div>{{config.calcs.label}}</div>
                  </q-item-section>
                </q-item>
                <q-item v-if="renderEntities.includes('plugins')" to='/plugins' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.plugins.icon" size="2.6em"/>
                    </div>
                    <div>{{config.plugins.label}}</div>
                  </q-item-section>
                </q-item>
                <q-separator style="width: 100%" v-if="renderEntities.includes('intervals') || renderEntities.includes('calcs') || renderEntities.includes('plugins')"/>
                <q-item-label header class="col-12 text-white" v-if="renderEntities.includes('hexViewer') || renderEntities.includes('trafficViewer')">Tools</q-item-label>
                <q-item to='/tools/hex' class="col-6" v-if="renderEntities.includes('hexViewer')" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.hexViewer.icon" size="2.6em"/>
                    </div>
                    <div>{{config.hexViewer.label}}</div>
                  </q-item-section>
                </q-item>
                <q-item to='/tools/traffic' class="col-6" v-if="renderEntities.includes('trafficViewer')" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.trafficViewer.icon" size="2.6em"/>
                    </div>
                    <div>{{config.trafficViewer.label}}</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-expansion-item>
          <q-expansion-item
            v-if="renderEntities.includes('containers') || renderEntities.includes('cdns')"
            group="menu"
            label="Storage"
            icon="mdi-database"
            :value="storageGroupModel"
            dark
          >
            <div>
              <q-list class="row q-py-none">
                <q-item v-if="renderEntities.includes('containers')" to='/containers' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.containers.icon" size="2.6em"/>
                    </div>
                    <div>{{config.containers.label}}</div>
                  </q-item-section>
                </q-item>
                <q-item v-if="renderEntities.includes('cdns')" to='/cdns' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.cdns.icon" size="2.6em"/>
                    </div>
                    <div>{{config.cdns.label}}</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-expansion-item>
          <q-expansion-item
            group="menu"
            label="MQTT"
            icon="mdi-access-point-network"
            :value="mqttGroupModel" dark
            v-if="renderEntities.includes('mqtt') || renderEntities.includes('mqttClient')"
          >
            <div>
              <q-list class="row q-py-none">
                <q-item v-if="renderEntities.includes('mqtt')" to='/mqtt' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.mqtt.icon" size="2.6em"/>
                    </div>
                    <div>{{config.mqtt.label}}</div>
                  </q-item-section>
                </q-item>
                <q-separator v-if="renderEntities.includes('mqtt')" style="width: 100%"/>
                <q-item-label header class="col-12 text-white">Tools</q-item-label>
                <q-item to='/tools/mqtt' class="col-6" active-class="bg-grey-6">
                  <q-item-section class="text-center text-white">
                    <div>
                      <q-icon :name="config.mqttClient.icon" size="2.6em"/>
                    </div>
                    <div>{{config.mqttClient.label}}</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-expansion-item>
        </q-list>
      </q-drawer>
      <q-page-container class="bg-grey-9">
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
          :settings="settings"
          @update:settings="updateSettingsHandler"
          @inited="entityInited = true"
          @uninited="entityInited = false"
        >
        </router-view>
      </q-page-container>
    </q-layout>
    <q-inner-loading :showing="loadingFlag" style="z-index: 2001" dark>
      <q-spinner-gears size="100px" color="white" />
    </q-inner-loading>
  </div>
</template>

<script>
import Vue from 'vue'
import { date } from 'quasar'
import { mapState, mapMutations, mapActions } from 'vuex'
import dist from '../../package.json'
import ObjectViewer from '../components/ObjectViewer.vue'
import { ColsEditor } from 'qvirtualscroll'
import RawViewer from '../components/RawViewer.vue'
import JsonTree from '../components/JsonTree.vue'
import Settings from '../components/Settings.vue'

export default {
  data () {
    return {
      version: dist.version,
      currentMessage: {},
      currentData: {},
      sides: {
        left: !this.$q.platform.within.iframe && !this.$q.platform.is.mobile,
        right: false
      },
      currentLimit: 1000,
      rawConfig: {},
      entity: '',
      isVisibleToolbar: true,
      connectFlag: false,
      isTabsVisible: true,
      entityByGroup: ['platform', 'channels', 'calcs', 'intervals', 'plugins', 'devices', 'streams', 'modems', 'containers', 'cdns', 'mqtt', 'mqttClient', 'hexViewer', 'trafficViewer'],
      isNeedSelect: true,
      entityInited: false,
      isInit: Vue.connector.socket.connected(),
      colsEditing: false
    }
  },
  computed: {
    ...mapState({
      token: (state) => state.token,
      isLoading (state) {
        return state.isLoading && !this.entityInited
      },
      config: state => state.config,
      errors: state => state.errors,
      newNotificationCounter: state => state.newNotificationCounter,
      settings: state => state.settings,
      localeName: state => state.sessionSettings && state.sessionSettings.region && state.sessionSettings.region.name,
      sessionSettings: state => state.sessionSettings
    }),
    messagesColsCollectionByEntity () {
      return this.messagesColsByEntity.reduce((cols, col, index) => {
        cols[col.name] = col
        cols[col.name].index = index
        return cols
      }, {})
    },
    messagesColsByEntity: {
      get () {
        const moduleName = this.messagesConfigByEntity.vuexModuleName
        let cols = []
        if (this.$store.state[moduleName] && this.$store.state[moduleName].cols) {
          cols = this.$store.state[moduleName].cols
        }
        return cols
      },
      set (cols) {
        const moduleName = this.messagesConfigByEntity.vuexModuleName
        this.$store.commit(`${moduleName}/updateCols`, cols)
      }
    },
    messagesConfigByEntity () {
      return this.configByEntity.messages
    },
    logsColsByEntity: {
      get () {
        if (!this.configByEntity.logs) { return [] }
        const moduleName = this.configByEntity.logs.vuexModuleName
        let cols = []
        if (this.$store.state[moduleName] && this.$store.state[moduleName].cols) {
          cols = this.$store.state[moduleName].cols
        }
        return cols
      },
      set (cols) {
        const moduleName = this.configByEntity.logs.vuexModuleName
        this.$store.commit(`${moduleName}/updateCols`, cols)
      }
    },
    colsForEditing: {
      get () {
        let cols = null
        if (this.colsEditing === 'messages') {
          cols = this.messagesColsByEntity
        } else if (this.colsEditing === 'logs') {
          cols = this.logsColsByEntity
        }
        return cols
      },
      set (cols) {
        if (this.colsEditing === 'messages') {
          this.messagesColsByEntity = cols
        } else if (this.colsEditing === 'logs') {
          this.logsColsByEntity = cols
        }
      }
    },
    loadingFlag () {
      return this.connectFlag || this.isLoading
    },
    hubGroupModel () {
      const entity = this.entity
      return entity === 'channels' || entity === 'calcs' || entity === 'intervals' || entity === 'plugins' || entity === 'devices' || entity === 'streams' || entity === 'modems' || entity === 'hexViewer' || entity === 'trafficViewer' || entity === 'intervals'
    },
    storageGroupModel () {
      const entity = this.entity
      return entity === 'containers' || entity === 'cdns'
    },
    mqttGroupModel () {
      const entity = this.entity
      return entity === 'mqtt' || entity === 'mqttClient'
    },
    configByEntity () {
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
            message: 'You are setting the row count to more than 2000. This can affect your browser performance. Do you want to continue?',
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
      const config = {
          'log object': {
            title: 'log object',
            description: this.currentData._description,
            wrapper: JsonTree,
            data: this.currentData
          },
          item_data: {
            title: 'item data',
            wrapper: JsonTree,
            data: this.currentData.item_data
          },
          http_data: {
            title: 'http data',
            wrapper: JsonTree,
            data: this.currentData.http_data
          },
          properties: {
            title: 'properties',
            wrapper: JsonTree,
            data: this.currentData.properties
          },
          pending: {
            title: 'pending',
            wrapper: JsonTree,
            data: this.currentData.pending
          },
          current: {
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
      'setCid',
      'clearToken',
      'reqFailed',
      'addError',
      'clearNotificationCounter',
      'clearToolboxSettings',
      'setToolboxSessionSettings'
    ]),
    ...mapActions(['initConnection']),
    viewDataHandler (content) {
      if (this.colsEditing) { this.colsEditing = false }
      if (!content) { return }
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
    toggleMenu () {
      this.sides.left = !this.sides.left
    },
    hideRightHandler () {
      this.hideRight()
      this.$refs.main.unselect()
    },
    confirmExitHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to exit?',
        color: 'grey-9',
        cancel: true,
        ok: true
      }).onOk(() => { this.reset() })
        .onCancel(() => {})
    },
    settingsHandler () {
      this.$refs.settings.show()
    },
    saveSettings ({ limit }) {
      this.limit = limit
    },
    clearSettings () {
      this.limit = 1000
      this.clearToolboxSettings()
      document.location.reload(true)
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
              result.push('intervals')
              result.push('calcs')
              result.push('plugins')
              result.push('devices')
              result.push('streams')
              result.push('modems')
              result.push('hexViewer')
              result.push('trafficViewer')
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
      this.setToolboxSessionSettings({ region: undefined })
      this.$router.push('/login').catch(err => err)
      if (errMessage) {
        this.addError(errMessage)
      }
    },
    setEntity (entity) {
      if (this.entity !== entity) {
        this.entityInited = false
        this.entity = entity
      }
    },
    setDefaultEntity () {
      if (this.renderEntities.length) {
        this.$router.push(`/${this.config[this.renderEntities[0]].path || this.renderEntities[0]}`).catch(err => err)
        this.setEntity(this.renderEntities[0])
      } else {
        this.reset('Nothing to show by current token')
      }
    },
    routeProcess (route) {
      if (route.params.group) {
        const routeProcessIndex = Vue.connector.socket.on('connect', () => {
          const groups = this.$route.params.group.split(','),
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
        this.$router.push({ name: 'simpleLogin', params: { goto: route.path } }).catch(err => err)
      } else {
        this.routeMainProcess(route)
      }
    },
    routeParamsProcess (route) {
      const noselect = this.$route.params.noselect
      this.isNeedSelect = true
      if (noselect) {
        if (noselect !== 'all') {
          this.isNeedSelect = noselect
        } else {
          this.isNeedSelect = false
        }
      }
      this.isVisibleToolbar = !route.params.fullscreen
      this.setToolboxSessionSettings({ isNeedSelect: this.isNeedSelect, isVisibleToolbar: this.isVisibleToolbar })
      this.initConnection({ token: route.params.token })
        .then(() => {
          if (route.params.id && route.params.type) {
            const routeProcessIndex = Vue.connector.socket.on('connect', () => {
              if (this.renderEntities.includes(route.params.type)) {
                this.setEntity(this.$route.params.type)
                this.$router.push(`/${route.params.type}/${route.params.id}`).catch(err => err)
              } else {
                this.reset('Nothing to show by current token')
              }
              Vue.connector.socket.off('connect', routeProcessIndex)
            })
          }
        })
    },
    routeMainProcess (route) {
      if (route.path === '/') { // if main route
        this.setDefaultEntity()
      } else { // go to send route
        if (this.$route.meta.moduleName) {
          this.setEntity(this.$route.meta.moduleName)
          if (this.$route.meta.moduleName === this.entity) { return false }
          this.$router.push(this.$route.path).catch(err => err)
        } else {
          this.$router.push(this.$route.path).catch(err => err)
        }
      }
    },
    connectionPreserveHandler () {
      this.isInit = true
      this.connectFlag = false
    },
    updateSettingsHandler (command) {
      this.$store.commit('setToolboxSettings', command)
    },
    updateColHandler (col) {
      const actionType = col.index ? 'edit' : 'add'
      const cols = this.$store.state[this.messagesConfigByEntity.vuexModuleName].cols
      if (actionType === 'edit') {
        const renderedCol = cols[col.index]
        this.$set(renderedCol, 'display', !renderedCol.display)
      } else {
        if (cols[cols.length - 1].__dest) {
          cols.splice(-1, 0, col)
        } else {
          cols.push(col)
        }
      }
      this.$store.commit(`${this.messagesConfigByEntity.vuexModuleName}/setCols`, cols)
    },
    updateColsHandler (cols) {
      this.colsForEditing = cols
    },
    setDefaultColsHandler () {
      let moduleName = ''
      if (this.colsEditing === 'messages' || this.entity === 'intervals') {
        moduleName = this.messagesConfigByEntity.vuexModuleName
        this.$store.commit(`${moduleName}/setDefaultCols`)
      } else if (this.colsEditing === 'logs') {
        moduleName = this.configByEntity.logs.vuexModuleName
        const cols = [...this.configByEntity.logs.cols]
        if (cols[cols.length - 1].__dest !== 'etc') {
          cols.push({ name: 'etc', width: 150, display: true, __dest: 'etc' })
        }
        this.$store.commit(`${moduleName}/setCols`, cols)
      }
    }
  },
  watch: {
    token (val) {
      if (!val) {
        this.$router.push('/login').catch(err => err)
      }
    },
    $route (route) {
      this.routeProcess(route)
      if (this.$refs.layout) {
        this.hideRight()
      }
    }
  },
  beforeCreate () {
    this.$store.commit('getToolboxSettings')
    /* init global events */
    this.colsEditHandler = (type) => {
      this.currentMessage = {}
      this.colsEditing = type
      this.sides.right = true
    }
    this.$eventBus.$on('cols:edit', this.colsEditHandler)
  },
  created () {
    this.routeProcess(this.$route)
    const sessionSettings = this.sessionSettings || {}
    if (sessionSettings.isNeedSelect !== undefined) this.isNeedSelect = sessionSettings.isNeedSelect
    if (sessionSettings.isVisibleToolbar !== undefined) this.isVisibleToolbar = sessionSettings.isVisibleToolbar
    if (!this.isInit) {
      this.connectFlag = true
      this.connectionPreserveHandlerIndex = Vue.connector.socket.on('connect', this.connectionPreserveHandler)
    }
  },
  beforeDestroy () {
    this.$eventBus.$off('cols:edit', this.colsEditHandler)
    this.connectionPreserveHandlerIndex !== undefined && Vue.connector.socket.off('connect', this.connectionPreserveHandlerIndex)
  },
  components: { ObjectViewer, RawViewer, ColsEditor, Settings }
}
</script>

<style lang="stylus">
  .version
    position absolute
    left 160px
    top 3px
    font-size 0.7rem
    &--mobile
      top 2px
      left 110px
  .header__main-toolbar
    padding 1px 12px
</style>
