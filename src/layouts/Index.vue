<template>
  <div>
    <q-layout ref="layout" view="hHh LpR lFf" class="bg-grey-9">
      <q-header v-if="isVisibleToolbar">
        <q-toolbar class="header__main-toolbar bg-grey-9">
          <q-btn flat icon="mdi-menu" @click="toggleMenu" v-if="!dashMode"/>
          <q-toolbar-title :style="{minWidth: $q.platform.is.mobile ? '60px' : '210px'}">
            <img class="gt-sm cursor-pointer" src="statics/toolbox50.png" alt="Toolbox" style="height: 30px" @click="goToMain">
            <img class="lt-md cursor-pointer" src="statics/toolbox_mobile.png" alt="Toolbox" style="height: 30px" @click="goToMain">
            <sup class="version">{{version}}({{localeName}})</sup>
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
          <q-btn @click="settingsHandler" small flat round icon="mdi-settings" v-if="!dashMode">
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
      <q-drawer side="left" v-model="sides.left" :content-class="{'bg-grey-7':true}" v-if="isVisibleToolbar && !dashMode">
        <left-menu :config="config" :entities="renderEntities" :entity="entity"/>
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
        <dash v-if="!entity" :config="config" :entities="renderEntities"/>
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
import LeftMenu from '../components/Menu'
import Dash from '../components/Dash'
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
      entityByGroup: ['platform', 'channels', 'devices', 'streams', 'calcs', 'intervals', 'plugins', 'hexViewer', 'trafficViewer', 'modems', 'containers', 'cdns', 'mqtt', 'mqttClient'],
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
    },
    dashMode () { return !this.entity }
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
        if (['platform', 'hub', 'storage', 'mqtt'].includes(group)) {
          switch (group) {
            case 'hub': {
              result.push('channels')
              result.push('devices')
              result.push('streams')
              result.push('intervals')
              result.push('calcs')
              result.push('plugins')
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
        this.$router.push('/').catch(err => err)
        this.setEntity('')
        this.entityInited = true
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
    },
    goToMain () { this.$router.push('/').catch(err => err) }
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
  components: { LeftMenu, ObjectViewer, RawViewer, ColsEditor, Settings, Dash }
}
</script>

<style lang="stylus">
  .version
    vertical-align top
    font-size 0.7rem
  .header__main-toolbar
    padding 1px 12px
</style>
