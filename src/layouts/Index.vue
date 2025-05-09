<template>
  <div>
    <q-layout ref="layout" view="hHh LpR lFf" class="bg-grey-9">
      <q-header v-if="isVisibleToolbar">
        <q-toolbar class="header__main-toolbar bg-grey-9">
          <q-btn flat round icon="mdi-menu" @click="toggleMenu" v-if="!dashMode"/>
          <q-toolbar-title :style="{minWidth: $q.platform.is.mobile ? '60px' : '210px'}">
            <img class="gt-sm cursor-pointer" src="toolbox50.png" alt="Toolbox" style="height: 30px" @click="goToMain">
            <img class="lt-md cursor-pointer" src="toolbox_mobile.png" alt="Toolbox" style="height: 30px" @click="goToMain">
            <sup class="version">{{version}}({{localeName}})</sup>
            <span v-if="configByEntity" style="position: relative; top: -5px; margin-left: 10px;">{{configByEntity.label}}</span>
          </q-toolbar-title>
          <q-btn v-if="errors.length" @click="clearNotificationCounter" small flat round icon="notifications">
            <q-chip v-if="newNotificationCounter" color="red" size="xs" class="absolute-top-right q-ma-none text-white">{{newNotificationCounter}}</q-chip>
            <q-menu fit ref="popoverError" no-route-dismiss>
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
          <q-btn @click="settingsHandler" small flat round icon="mdi-cog" v-if="!dashMode">
            <settings ref="settings" :limit="limit" @input="saveSettings" @clear="clearSettings" />
          </q-btn>
          <q-btn class="within-iframe-hide" @click="confirmExitHandler" small  flat round icon="mdi-exit-to-app"/>
        </q-toolbar>
      </q-header>
      <q-drawer side="left" v-model="sides.left" :content-class="{'bg-grey-7':true}" v-if="isVisibleToolbar && !dashMode">
        <left-menu :config="config" :entities="renderEntities" :entity="entity"/>
      </q-drawer>
      <q-page-container class="bg-grey-9 no-scroll">
        <router-view
          ref='main'
          v-if="configByEntity && isInit"
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
import { mapState, mapMutations, mapActions } from 'vuex'
import dist from '../../package.json'
import LeftMenu from '../components/Menu'
import Dash from '../components/Dash'
import Settings from '../components/Settings.vue'
import cloneDeep from 'lodash/cloneDeep'

export default {
  data () {
    return {
      version: dist.version,
      sides: {
        left: !this.$q.platform.within.iframe && !this.$q.platform.is.mobile,
        right: false
      },
      currentLimit: 1000,
      rawConfig: {},
      entity: '',
      isVisibleToolbar: true,
      toolboxMode: undefined,
      connectFlag: false,
      isTabsVisible: true,
      entityByGroup: [
        'platform', 'webhooks', 'realms', 'grants', 'channels',
        'devices', 'groups', 'streams', 'calcs', 'intervals',
        'geofences', 'plugins', 'hexViewer', 'trafficViewer',
        'deviceTraffic', 'streamTraffic', 'webhookTraffic',
        'pluginTraffic', 'modems', 'assets', 'containers', 'cdns',
        'mqtt', 'mqttClient'
      ],
      isNeedSelect: true,
      entityInited: false,
      isInit: Vue.connector.socket.connected()
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
    toggleMenu () {
      this.sides.left = !this.sides.left
    },
    confirmExitHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to exit?',
        color: 'grey-9',
        cancel: true,
        ok: true,
        noRouteDismiss: true
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
    getGroups (groups) {
      return groups.reduce((result, group) => {
        if (['platform', 'hub', 'storage', 'mqtt'].includes(group)) {
          switch (group) {
            case 'hub': {
              result.push('channels')
              result.push('devices')
              result.push('groups')
              result.push('streams')
              result.push('intervals')
              result.push('calcs')
              result.push('geofences')
              result.push('plugins')
              result.push('modems')
              result.push('assets')
              result.push('hexViewer')
              result.push('trafficViewer')
              result.push('deviceTraffic')
              result.push('streamTraffic')
              result.push('pluginTraffic')
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
              result.push('webhooks')
              result.push('grants')
              result.push('realms')
              result.push('webhookTraffic')
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
      const routeProcessIndex = Vue.connector.socket.on('connect', () => {
        if (route.query.group) {
          const groups = route.query.group.split(','),
            entityByGroups = this.getGroups(groups)
          if (entityByGroups.length) {
            this.entityByGroup = entityByGroups
            this.setDefaultEntity()
          }
        }
        const entity = route.meta.moduleName
        if (entity) {
          if (this.renderEntities.includes(entity)) {
            this.setEntity(entity)
          } else {
            this.reset('Nothing to show by current token')
          }
        }
        Vue.connector.socket.off('connect', routeProcessIndex)
      })
      if (route.query.token && !this.token) {
        this.initConnection({ token: route.query.token })
      } else if (!this.token) { // if not logged in
        Vue.connector.socket.off('connect', routeProcessIndex)
        this.$router.push({ name: 'simpleLogin', params: { goto: route } }).catch(err => err)
      } else {
        this.routeMainProcess(route)
      }
    },
    routeParamsProcess (route) {
      const noselect = route.query.noselect
      this.isNeedSelect = true
      if (noselect) {
        if (noselect !== 'all') {
          this.isNeedSelect = noselect
        } else {
          this.isNeedSelect = false
        }
      }
      this.isVisibleToolbar = !route.query.fullscreen
      this.toolboxMode = !route.query.mode
    },
    routeMainProcess (route) {
      if (route.path === '/') { // if main route
        this.setDefaultEntity()
      } else { // go to send route
        if (this.$route.meta.moduleName) {
          this.setEntity(this.$route.meta.moduleName)
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
    }
  },
  beforeCreate () {
    this.$store.commit('getToolboxSettings')
  },
  created () {
    this.routeParamsProcess(this.$route)
    this.routeProcess(this.$route)
    const sessionSettings = this.sessionSettings || {}
    if (sessionSettings.isNeedSelect !== undefined) this.isNeedSelect = sessionSettings.isNeedSelect
    if (sessionSettings.isVisibleToolbar !== undefined) this.isVisibleToolbar = sessionSettings.isVisibleToolbar
    if (sessionSettings.mode !== undefined) this.toolboxMode = sessionSettings.mode
    if (!this.isInit) {
      this.connectFlag = true
      this.connectionPreserveHandlerIndex = Vue.connector.socket.on('connect', this.connectionPreserveHandler)
    }
    this.setToolboxSessionSettings({ isNeedSelect: this.isNeedSelect, isVisibleToolbar: this.isVisibleToolbar, mode: this.toolboxMode })
  },
  beforeDestroy () {
    this.connectionPreserveHandlerIndex !== undefined && Vue.connector.socket.off('connect', this.connectionPreserveHandlerIndex)
  },
  components: { LeftMenu, Settings, Dash }
}
</script>

<style lang="stylus">
  .version
    vertical-align top
    font-size 0.7rem
  .header__main-toolbar
    padding 1px 12px
</style>
