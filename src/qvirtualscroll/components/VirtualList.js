/*
 * A Vue 3 stand-in for `vue-virtual-scroll-list` v1.4.6, which never left Vue 2.
 *
 * Only the shapes the app actually uses are kept — fixed row height, own scroll container, and both
 * ways of handing rows over: the `item` component with `itemprops` that the list uses, and the plain
 * default slot with a v-for inside that the traffic viewers use —
 * and the scroll/zone arithmetic is the original one, so `scrollTo` and the scroll thresholds behave
 * exactly as before. The `itemprops` callback still hands back Vue 2 vnode data (`props`, `attrs`,
 * `class`, `on`, `key`); it is translated into Vue 3 props here rather than at the ~40 call sites.
 */
import { h, Fragment } from 'vue'

function camelize (name) {
  return name.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}

/* `{ on: { 'item-click': fn } }` is how Vue 2 spelled what Vue 3 calls `onItemClick` */
function toVue3Props (data) {
  const props = { ...(data.props || {}), ...(data.attrs || {}) }
  if (data.key !== undefined) { props.key = data.key }
  if (data.class !== undefined) { props.class = data.class }
  if (data.style !== undefined) { props.style = data.style }
  const on = data.on || {}
  Object.keys(on).forEach(name => {
    const camel = camelize(name)
    props[`on${camel.charAt(0).toUpperCase()}${camel.slice(1)}`] = on[name]
  })
  return props
}

export default {
  name: 'VirtualList',

  props: {
    size: { type: Number, required: true },
    remain: { type: Number, required: true },
    wclass: { type: String, default: '' },
    onscroll: { type: [Function, Boolean], default: false },
    item: { type: [Function, Object], default: null },
    itemcount: { type: Number, default: 0 },
    itemprops: { type: Function, default: () => ({}) }
  },

  watch: {
    size () { this.changeProp = 'size' },
    remain () { this.changeProp = 'remain' },
    itemcount () {
      this.changeProp = 'itemcount'
      this.forceRender()
    }
  },

  created () {
    const keeps = this.remain * 2
    this.changeProp = ''
    this.delta = {
      direction: '', // current scroll direction, D: down, U: up.
      scrollTop: 0, // current scroll top, use to direction.
      start: 0, // start index.
      end: keeps - 1, // end index.
      keeps, // nums keeping in real dom.
      total: 0, // all items count, update in filter.
      offsetAll: 0, // cache all the scrollable offset.
      paddingTop: 0, // container wrapper real padding-top.
      paddingBottom: 0 // container wrapper real padding-bottom.
    }
  },

  // check if delta should update when props change.
  beforeUpdate () {
    const delta = this.delta
    delta.keeps = this.remain * 2

    const calcstart = delta.start
    const zone = this.getZone(calcstart)

    if (this.changeProp && ['size'].includes(this.changeProp)) {
      const scrollTop = zone.isLast && (delta.total - calcstart <= this.remain)
        ? delta.total * this.size
        : calcstart * this.size
      this.$nextTick(() => this.setScrollTop(scrollTop))
    }

    // if points out difference, force update once again.
    if (this.changeProp || delta.end !== zone.end || calcstart !== zone.start) {
      this.changeProp = ''
      delta.end = zone.end
      delta.start = zone.start
      this.forceRender()
    }
  },

  methods: {
    onScroll (event) {
      const delta = this.delta
      const offset = (this.$el && this.$el.scrollTop) || 0

      delta.direction = offset > delta.scrollTop ? 'D' : 'U'
      delta.scrollTop = offset

      if (delta.total > delta.keeps) {
        this.updateZone(offset)
      } else {
        delta.end = delta.total - 1
      }

      if (this.onscroll) {
        this.onscroll(event, {
          offset,
          offsetAll: delta.offsetAll,
          start: delta.start,
          end: delta.end
        })
      }
    },

    // update render zone by scroll offset.
    updateZone (offset) {
      const delta = this.delta
      let overs = Math.floor(offset / this.size)

      // if scroll up, we'd better decrease it's numbers.
      if (delta.direction === 'U') {
        overs = overs - this.remain + 1
      }

      const zone = this.getZone(overs)
      const bench = this.remain

      // for better performance, if scroll passes items within the bench, do not update.
      // and if it's close to the last item, render next zone immediately.
      const shouldRenderNextZone = Math.abs(overs - delta.start - bench) === 1
      if (
        !shouldRenderNextZone &&
        (overs - delta.start <= bench) &&
        !zone.isLast && (overs > delta.start)
      ) {
        return
      }

      if (shouldRenderNextZone || zone.start !== delta.start || zone.end !== delta.end) {
        delta.end = zone.end
        delta.start = zone.start
        this.forceRender()
      }
    },

    // return the right zone info based on `start/index`.
    getZone (index) {
      let start, end
      const delta = this.delta

      index = parseInt(index, 10)
      index = Math.max(0, index)

      const lastStart = delta.total - delta.keeps
      const isLast = (index <= delta.total && index >= lastStart) || (index > delta.total)

      if (isLast) {
        start = Math.max(0, lastStart)
      } else {
        start = index
      }
      end = start + delta.keeps - 1
      if (delta.total && end > delta.total) {
        end = delta.total - 1
      }

      return { end, start, isLast }
    },

    // public method, force render ui list if needed.
    forceRender () {
      window.requestAnimationFrame(() => {
        this.$forceUpdate()
      })
    },

    // set manual scroll top.
    setScrollTop (scrollTop) {
      if (this.$el) { this.$el.scrollTop = scrollTop }
    },

    /* a v-for inside a slot arrives as a single Fragment */
    slotRows () {
      const rows = []
      const collect = (nodes) => {
        for (const node of nodes || []) {
          if (node && node.type === Fragment && Array.isArray(node.children)) {
            collect(node.children)
          } else if (node) {
            rows.push(node)
          }
        }
      }
      collect(this.$slots.default ? this.$slots.default() : [])
      return rows
    },

    // filter the shown items based on `start` and `end`.
    filter () {
      const delta = this.delta
      const rows = this.item ? null : this.slotRows()

      delta.total = this.item ? this.itemcount : rows.length
      if (delta.keeps > delta.total) {
        delta.end = delta.total - 1
      }

      const hasPadding = delta.total > delta.keeps
      const allHeight = this.size * delta.total
      let paddingTop = this.size * (hasPadding ? delta.start : 0)
      let paddingBottom = this.size * (hasPadding ? delta.total - delta.keeps : 0) - paddingTop

      if (paddingBottom < this.size) {
        paddingBottom = 0
      }

      delta.paddingTop = paddingTop
      delta.paddingBottom = paddingBottom
      delta.offsetAll = allHeight - this.size * this.remain

      const renders = []
      for (let i = delta.start; i < delta.total && i <= Math.ceil(delta.end); i++) {
        renders.push(this.item ? h(this.item, toVue3Props(this.itemprops(i))) : rows[i])
      }
      return renders
    }
  },

  render () {
    const list = this.filter()
    const { paddingTop, paddingBottom } = this.delta

    const renderList = h('div', {
      style: {
        display: 'block',
        'padding-top': `${paddingTop}px`,
        'padding-bottom': `${paddingBottom}px`
      },
      class: this.wclass,
      role: 'group'
    }, list)

    return h('div', {
      style: {
        display: 'block',
        'overflow-y': this.size >= this.remain ? 'auto' : 'initial',
        height: `${this.size * this.remain}px`
      },
      onScrollPassive: this.onScroll
    }, [renderList])
  }
}
