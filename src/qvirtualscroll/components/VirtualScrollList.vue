<template>
  <div class="message-viewer full-height" :class="{[`uid${uid}`]: true}" @contextmenu.prevent.stop @select.prevent.stop>
    <q-toolbar class="viewer__toolbar" v-if="needShowToolbar" :class="{[`bg-${currentTheme.bgColor}`]: true, 'text-white': !!currentTheme.bgColor}">
      <span v-if="title && $q.platform.is.desktop" style="margin-right: 10px">{{title}}</span>
      <q-icon :color="currentTheme.color" name="search" @click="showSearch = true"
        v-if="$q.platform.is.mobile && currentViewConfig.needShowFilter && !showSearch"
        :style="{fontSize: '24px', marginBottom: currentTheme.controlsInverted ? '' : '8px', paddingLeft: currentTheme.controlsInverted ? '8px' : ''}"
      />
      <q-input
        :class="{'full-width': $q.platform.is.desktop || showSearch, collapsed: $q.platform.is.mobile && !showSearch}" outlined hide-bottom-space dense
        @focus="showSearch = true" clearable
        :autofocus="$q.platform.is.mobile"
        @blur="searchBlurHandler"
        v-if="currentViewConfig.needShowFilter && ((showSearch && $q.platform.is.mobile) || $q.platform.is.desktop)"
        @keyup.enter="searchSubmitHandler"
        type="text" v-model="currentFilter"
        @clear="searchSubmitHandler"
        :dark="currentTheme.controlsInverted"
        :color="currentTheme.controlsInverted ? 'grey-8' : currentTheme.color"
        :bg-color="currentFilter && currentFilter === filter ? 'green-5' : undefined"
        :placeholder="currentViewConfig.filterPlaceholder"
        :debounce="0"
      >
        <template #prepend>
          <q-btn :color="currentTheme.color" icon="mdi-magnify" @click="searchSubmitHandler" flat round dense/>
        </template>
        <template #append>
          <slot name="filter-append"/>
        </template>
      </q-input>
      <q-toolbar-title/>
      <date-range-modal
        v-if="currentViewConfig.needShowDateRange && ((!showSearch && $q.platform.is.mobile) || $q.platform.is.desktop)"
        class="on-left"
        :date="dateRange"
        :theme="currentTheme"
        @save="dateRangeModalSave"
      />
      <slot name="after-datetime"/>
      <q-btn icon="mdi-dots-vertical" :loading="hasAsyncPanelActions" flat dense round :disable="!items.length">
        <template #loading>
          <q-icon size="1.5rem" name="mdi-dots-vertical"/>
          <q-spinner class="absolute-bottom-right" color="white" size=".7rem" />
        </template>
        <q-menu ref="tableMenu" no-route-dismiss>
          <q-list dark class="bg-grey-7 q-py-xs" style="min-width: 180px; max-width: 500px">
            <template v-for="(action, index) in panelActions" :key="index">
              <q-item v-close-popup v-if="action.condition" class="q-px-sm" clickable @click="action.handler" dense v-ripple>
                <q-item-section avatar class="q-pr-sm" style="min-width: 20px">
                  <q-icon :name="action.icon" />
                </q-item-section>
                <q-item-section>{{action.label}}</q-item-section>
                <q-item-section side v-if="action.async">
                  <q-spinner color="white" size="1rem" />
                </q-item-section>
                <q-tooltip v-if="action.tooltip">{{action.tooltip}}</q-tooltip>
              </q-item>
            </template>
            <q-separator v-if="panelActions.length"/>
            <q-item clickable dense v-ripple @click="colAddingHandler" class="q-px-sm" v-close-popup>
              <q-item-section avatar class="q-pr-sm" style="min-width: 20px">
                <q-icon name="mdi-playlist-plus" />
              </q-item-section>
              <q-item-section>Add column</q-item-section>
            </q-item>
            <q-separator/>
            <q-item-label header class="q-pa-none q-pl-xs q-pt-xs" style="font-size: .8rem">Columns presets</q-item-label>
            <q-item
              clickable v-ripple dense class="q-px-sm schema-item" :active="activeSchema === name" active-class="schema--active"
              v-close-popup @click="customSchemaApply(name)" v-for="(schema, name) in listedSchemas" :key="name"
            >
                <div @click.stop.prevent class="absolute-botom-right absolute-top-left full-height full-width" style="z-index: 1;padding-top: 3px;background-color: rgba(0,0,0,0.5);" v-if="prevDeleteSchemaName === name">
                  <q-btn class="q-mx-sm" color="red" label="delete" dense @click.stop="colsSchemaRemoveHandler(name)"/>
                  <q-btn color="grey" label="cancel" dense @click.stop="closePreventRemoveSchema"/>
                </div>
                <q-item-section avatar class="q-pr-sm" style="min-width: 32px">
                  <q-icon v-if="name === '_default'" name="mdi-playlist-star" />
                  <q-icon v-else-if="name === '_protocol'" name="mdi-playlist-check" />
                  <q-icon v-else-if="name === '_unsaved'" name="mdi-playlist-edit" />
                  <q-icon v-else name="mdi-table-large" />
                </q-item-section>
                <q-item-section>
                  <template v-if="name === '_default'">{{(i18n && i18n['Default columns']) || 'Default columns'}}</template>
                  <template v-else-if="name === '_protocol'">{{(i18n && i18n['Columns by schema']) || 'Columns by schema'}}</template>
                  <template v-else-if="name === '_unsaved'">{{(i18n && i18n['Modified (unsaved)']) || 'Modified (unsaved)'}}</template>
                  <template v-else>{{schema.name}}</template>
                </q-item-section>
                <q-item-section avatar v-if="activeSchema !== name && name !== '_default' && name !== '_protocol'">
                  <q-btn icon="mdi-close" color="white" flat round dense @click.stop="prevDeleteSchemaName = name"/>
                </q-item-section>
            </q-item>
            <q-separator/>
            <q-item clickable dense v-ripple @click="colsSchemaAddingHandler" :disable="!colsSchemaEdited" active-class="schema--active" class="q-px-sm" v-close-popup>
              <q-item-section avatar class="q-pr-sm" style="min-width: 20px">
                <q-icon name="mdi-table-plus" />
              </q-item-section>
              <q-item-section>Save preset</q-item-section>
              <q-tooltip v-if="!colsSchemaEdited">Configure columns schema first, then save</q-tooltip>
              <q-tooltip v-else>Save current columns schema</q-tooltip>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <div ref="wrapper" class="list-wrapper" :class="{'bg-grey-9': currentTheme.contentInverted}" :style="{height: needShowToolbar ? 'calc(100% - 50px)' : '100%'}">
      <q-resize-observer @resize="wrapperResizeHandler"/>
      <div :class="[`bg-${currentTheme.controlsInverted ? 'grey-8' : 'white'}`]" class="absolute-top-right rounded-borders" style="z-index: 2; right: 20px;">
        <q-input
          v-model="newSchemaName" v-if="colsSchemaAdd" autofocus
          label="Preset name" outlined hide-bottom-space dense
          :dark="currentTheme.controlsInverted"
          :color="!!cols.schemas[newSchemaName] ? 'yellow' : newSchemaName.indexOf('_') === 0 ? 'red-4' : currentTheme.controlsInverted ? 'white' : currentTheme.color"
          @keyup.enter="() => { if (newSchemaName && newSchemaName.indexOf('_') !== 0) {colsSchemaAddingDoneHandler()} }"
          @keyup.esc="colsSchemaAddingCloseHandler()"
          :bottom-slots="!!cols.schemas[newSchemaName] || !newSchemaName"
        >
          <q-btn
            :color="currentTheme.controlsInverted ? 'white' : currentTheme.color" icon="mdi-content-save-outline"
            dense flat @click="colsSchemaAddingDoneHandler" :disable="(!newSchemaName || newSchemaName.indexOf('_') === 0)"
          />
          <q-btn
            :color="currentTheme.controlsInverted ? 'white' : currentTheme.color" icon="mdi-close"
            dense flat @click="colsSchemaAddingCloseHandler()"
          />
          <template #hint>
            <div :class="{'text-yellow': !!cols.schemas[newSchemaName]}">
              {{ !!cols.schemas[newSchemaName] ? 'Your schema will be owerwritten or change name' : 'Name the preset to save it' }}
            </div>
          </template>
        </q-input>
      </div>
      <q-btn
        v-if="(currentScrollTop + itemHeight) < allScrollTop && items.length"
        fab-mini flat icon="mdi-chevron-down"
        @click="$emit('action-to-bottom')"
        class="absolute-bottom-right action action__to-bottom" style="z-index: 2"
        :class="{ 'bg-white': currentTheme.contentInverted, 'text-grey-9': currentTheme.contentInverted }"
        :style="{right: colsAddition ? '270px' : ''}"
      >
        <q-tooltip>To bottom</q-tooltip>
      </q-btn>
      <q-chip
        v-if="hasNewMessages"
        removable clickable
        @remove="$emit('action-to-new-messages-hide')"
        @click="$emit('action-to-new-messages')"
        icon="mdi-bell-outline"
        class="absolute-bottom-right action action__to-new-messages"
        color="amber-8"
        text-color="grey-2" style="z-index: 2"
      >
        new messages
      </q-chip>
      <slot name="empty" v-if="!items.length && !loading">
        <div class="no-messages text-center" :class="{'text-grey-6': currentTheme.contentInverted}" style="font-size: 3rem; padding-top: 40px;">
          {{(i18n && i18n['Messages not found']) || 'Messages not found'}}
        </div>
      </slot>
      <div v-else-if="!items.length && loading && itemsCount > 0"
        :style="{height: `${wrapperHeight + headerHeight - 0.5}px`, overflow: 'auto'}"
        :class="{'bg-grey-9': currentTheme.contentInverted, 'text-white': currentTheme.contentInverted}"
        class="absolute-top-left absolute-bottom-right"
      >
        <div class="list__header" :class="[`text-${currentTheme.color}`, `bg-${currentTheme.header}`]"
          v-if="(items.length || loading) && currentTheme.headerShow" :style="{height: `${headerHeight}px`, width: colsAddition ? 'calc(100% - 250px)' : '100%'}" ref="header"
        >
          <div class="header__inner" :style="{ width: `${rowWidth}px` }">
            <template v-for="(prop, index) in activeCols" :key="prop.name">
              <div class="header__item" :class="{[`item_${index}`]: true}">
                <span class="item__label">
                  {{colsEnum[prop.name] && colsEnum[prop.name].title || prop.name}}
                  <span v-if="colsEnum[prop.name] && colsEnum[prop.name].addition">({{colsEnum[prop.name].addition}})</span>
                  <span v-if="colsEnum[prop.name] && colsEnum[prop.name].unit" style="font-size: .8rem" class="text-grey-4">, {{colsEnum[prop.name].unit}}</span>
                </span>
              </div>
            </template>
          </div>
        </div>
        <table-skeleton v-for="(i, key) in new Array(itemsCount - 1).fill('')" :key="key" :rows="rowWidths"/>
      </div>
      <div v-else class="full-height">
        <q-menu
          ref="menu" v-if="items.length && !loading"
          context-menu touch-position
          no-route-dismiss
          @before-show="menuShow"
          @before-hide="menuHide"
        >
          <slot name="context-menu" :col="editableCol" :row="editableRow">
            <cols-menu
              :col="editableCol"
              :row="editableRow"
              @add="colsAddition = true, addingRow = editableRow"
              @remove="toggleCol"
              @action="(type) => clickHandler({ index: editableRow.index, type, content: editableRow.data })"
            />
          </slot>
        </q-menu>
        <div class="list__header" :class="[`text-${currentTheme.color}`, `bg-${currentTheme.header}`]"
          v-if="(items.length || loading) && currentTheme.headerShow && activeCols.length" :style="{height: '100%', width: colsAddition ? 'calc(100% - 250px)' : '100%'}" ref="header"
        >
          <div class="header__inner" :style="{width: `${rowWidth + 10}px` }">
            <draggable :list="activeCols" ghost-class="ghost" tag="span" item-key="name" @end="endDragHandler" :move="moveDragHandler">
              <template #item="{ element: prop, index }">
                <div class="header__item"
                  :class="{[`item_${index}`]: true}" style="cursor: move"
                >
                  <q-tooltip v-if="colsEnum[prop.name] && (colsEnum[prop.name].description || colsEnum[prop.name].title)">
                    {{`${prop.name}: ${colsEnum[prop.name].description ? colsEnum[prop.name].description : ''}`}}
                  </q-tooltip>
                  <span class="item__label">
                    {{colsEnum[prop.name] && colsEnum[prop.name].title || prop.name}}
                    <span v-if="colsEnum[prop.name] && colsEnum[prop.name].addition">
                      ({{colsEnum[prop.name].addition}})
                    </span>
                    <span v-if="colsEnum[prop.name] && colsEnum[prop.name].unit" style="font-size: .8rem" class="text-grey-4">
                      , {{colsEnum[prop.name].unit}}
                    </span>
                  </span>
                  <vue-draggable-resizable
                    class="absolute-top-left"
                    v-if="$q.platform.is.desktop && needResizeControl"
                    :active="true" :draggable="false" :handles="['mr']" :w="prop.width" :prevent-deactivation="true"
                    :h="(itemHeight * itemsCount) + headerHeight" :min-width="50" :z='1'
                    @resizing="() => { resizing = true }"
                    @resize-stop="(left, top, width) => {onResize(width, index), updateCols(), resizing = false}"
                  />
                </div>
              </template>
            </draggable>
          </div>
        </div>
        <virtual-list
          ref="scroller"
          v-if="activeCols.length"
          tabindex="1"
          :style="{height: `${wrapperHeight}px`, overflow: 'auto', top: `${headerHeight}px`, zIndex: resizing ? '' : 1, right: colsAddition ? '250px' : ''}"
          class="list__content absolute-top-left absolute-bottom-right"
          :class="{'bg-grey-9': currentTheme.contentInverted, 'text-white': currentTheme.contentInverted, 'cursor-pointer': hasItemClickHandler}"
          wclass="q-w-list"
          v-auto-bottom="needAutoScroll"
          :onscroll="listScrollWrapper"
          :size="itemHeight"
          :remain="itemsCount"
          :item="item"
          :itemcount="items.length"
          :itemprops="getItemProps"
        />
        <div
          v-else
          :style="{height: `${wrapperHeight - 0.5}px`, overflow: 'auto', top: `${headerHeight}px`, zIndex: resizing ? '' : 1, right: colsAddition ? '250px' : ''}"
          class="list__content absolute-top-left absolute-bottom-right text-center"
          :class="{'bg-grey-9': currentTheme.contentInverted, 'text-white': currentTheme.contentInverted, 'cursor-pointer': hasItemClickHandler}"
        >
          <div :class="$q.platform.is.mobile ? ['text-h5 q-mt-sm'] : ['text-h4 q-mt-xl']" class='text-grey-5'>No columns to show.</div>
          <div :class="$q.platform.is.mobile ? ['text-h7'] : ['text-h6']" class='text-grey-6'>Configure your custom columns:<q-btn flat dense round color="white" icon="mdi-dots-vertical" @click="$refs.tableMenu.show()"/></div>
        </div>
        <cols-additing
          v-if="colsAddition"
          style="width: 250px"
          class="absolute-bottom-right absolute-top-right"
          :cols="additionCols"
          @add="addCustomColumnHandler"
          @done="colsAddition = false, addingRow = undefined"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VirtualList from './VirtualList'
import { uid, scroll } from 'quasar'
import VueDraggableResizable from 'vue-draggable-resizable'
import DateRangeModal from './DateRangeModal.vue'
import ListItem from './ListItem.vue'
import TableSkeleton from './TableSkeleton.vue'
import ColsMenu from './ColsMenu.vue'
import ColsAdditing from './ColsAdditing.vue'
import draggable from 'vuedraggable'
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import appLogger from 'src/infrastructure/appLogger'

/* Quasar 2 split the helper into a vertical and a horizontal one */
const { setVerticalScrollPosition: setScrollPosition } = scroll

export default {
  name: 'VirtualScrollList',
  emits: [
    'action',
    'action-to-bottom',
    'action-to-new-messages',
    'action-to-new-messages-hide',
    'arrowup',
    'arrowdown',
    'change-date-range',
    'change-filter',
    'scroll',
    'scroll-top',
    'scroll-bottom',
    'update-cols'
  ],
  props: {
    name: {
      type: String,
      default: () => 'VirtualScrollList'
    },
    item: {
      type: Object,
      default: () => ListItem
    },
    itemprops: {
      type: Function,
      default: () => () => {}
    },
    items: {
      type: Array,
      required: true,
      default () { return [] }
    },
    i18n: {
      type: Object
    },
    cols: {
      type: Object,
      required: true,
      default () {
        return {
          activeSchema: '_init',
          schemas: {
            _init: {
              name: '_init',
              cols: []
            }
          },
          enum: {}
        }
      }
    },
    actions: {
      type: Array,
      required: true
    },
    panelActions: {
      type: Array,
      default () { return [] }
    },
    dateRange: {
      type: Array
    },
    filter: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    autoscroll: {
      type: Boolean,
      default: false
    },
    itemHeight: {
      type: Number,
      default: 19
    },
    theme: Object,
    viewConfig: Object,
    loading: Boolean,
    scrollOffset: [Number, String],
    hasNewMessages: [Object, Boolean],
  },
  components: { draggable, VirtualList, VueDraggableResizable, TableSkeleton, DateRangeModal, ColsMenu, ColsAdditing },
  data () {
    const defaultConfig = {
      needShowFilter: false,
      filterPlaceholder: 'position.speed<=5 || (plugin.geofence.name=="storage" && ble.sensor.temperature.1 > 10)',
      needShowDateRange: false,
      needKeysProcess: false
    }
    const localCols = cloneDeep(this.cols)
    const firstSchemaName = localCols.schemas[this.cols.activeSchema] ? this.cols.activeSchema : '_default'
    /* a broken schema in the storage must not take the whole list down — fall back to no columns */
    const firstSchema = localCols.schemas[firstSchemaName] || {}
    return {
      localCols,
      uid: 0,
      currentFilter: this.filter,
      wrapperHeight: 0,
      wrapperWidth: 0,
      itemsCount: 0,
      defaultItemWidth: 150,
      headerHeight: this.itemHeight + 5,
      dynamicCSS: document.createElement('style'),
      showSearch: false,
      needAutoScroll: false,
      autoscrollEnabled: this.autoscroll,
      defaultTheme: {
        color: 'grey-9',
        bgColor: 'white',
        controlsInverted: false,
        contentInverted: false,
        headerShow: true
      },
      activeCols: cloneDeep(firstSchema.cols || []),
      defaultConfig: defaultConfig,
      hasItemClickHandler: false,
      currentScrollTop: 0,
      currentViewConfig: Object.assign({}, defaultConfig, this.viewConfig),
      needResizeControl: true,
      allScrollTop: 0,
      resizing: false,
      editableCol: null,
      addingRow: undefined,
      editableRow: null,
      colsAddition: false,
      menuModel: false,
      colsSchemaAdd: false,
      /* no default name: it used to be the word the unsaved state is labelled with, so presets kept
       * being saved as a second Modified nobody could tell from the first */
      newSchemaName: '',
      prevDeleteSchemaName: undefined,
      logger: appLogger.extendName(this.name)
    }
  },
  computed: {
    activeSchema () {
      const schemaName = this.cols.activeSchema
      if (!this.cols.schemas[schemaName]) {
        this.customSchemaApply('_default')
        return '_default'
      }
      return this.cols.activeSchema
    },
    /*
     * `_unsaved` is not a preset but the current, not yet saved state of the columns — it belongs in
     * the list only while it is the one in use, otherwise it reads as a second preset named Modified.
     */
    listedSchemas () {
      const schemas = this.cols.schemas
      if (this.activeSchema === '_unsaved') { return schemas }
      return Object.keys(schemas).reduce((res, name) => {
        if (name !== '_unsaved') { res[name] = schemas[name] }
        return res
      }, {})
    },
    colsEnum () {
      return this.cols.enum
    },
    hasAsyncPanelActions () {
      return !!this.panelActions.filter(action => action.async).length
    },
    colsSchemaEdited () { return this.activeSchema === '_unsaved' },
    unsavedColsSchema () {
      return this.cols.schemas._unsaved || {}
    },
    isSystemSchema () {
      return this.activeSchema === '_default' || this.activeSchema === '_protocol'
    },
    needShowToolbar () {
      return this.currentViewConfig.needShowFilter || this.currentViewConfig.needShowDateRange
    },
    currentTheme () {
      /* the Vue 2 build merged into `defaultTheme` itself, quietly overwriting the defaults */
      const theme = Object.assign({}, this.defaultTheme, this.theme)
      theme.header = `${theme.bgColor.split('-')[0]}-8`
      return theme
    },
    rowWidth () {
      let res = 0
      res += this.rowWidths.reduce((acc, width) => acc + width, 0)
      return res
    },
    wrapperOverflowing () {
      return this.wrapperWidth < this.rowWidth
    },
    rowWidths () {
      const widths = []
      this.activeCols.forEach((col) => {
        widths.push(col.width)
      })
      return widths
    },
    additionCols () {
      const activeColsNames = this.activeCols.map(col => col.name)
      let cols = Object.values(this.cols.enum).reduce((res, col) => {
        if (activeColsNames.includes(col.name)) {
          res.existed[col.name] = true
        } else {
          res.notExisted[col.name] = true
        }
        return res
      }, { existed: {}, notExisted: {} })
      if (this.addingRow) {
        const params = Object.keys(this.addingRow.data)
        params.forEach((param) => {
          if (!cols.existed[param] && !cols.notExisted[param]) {
            cols.notExisted[param] = true
          }
        })
      }
      cols = Object.keys(cols.notExisted)
      return cols
    }
  },
  methods: {
    getItemProps (index) {
      const active = this.editableRow && this.editableCol ? { col: this.editableCol.index, row: this.editableRow.index } : null
      const props = {
        key: index,
        props: {
          item: this.items[index],
          index: index,
          actions: this.actions,
          cols: this.activeCols,
          itemHeight: this.itemHeight,
          rowWidth: this.rowWidth,
          menuCellActive: active
        },
        attrs: {
          'data-index': index
        }
      }
      this.itemprops(index, props)
      return props
    },
    searchSubmitHandler () {
      this.$emit('change-filter', this.currentFilter)
    },
    searchClearHandler () {
      this.currentFilter = ''
      this.searchSubmitHandler()
    },
    searchBlurHandler () {
      this.searchSubmitHandler()
      this.showSearch = false
    },
    openSearch () {
      this.showSearch = true
    },
    clickHandler ({ index, type, content }) {
      this.$emit('action', { index, type, content })
    },
    itemClickHandler ({ index, content }) {
      this.$emit('item-click', { index, content })
    },
    resetParams () {
      const wrapper = this.$refs.wrapper
      if (!wrapper) {
        return false
      }
      this.wrapperHeight = wrapper.offsetHeight - this.headerHeight // - header
      this.wrapperWidth = wrapper.offsetWidth
      this.itemsCount = Math.ceil(this.wrapperHeight / this.itemHeight)
      const scrollerElement = get(this.$refs, 'scroller.$el', undefined)
      if (scrollerElement) {
        setScrollPosition(scrollerElement, scrollerElement.scrollTop + 1)
        this.logger.info(`[reset] Scroll ${JSON.stringify({scrollTop: scrollerElement.scrollTop, offsetAll: scrollerElement.scrollHeight})}`)
      }
    },
    wrapperResizeHandler () {
      this.resetParams()
    },
    onResize (width, index) {
      if (typeof index === 'number') {
        this.activeCols[index].width = width
        this.localCols.schemas[this.activeSchema].cols[index].width = width
        this.updateCols()
      }
      this.updateDynamicCSS()
    },
    scrollNormalize () {
      const scrollerElement = get(this.$refs, 'scroller.$el', undefined)
      if (!scrollerElement) { return }
      const offsetAll = scrollerElement.scrollHeight - scrollerElement.clientHeight,
        offset = scrollerElement.scrollTop
      if (offsetAll < this.allScrollTop) {
        if (this.needAutoScroll) {
          this.currentScrollTop = offset
          this.allScrollTop = offsetAll
        } else {
          const prevScrollPosition = offsetAll - (this.allScrollTop - offsetAll) - (this.allScrollTop - this.currentScrollTop)
          this.currentScrollTop = prevScrollPosition >= 0 ? prevScrollPosition : 0
          this.allScrollTop = offsetAll
          setScrollPosition(scrollerElement, this.currentScrollTop)
          this.logger.info(`[normalize] Scroll ${JSON.stringify({scrollTop: this.currentScrollTop, offsetAll: scrollerElement.scrollHeight})}`)
        }
      } else {
        this.allScrollTop = offsetAll
      }
    },
    getScrollDirection (offset) {
      let verticalDirection = null
      if (offset > this.currentScrollTop) {
        verticalDirection = 'bottom'
      } else if (offset < this.currentScrollTop) {
        verticalDirection = 'top'
      } else {
        verticalDirection = 'none'
      }
      return verticalDirection
    },
    listScrollWrapper (e, data) {
      this.scrollNormalize()
      window.requestAnimationFrame(() => {
        this.listScroll(e, data)
      })
    },
    listScroll (e, data) {
      const { offset } = data
      const scrollerElement = get(this.$refs, 'scroller.$el', undefined)
      if (!scrollerElement) { return }
      const offsetAll = scrollerElement.scrollHeight - scrollerElement.clientHeight
      if (!this.currentScrollTop) {
        this.currentScrollTop = offset
      }
      const verticalDirection = this.getScrollDirection(offset)
      let scrollOffset = this.scrollOffset ? typeof this.scrollOffset === 'number' ? this.scrollOffset : (offsetAll * this.scrollOffset.replace('%', '') / 100) : 0
      if (scrollOffset && scrollOffset < 36) { scrollOffset = 0 }
      if (this.items.length) {
        /* horizontal scroll logic start */
        const wrapper = this.$refs.wrapper
        if (wrapper) {
          wrapper.querySelector('.list__header').scrollLeft = e.target.scrollLeft
        }
        /* horizontal scroll logic end */
        if (offset < this.currentScrollTop && this.needAutoScroll) {
          this.needAutoScroll = false
        } else if (!this.needAutoScroll && this.autoscrollEnabled && offset >= this.allScrollTop) {
          this.needAutoScroll = true
        }
      }
      this.$emit('scroll', { event: e, data })
      this.logger.info(`ScrollEvent ${JSON.stringify({...data, scrollTop: scrollerElement.scrollTop, offsetAll})}`)
      if (scrollOffset) {
        if (verticalDirection && (verticalDirection === 'top' || verticalDirection === 'none') && offset < scrollOffset) {
          this.$emit('scroll-top')
        } else if (verticalDirection && (verticalDirection === 'bottom' || verticalDirection === 'none') && offset + scrollOffset >= offsetAll) {
          this.$emit('scroll-bottom')
        }
      } else {
        if (verticalDirection && verticalDirection === 'top' && offset === 0) {
          this.$emit('scroll-top')
        } else if (verticalDirection && verticalDirection === 'bottom' && offset >= offsetAll) {
          this.$emit('scroll-bottom')
        }
      }
      this.currentScrollTop = offset
      this.tableFocus()
    },
    tableFocus () {
      const delta = get(this.$refs, 'scroller.delta')
      if (delta && delta.total > delta.keeps) {
        const scrollingElement = get(this.$refs, 'scroller.$el')
        if (scrollingElement && (document.activeElement === scrollingElement || scrollingElement.contains(document.activeElement))) {
          this.$nextTick(() => { scrollingElement.focus() })
        }
      }
    },
    enableAutoscroll () {
      this.autoscrollEnabled = true
      this.needAutoScroll = true
    },
    disableAutoscroll () {
      this.autoscrollEnabled = false
      this.needAutoScroll = false
    },
    getDynamicCSS () {
      let result = ''
      result += this.activeCols.reduce((acc, col, index) => {
        acc += `.uid${this.uid} .item_${index} { width: ${col.width}px }`
        return acc
      }, '')
      return result
    },
    updateDynamicCSS () {
      this.dynamicCSS.type = 'text/css'
      const head = document.head || document.getElementsByTagName('head')[0]
      if (this.dynamicCSS.styleSheet) {
        this.dynamicCSS.styleSheet.cssText = this.getDynamicCSS()
      } else {
        this.dynamicCSS.innerText = this.getDynamicCSS()
      }
      head.appendChild(this.dynamicCSS)
    },
    dateRangeModalSave (dateRange) {
      this.$emit('change-date-range', dateRange)
    },
    scrollTo (index) {
      const scrollerElement = get(this.$refs, 'scroller.$el', undefined)
      if (typeof index !== 'number' || index < 0 || !scrollerElement) { return }
      let height = index * this.itemHeight
      if (index > this.items.length - this.itemsCount) { height = scrollerElement.scrollHeight }
      setScrollPosition(scrollerElement, height)
      this.logger.info(`[scrollTo] Scroll ${JSON.stringify({scrollTop: height, offsetAll: scrollerElement.scrollHeight, index})}`)
    },
    scrollToWithSavePadding (index) {
      const scrollerElement = get(this.$refs, 'scroller.$el', undefined)
      if (typeof index !== 'number' || index < 0 || !scrollerElement) { return }
      if (index > this.items.length - this.itemsCount) { index = this.items.length - this.itemsCount }
      const height = index * this.itemHeight
      setScrollPosition(scrollerElement, height + this.currentScrollTop)
      this.logger.info(`[scrollToWithSavePadding] Scroll ${JSON.stringify({scrollTop: height + this.currentScrollTop, offsetAll: scrollerElement.scrollHeight, index})}`)
    },
    updateScrollState () {
      if (!this.items.length) {
        this.currentScrollTop = 0
      } else {
        const scrollerElement = get(this.$refs, 'scroller.$el', undefined)
        if (this.needAutoScroll && scrollerElement) {
          setScrollPosition(scrollerElement, scrollerElement.scrollHeight)
          this.logger.info(`[updateScrollState] Scroll ${JSON.stringify({scrollTop: scrollerElement.scrollHeight, offsetAll: scrollerElement.scrollHeight})}`)
        }
      }
      this.scrollNormalize()
    },
    menuShow (evt) {
      const el = evt.target.closest('[class*="item_"]')
      const colIndex = el ? el.className.replace(/.*item_(\d+).*/, '$1') : ''
      this.editableCol = colIndex ? {
        index: Number(colIndex),
        data: this.activeCols[colIndex]
      } : null
      const rowEl = el ? el.closest('[data-index]') : null
      if (rowEl) {
        const rowIndex = Number(rowEl.getAttribute('data-index'))
        const rowData = this.getItemProps(rowIndex)
        const rowContent = Object.keys(rowData.props.item).reduce((result, key) => {
          if (key.indexOf('x-flespi') === 0) {
            return result
          }
          result[key] = rowData.props.item[key]
          return result
        }, {})
        this.editableRow = {
          index: rowIndex,
          data: rowContent,
          actions: rowData.props.actions,
          dataHandler: rowData.dataHandler
        }
      }
    },
    menuHide (evt) {
      this.editableCol = null
      this.editableRow = null
    },
    addCustomColumnHandler (colName) {
      const existingCol = this.localCols.enum[colName]
      const scrollEl = this.$refs.scroller && this.$refs.scroller.$el
      let scrollWidth = 0
      const lastCol = this.activeCols[this.activeCols.length - 1] || { name: '', width: 0 }
      const lastColSchema = this.localCols.enum[lastCol.name] || {}
      if (!existingCol) {
        this.localCols.enum[colName] = { name: colName, custom: true }
      }
      if (lastColSchema.__dest === 'etc') {
        this.activeCols.splice(this.activeCols.length - 2, 0, { name: colName, width: 150 })
        this.localCols.schemas[this.activeSchema].cols.splice(this.activeCols.length - 2, 0, { name: colName, width: 150 })
        if (scrollEl) { scrollWidth = scrollEl.scrollWidth - lastCol.width }
      } else {
        this.activeCols.push({ name: colName, width: 150 })
        this.localCols.schemas[this.activeSchema].cols.push({ name: colName, width: 150 })
        if (scrollEl) { scrollWidth = scrollEl.scrollWidth }
      }
      if (scrollWidth && scrollEl) {
        this.$nextTick(() => { scrollEl.scrollLeft = scrollWidth - (this.wrapperWidth / 2) })
      }
      this.updateCols()
    },
    removeCustomColumnHandler (colName) {
      const index = this.activeCols.findIndex(col => col.name === colName)
      if (index !== -1) {
        this.activeCols.splice(index, 1)
        this.localCols.schemas[this.activeSchema].cols.splice(index, 1)
        this.updateCols()
      }
    },
    removeCol () {
      delete this.localCols.enum[this.editableCol.data.name]
      this.updateCols()
    },
    toggleCol () {
      if (!this.editableCol) { return }
      const col = this.editableCol.data
      const colEnum = this.localCols.enum[col.name]
      if (colEnum && colEnum.custom) {
        this.removeCol()
      }
      this.activeCols.splice(this.editableCol.index, 1)
      this.localCols.schemas[this.activeSchema].cols.splice(this.editableCol.index, 1)
      this.updateCols()
    },
    updateCols () {
      this.$emit('update-cols', this.localCols)
    },
    moveDragHandler: debounce(function (evt, oevt) {
      const wrapperWidth = this.wrapperWidth
      const el = this.$refs.scroller.$el
      const { left, right } = evt.relatedRect
      const borderValue = 50
      let changeWidthPerTick = 0
      if (right - wrapperWidth + borderValue > 0) {
        changeWidthPerTick = (wrapperWidth / 2) / 20
      } else if (el.scrollLeft - left < borderValue) {
        changeWidthPerTick = -((wrapperWidth / 2) / 20)
      }
      if (changeWidthPerTick) {
        let counter = 0
        this.scrollHorizontalInterval = setInterval(() => {
          el.scrollLeft += changeWidthPerTick
          counter++
          if (counter === 10) { clearInterval(this.scrollHorizontalInterval) }
        }, 10)
      }
    }, 300),
    endDragHandler () {
      this.localCols.schemas[this.activeSchema].cols = cloneDeep(this.activeCols)
      this.updateCols()
    },
    colAddingHandler () {
      this.colsAddition = true
    },
    colsSchemaAddingHandler () {
      this.newSchemaName = ''
      setTimeout(() => { this.colsSchemaAdd = true }, 100)
    },
    colsSchemaAddingCloseHandler () {
      this.colsSchemaAdd = false
      this.newSchemaName = ''
    },
    colsSchemaAddingDoneHandler () {
      const colSchema = {
        name: this.newSchemaName,
        cols: cloneDeep(this.activeCols)
      }
      this.localCols.schemas[colSchema.name] = colSchema
      this.localCols.activeSchema = colSchema.name
      this.colsSchemaAddingCloseHandler()
      /* `localCols` is what updateCols sends out — dropping it from the `cols` prop is undone right back */
      delete this.localCols.schemas._unsaved
      this.updateCols()
    },
    setUnsavedSchema (cols) {
      const colSchema = {
        name: 'Modified',
        cols: cols
      }
      this.localCols.schemas._unsaved = colSchema
      this.localCols.activeSchema = '_unsaved'
      this.updateCols()
    },
    colsSchemaRemoveHandler (name) {
      setTimeout(() => {
        /* the preset has to go from `localCols`: `cols` is overwritten by what updateCols sends out */
        delete this.localCols.schemas[name]
        if (this.localCols.activeSchema === name) { this.localCols.activeSchema = '_default' }
        this.updateCols()
        this.setPreventRemoveSchema(undefined)
      }, 200)
    },
    setPreventRemoveSchema (name) {
      this.prevDeleteSchemaName = name
    },
    closePreventRemoveSchema () {
      setTimeout(() => { this.prevDeleteSchemaName = undefined }, 200)
    },
    customSchemaApply (name) {
      this.localCols.activeSchema = name
      /* leaving the unsaved state behind discards it — otherwise it stays in the list for good */
      if (name !== '_unsaved') { delete this.localCols.schemas._unsaved }
      this.updateCols()
    },
    keysProcess (event) {
      const scrollingElement = get(this.$refs, 'scroller.$el')
      if (scrollingElement && (document.activeElement === scrollingElement || scrollingElement.contains(document.activeElement))) {
        if (this.viewConfig.needKeysProcess) {
          this.keyArrowNavigation(event)
        }
      }
    },
    keyArrowNavigation (event) {
      const keyUpCode = 38
      const keyDownCode = 40
      const scrollingElement = get(this.$refs, 'scroller.$el')
      if (event.which === keyUpCode) {
        event.preventDefault();
        this.$emit('arrowup')
        setScrollPosition(scrollingElement, scrollingElement.scrollTop - this.itemHeight)
      } else if (event.which === keyDownCode) {
        event.preventDefault();
        this.$emit('arrowdown')
        setScrollPosition(scrollingElement, scrollingElement.scrollTop + this.itemHeight)
      }
    }
  },
  watch: {
    filter (val) {
      if (this.currentFilter !== val) {
        this.currentFilter = val
      }
    },
    activeCols: {
      deep: true,
      handler (cols, oldCols) {
        if (cols === oldCols) {
          if (this.cols.activeSchema !== '_unsaved') {
            this.setUnsavedSchema(cloneDeep(cols))
          }
        }
        this.updateDynamicCSS()
        this.needResizeControl = false
        this.$nextTick(() => {
          this.needResizeControl = true
        })
      }
    },
    cols (cols, oldCols) {
      if (cols !== oldCols) {
        this.activeCols = cloneDeep(cols.schemas[this.activeSchema].cols)
      }
      this.localCols = cloneDeep(cols)
    },
    'cols.activeSchema' (schema, oldSchema) {
      if (schema !== oldSchema && this.cols.schemas[schema]) {
        this.activeCols = cloneDeep(this.cols.schemas[schema].cols)
      }
    },
    viewConfig: {
      deep: true,
      handler (config) {
        this.currentViewConfig = Object.assign({}, this.defaultConfig, config)
      }
    },
    autoscroll (flag, prev) {
      if (flag !== prev) {
        flag ? this.enableAutoscroll() : this.disableAutoscroll()
      }
    }
  },
  created () {
    document.addEventListener('keydown', this.keysProcess, false)
  },
  mounted () {
    const fullWidth = this.$refs.wrapper.offsetWidth
    if (this.rowWidth < fullWidth && this.activeCols && this.activeCols.length) {
      this.activeCols[this.activeCols.length - 1].width = fullWidth - (this.rowWidth - 150)
    }
    this.hasItemClickHandler = !!this.$attrs.onItemClick
    this.uid = uid().split('-')[0]
    this.resetParams()
    this.updateDynamicCSS()
    this.updateScrollState()
  },
  beforeUpdate () {
    const scrollerElement = get(this.$refs, 'scroller', undefined)
    scrollerElement && scrollerElement.forceRender()
  },
  updated () {
    this.updateScrollState()
  },
  unmounted () {
    document.removeEventListener('keydown', this.keysProcess)
    const head = document.head || document.getElementsByTagName('head')[0]
    head.removeChild(this.dynamicCSS)
  },
  directives: {
    'auto-bottom': {
      mounted: (el, { value, instance }) => {
        if (value) {
          setScrollPosition(el, el.scrollHeight)
          instance.logger.info(`[auto-bottom-inserted] Scroll ${JSON.stringify({scrollTop: el.scrollHeight, offsetAll: el.scrollHeight})}`)
        }
      },
      updated: (el, { value, instance }) => {
        if (value) {
          setScrollPosition(el, el.scrollHeight)
          instance.logger.info(`[auto-bottom-componentUpdated] Scroll ${JSON.stringify({scrollTop: el.scrollHeight, offsetAll: el.scrollHeight})}`)
        }
      }
    }
  }
}
</script>

<style lang="scss">
  body.mobile {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
  }
  .message-viewer {
    .viewer__toolbar {
      .on-right {
        margin-left: 0;
      }
    }
    .list-wrapper {
      position: relative;
      .list__header {
        display: block;
        overflow: hidden;
        width: 100%;
        position: relative;
        .header__inner {
          position: absolute;
          white-space: nowrap;
          .header__item {
            display: inline-block;
            white-space: nowrap;
            position: relative;
            border-right: 2px solid $grey-6;
            .item__label {
              text-overflow: ellipsis;
              overflow: hidden;
              display: block;
              padding-left: 5px;
              line-height: 24px;
            }
            .handle-mr {
              position: absolute;
              width: 5px;
              font-size: 1px;
              background: $grey-3;
              right: 0px;
              cursor: e-resize;
              top: 0;
              height: 100%;
              margin-top: 0;
              border: none;
              border-right: 2px solid $grey-6;
              background-color: inherit;
            }
            .resizing .handle-mr {
              border-right: 2px solid $yellow-6;
              z-index: 2;
            }
          }
        }
      }
    }
    .collapsed {
      max-width: 40px;
    }
    .q-w-list {
      & > * {
        display: block;
        white-space: nowrap;
        &:nth-child(odd) {
          background-color: rgba(0, 0, 0, .2);
        }
      }
    }
  }
  .cols-editor__col[draggable="true"] {
    background-color: $grey-5;
  }
  .action {
    opacity: .8;
    z-index: 1;
    &:hover {
      opacity: 1;
    }
    &__to-bottom {
      right: 18px;
      bottom: 18px;
    }
    &__to-new-messages {
      right: calc(50% - 76px);
      bottom: 18px;
    }
  }
  .ghost {
    opacity: 0.5;
    color: $grey-7;
    background: $grey-3;
  }
  .schema-item {
    min-height: 38px;
  }
  .schema--active {
    background-color: $grey-6;
    color: white;
  }
  .list__content {
    outline: none;
  }
</style>
