<template>
  <widget-window
    ref="widgetWrapper"
    v-if="visible"
    :wrapper-size="wrapperSize"
    :style="{ zIndex: isFullScreen ? 5 : active ? 3 : 2 }"
    :controls="controls"
    :view-model="$q.platform.is.desktop && $q.screen.width > 500 ? viewModel : fullScreenModel"
    @close="$emit('input', false), $emit('close')"
    @dragging="$emit('active')"
    @change-view-model="changeViewModelHandler"
  >
    <q-tabs v-model="tabModel" @input="prevTab = undefined" class="text-white" :dense="!isModified" :style="{ width: isModified ? 'calc(100% - 66px)' : $q.platform.is.mobile ? 'calc(100% - 33px)' : '', height: isModified ? '50px' : '' }" outside-arrows>
      <template v-for="(item, key) in config">
        <q-tab :name="key" :label="item.title" :key="`tab-${key}`" color="grey-9" :icon="item.titleIcon"/>
      </template>
    </q-tabs>
    <div class="bg-grey-8 scroll relative-position" :style="{ height: isModified ? 'calc(100% - 50px)' : 'calc(100% - 40px)', width: 'calc(100% - 4px)' }">
      <q-tab-panel v-for="(item, key) in config" :name="key" :key="`tab-pane-${key}`" v-show="tabModel === key">
        <div style="font-size: 1rem" class="text-center text-bold q-mb-sm text-white" :class="[item.data._color]" v-if="item.description" v-html="item.description"></div>
        <component v-if="item.wrapper && typeof item.wrapper === 'object'" :is="item.wrapper" :ref="key" :data="item.data && getData(item.data)" :meta="item.meta" @action="data => { item.action && item.action(data) }" :inverted="inverted"/>
        <component v-else-if="item.wrapper && typeof item.wrapper === 'string'" :is="item.wrapper" :ref="key" :class="{'text-white': inverted !== undefined}">{{getData(item.data)}}</component>
        <div v-else :class="{'text-white': inverted !== undefined}" :ref="key">{{getData(item.data)}}</div>
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
import get from 'lodash/get'
export default {
  props: ['config', 'inverted', 'value', 'actions', 'active', 'controls', 'viewModel'],
  data () {
    return {
      prevTab: undefined,
      tabModel: Object.keys(this.config)[0],
      visible: false,
      isModified: false,
      isFullScreen: false,
      wrapperSize: {},
      fullScreenModel: {
        type: 'maximized'
      }
    }
  },
  methods: {
    getData (data) {
      if (typeof data === 'string') {
        return data
      } else {
        return Object.keys(data).reduce((result, key) => {
          if (key === '_description' || key === '_color') { return result }
          result[key] = data[key]
          return result
        }, {})
      }
    },
    ref (name) { return get(this.$refs[name], 0, undefined) },
    show () { this.visible = true },
    hide () { this.visible = false },
    setTab (name) { this.tabModel = name },
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
        this.$emit('input', false)
        this.$emit('close')
      }
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
    }
  },
  components: { WidgetWindow },
  watch: {
    value (value) { this.visible = value },
    config (config) {
      if (this.prevTab) {
        this.setTab(this.prevTab)
        this.prevTab = undefined
      }
      if (!config[this.tabModel]) {
        this.prevTab = this.tabModel
        this.tabModel = Object.keys(config)[0]
      }
    },
    viewModel (model) { this.changeViewModelHandler(model) }
  },
  created () {
    if (this.viewModel) {
      this.changeViewModelHandler(this.viewModel)
    }
    window.addEventListener('keyup', this.escHandler)
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
