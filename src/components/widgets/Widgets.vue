<template>
  <widget-window
    ref="widgetWrapper"
    v-if="visible"
    :wrapper-size="wrapperSize"
    :style="{ zIndex: isFullScreen ? 5 : active ? 3 : 2 }"
    :controls="controls"
    :view-model="$q.platform.is.desktop && $q.screen.width > 500 ? viewModel : fullScreenModel"
    @close="closeHandler"
    @dragging="$emit('active')"
    @change-view-model="changeViewModelHandler"
  >
    <q-tabs :value="tabModel" @input="setTab" class="text-white" :dense="!isModified" :style="{ width: isModified ? 'calc(100% - 66px)' : $q.platform.is.mobile ? 'calc(100% - 33px)' : '', height: isModified ? '50px' : '' }" outside-arrows>
      <template v-for="(item, key) in config">
        <q-tab :name="key" :label="item.title" :key="`tab-${key}`" color="grey-9" :icon="item.titleIcon"/>
      </template>
    </q-tabs>
    <div class="bg-grey-8 scroll relative-position" :style="{ height: isModified ? 'calc(100% - 50px)' : 'calc(100% - 40px)', width: 'calc(100% - 4px)' }">
      <q-tab-panel v-for="(item, key) in config" :name="key" :key="`tab-pane-${key}`" v-show="tabModel === key">
        <div v-if="item.description">
          <div style="font-size: 1rem; width: calc(100% - 35px)" class="text-center text-bold q-mb-sm text-white" :class="[(item.item && item.item['x-flespi-color']) || (item.log && item.log['x-flespi-color'])]" v-html="item.description"></div>
          <q-btn class="absolute" style="top: 5px; right: 5px;" color="grey-1" flat dense icon="mdi-content-copy" @click="copyMessageHandler({content: item.item})">
            <q-tooltip>Copy data</q-tooltip>
          </q-btn>
          <q-btn v-if="item.descriptionAction" class="absolute" style="top: 38px; right: 5px;" :color="item.descriptionAction.color" flat dense :icon="item.descriptionAction.icon" @click="item.descriptionAction.handler({type: 'to-error-traffic', data: item.item})">
            <q-tooltip>{{item.descriptionAction.title}}</q-tooltip>
          </q-btn>
        </div>
        <component v-if="item.wrapper && typeof item.wrapper === 'object'" :is="item.wrapper" :ref="key" :item="item.item" :log="item.log" :meta="item.meta" @action="data => { item.action && item.action(data) }" :inverted="inverted"/>
        <component v-else-if="item.wrapper && typeof item.wrapper === 'string'" :is="item.wrapper" :ref="key" :class="{'text-white': inverted !== undefined}">{{item.item}}</component>
        <div v-else :class="{'text-white': inverted !== undefined}" :ref="key">{{item.item}}</div>
      </q-tab-panel>
    </div>
    <div class="widget-window__actions">
      <q-icon v-for="action in actions" :key="action.name" @click="$emit(action.name)" :name="action.icon" size="30px" class="pull-right cursor-pointer" color="white">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </div>
  </widget-window>
</template>

<script>
import WidgetWindow from './WidgetFloatWindow'
import { copyToClipboard } from 'quasar'
import get from 'lodash/get'
import routerProcess from '../../mixins/routerProcess'
export default {
  props: ['config', 'inverted', 'value', 'actions', 'active', 'controls', 'viewModel'],
  data () {
    return {
      prevTab: undefined,
      tabModel: null,
      visible: false,
      isModified: false,
      isFullScreen: false,
      wrapperSize: {},
      fullScreenModel: {
        type: 'maximized'
      }
    }
  },
  computed: {
    tabNames () { return Object.keys(this.config) }
  },
  methods: {
    ref (name) { return get(this.$refs[name], 0, undefined) },
    show () { this.visible = true },
    hide () { this.visible = false },
    setTab (name) {
      this.prevTab = undefined
      this.tabModel = name
      this.updateRoute({  query: { widget_tab: name } })
    },
    minimizeHandler (data) {
      this.isModified = !!data
    },
    maximizeHandler (flag) {
      this.isFullScreen = flag
    },
    minimize (type) {
      if (this.$refs.widgetWrapper) {
        this.$refs.widgetWrapper.minimizeHandler(type)
      }
    },
    escHandler (evt) {
      if (evt.keyCode === 27 && this.active) {
        this.closeHandler()
      }
    },
    closeHandler () {
      this.$emit('input', false)
      this.$emit('close')
      this.updateRoute({  query: { widget_tab: undefined } })
    },
    resize (size) {
      this.wrapperSize = size
    },
    changeViewModelHandler (model) {
      switch (model.type) {
        case 'minimized': {
          this.minimizeHandler({ type: model.to })
          break
        }
        case 'maximized': {
          this.maximizeHandler(true)
          break
        }
        case 'windowed': {
          this.minimizeHandler()
          this.maximizeHandler(false)
          break
        }
      }
      if (this.$q.platform.is.desktop && this.$q.screen.width > 500) {
        this.$emit('change-view-model', model)
      }
    },
    getDefaultTab () {
      let defaultTabName = this.tabNames[0]
      this.tabNames.forEach((name) => {
        if (this.config[name].default) {
          defaultTabName = name
        }
      })
      return defaultTabName
    },
    copyMessageHandler ({ index, content }) {
      copyToClipboard(JSON.stringify(content)).then((e) => {
        this.$q.notify({
          type: 'positive',
          icon: 'content_copy',
          message: 'Data copied',
          timeout: 1000
        })
      }, (e) => {
        this.$q.notify({
          type: 'negative',
          icon: 'content_copy',
          message: 'Error coping data',
          timeout: 1000
        })
      })
    }
  },
  components: { WidgetWindow },
  mixins: [routerProcess],
  watch: {
    value (value) { this.visible = value },
    config (config) {
      if (this.prevTab) {
        this.setTab(this.prevTab)
        this.prevTab = undefined
      }
      if (!config[this.tabModel]) {
        this.prevTab = this.tabModel
        this.setTab(this.getDefaultTab())
      }
    },
    viewModel (model) { this.changeViewModelHandler(model) }
  },
  created () {
    let activeTabName = this.$route.query.widget_tab || this.getDefaultTab()
    if (this.viewModel) {
      this.changeViewModelHandler(this.viewModel)
    }
    window.addEventListener('keyup', this.escHandler)
    this.setTab(activeTabName)
  },
  destroyed () {
    window.removeEventListener('keyup', this.escHandler)
  }
}
</script>

<style lang="stylus">
  .widget-window__actions
    bottom 16px
    right 16px
    z-index 999
    background rgba(100,100,100,.4)
    border-radius 5px
    position absolute
</style>
