<template>
  <q-page>
    <q-toolbar color="dark" class="justify-between q-py-none">
      <div style="max-width: 75%;">
        <q-btn icon="mdi-arrow-left" @click="goBack" flat class="q-mr-sm"/>
        <!-- device selector -->
        <q-item class="no-padding q-mr-sm" style="display: inline-flex; max-width: 50%" :style="{cursor: isNeedSelect && false ? '' : 'default!important'}">
          <q-item-side style="min-width: 25px;" v-if="$q.platform.is.desktop">
            <q-item-tile><q-icon color="white" name="mdi-developer-board" size="25px"/></q-item-tile>
          </q-item-side>
          <q-item-main>
            <template v-if="active">
              <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{selectedDevice.name || `#${selectedDevice.id}`}}</q-item-tile>
              <q-item-tile sublabel style="font-size: 0.8rem" v-if="selectedDevice.ident">{{selectedDevice.ident}}</q-item-tile>
            </template>
            <q-item-tile v-else label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">Select device</q-item-tile>
          </q-item-main>
          <q-item-side class="text-right">
            <q-item-tile style="display: inline-block" stamp color="white" class="text-center"><div v-if="selectedDevice.deleted" class="cheap-modifier"><small>DELETED</small></div>#{{selectedDevice.id}}</q-item-tile>
            <q-item-tile v-if="isNeedSelect && false" style="display: inline-block" stamp color="white" size="2rem" icon="mdi-menu-down" />
          </q-item-side>
          <q-popover fit ref="popoverActive" v-if="isNeedSelect && false">
            <q-input v-model="deviceFilter" color="dark" clearable placeholder="Filter" hide-underline class="q-ma-xs q-pa-xs items__filter"/>
            <q-list link separator class="scroll">
              <VirtualList
                v-if="filteredDevices.length"
                :size="55"
                :remain="filteredDevices.length + 1 > 6 ? 6 : filteredDevices.length + 1"
              >
                <q-item
                  v-for="(item, index) in filteredDevices"
                  :key="index"
                  @click.native="active = item.id, $refs.popoverActive.hide(), $emit('view-data-hide')"
                  class="cursor-pointer"
                  :class="{'text-grey-8': item.deleted}"
                  highlight
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name || `#${item.id}`}}</q-item-tile>
                    <q-item-tile sublabel><small>{{item.ident || `&lt;no ident&gt;`}}</small></q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-center">
                    <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                    <q-item-tile><small>#{{item.id}}</small></q-item-tile>
                  </q-item-side>
                </q-item>
              </VirtualList>
              <div v-else class="text-center q-ma-md">
                No devices
              </div>
            </q-list>
          </q-popover>
        </q-item>
        <!-- device selector -->
        <q-item class="no-padding q-mr-sm" style="display: inline-flex; max-width: calc(50% - 8px);">
          <q-item-side style="min-width: 25px;" v-if="$q.platform.is.desktop">
            <q-item-tile><q-icon color="white" name="mdi-calculator-variant" size="25px"/></q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}" v-if="activeCalcId && filteredCalcs.length">{{selectedCalc.name || '&lt;noname&gt;'}}</q-item-tile>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}" v-else-if="!activeCalcId && filteredCalcs.length">Select calc</q-item-tile>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}" v-else>No calcs available</q-item-tile>
          </q-item-main>
          <q-item-side class="text-right">
            <q-item-tile style="display: inline-block" stamp color="white" class="text-center"  v-if="selectedCalc.id"><div v-if="selectedCalc.deleted" class="cheap-modifier"><small>DELETED</small></div>#{{selectedCalc.id.toString()}}</q-item-tile>
            <q-item-tile style="display: inline-block" stamp color="white" size="2rem" icon="mdi-menu-down" />
          </q-item-side>
          <q-popover fit ref="popoverActive">
            <q-input v-model="calcFilter" color="dark" clearable placeholder="Filter" hide-underline class="q-ma-xs q-pa-xs items__filter"/>
            <q-list link separator class="scroll">
              <VirtualList
                v-if="filteredCalcs.length"
                :size="40"
                :remain="filteredCalcs.length + 1 > 6 ? 6 : filteredCalcs.length + 1"
              >
                <q-item
                  @click.native="clearActiveCalc(), $refs.popoverActive.hide(), $emit('view-data-hide')"
                  class="cursor-pointer text-grey"
                  highlight
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden">Select calc...</q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-right">
                    <q-icon name="mdi-close"/>
                  </q-item-side>
                </q-item>
                <q-item
                  v-for="(item, index) in filteredCalcs"
                  :key="index"
                  @click.native="setActiveCalc(item.id), $refs.popoverActive.hide(), $emit('view-data-hide')"
                  class="cursor-pointer"
                  :class="{'text-grey-8': item.deleted}"
                  highlight
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden">{{item.name || '&lt;noname&gt;'}}</q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-center">
                    <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                    <q-item-tile v-if="item.id"><small>#{{item.id.toString()}}</small></q-item-tile>
                  </q-item-side>
                </q-item>
              </VirtualList>
              <div v-else class="text-center q-ma-md">
                No calcs
              </div>
            </q-list>
          </q-popover>
        </q-item>
      </div>
      <div>
        <!-- <q-btn-toggle
          v-if="!selectedItem.deleted"
          dense
          color="grey-8"
          toggle-color="white"
          toggle-text-color="dark"
          class="q-ml-sm gt-xs" size="sm"
          v-model="ratio"
          :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'intervals', value: 0}]"
        />
        <q-btn class="lt-sm" dense size="sm">
          {{ratio === 50 ? 'both' : (ratio === 0 ? 'intervals' : 'logs')}}
          <q-popover style="background-color: transparent">
            <q-btn-toggle
              v-close-overlay
              v-if="!selectedItem.deleted"
              dense
              color="grey-8"
              toggle-color="white"
              toggle-text-color="dark"
              size="sm"
              v-model="ratio"
              :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'intervals', value: 0}]"
            />
          </q-popover>
        </q-btn> -->
      </div>
    </q-toolbar>
    <intervals
      ref="intervals"
      @view-data="viewDataHandler"
      :mode="mode"
      :activeId="activeCalcId"
      :item="selectedCalc"
      :activeDeviceId="active"
      :isEnabled="!!+size[1]"
      :limit="0"
      :config="config.intervals"
      v-if="+size[1] && active && activeCalcId && isInit"
      :style="{minHeight: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
    />
    <div v-else-if="+size[1] && active && !activeCalcId" class="text-grey text-center q-pt-lg" style="font-size: 2.5rem;" :style="{minHeight: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}">
      Select calc
    </div>
  </q-page>
</template>

<script>
import intervals from '../../components/intervals/Index.vue'
import { mapState } from 'vuex'
import VirtualList from 'vue-virtual-scroll-list'
import init from '../../mixins/entitiesInit'

export default {
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config'
  ],
  mixins: [init],
  data () {
    return {
      calcFilter: '',
      deviceFilter: '',
      mode: 1,
      active: null,
      activeCalcId: null,
      ratio: 0,
      isInit: false
    }
  },
  computed: {
    ...mapState({
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      devicesCollection (state) {
        return state.items || {}
      },
      devices (state) {
        return Object.values(state.items || {})
      },
      tasksCollection (state) {
        return state['addition.tasks'] || {}
      },
      tasks (state) {
        let tasks = Object.values(state['addition.tasks'] || {})
        return tasks
      },
      calcsCollection (state) {
        return state['addition.calcs'] || {}
      },
      calcs (state) {
        return Object.values(state['addition.calcs'] || {})
      },
      selectedDevice (state) {
        return state.items[this.active] || {}
      },
      selectedCalc (state) {
        return state['addition.calcs'] && state['addition.calcs'][this.activeCalcId] ? state['addition.calcs'][this.activeCalcId] : {}
      }
    }),
    filteredDevices () {
      let devices = this.devices
      // let devicesIdsByTasks = this.tasks.map(task => task.device_id)
      // devices = devices.filter(device => devicesIdsByTasks.includes(device.id))
      // if (this.active) {
      //   devices = devices.filter(item => this.tasks.some(task => this.active === task.calc_id && item.id === task.device_id))
      // }
      return devices // this.filterItems(devices, this.deviceFilter.toLowerCase())
    },
    filteredCalcs () {
      let calcs = this.calcs
      calcs = calcs.filter(item => this.tasks.some(task => this.active === task.device_id && item.id === task.calc_id))
      if (this.isInit && this.active && this.activeCalcId && !this.tasks.filter(task => task.device_id === this.active && task.calc_id === this.activeCalcId).length) {
        this.$nextTick(() => { this.clearActiveCalc() })
      }
      return this.filterItems(calcs, this.calcFilter.toLowerCase())
    },
    size () {
      return [this.ratio, 100 - this.ratio]
    }
  },
  methods: {
    filterItems (items, filter) {
      let filteredItems = filter ? items.filter(item => {
        return (
          item &&
          typeof item.name !== 'undefined' &&
          item.name !== null &&
          item.name.toLowerCase().indexOf(filter) >= 0
        ) ||
        (
          item &&
          typeof item.id !== 'undefined' &&
          item.id !== null &&
          (item.id + '').indexOf(filter) >= 0
        )
      }) : items
      filteredItems.sort((l, r) => {
        if (!l.name) { return -1 }
        if (!r.name) { return 1 }
        let lName = l.name.toLowerCase()
        let rName = r.name.toLowerCase()
        if (lName < rName) {
          return -1
        } else if (lName > rName) {
          return 1
        }
        return 1
      })
      return filteredItems
    },
    viewDataHandler (content) {
      this.$emit('view-data', content)
    },
    unselect () {
      this.$refs.intervals.unselect()
    },
    setActive (id) {
      this.active = id
    },
    setActiveCalc (id) {
      this.activeCalcId = id
    },
    clearActive () {
      this.setActive(null)
    },
    clearActiveCalc () {
      this.setActiveCalc(null)
    },
    goBack () {
      this.$router.push(`/devices/${this.active}`)
    },
    init () {
      let deviceIdFromRoute = this.$route.params && this.$route.params.id ? Number(this.$route.params.id) : null,
        calcIdFromRoute = this.$route.params && this.$route.params.calcId ? Number(this.$route.params.calcId) : null
      this.isInit = true
      if (deviceIdFromRoute) {
        this.setActive(deviceIdFromRoute)
        if (calcIdFromRoute && this.calcsCollection[calcIdFromRoute]) {
          this.activeCalcId = calcIdFromRoute
        }
      }
    }
  },
  watch: {
    ratio (val) {
      this.$nextTick(() => {
        if (+this.size[0] && this.active) {
          // this.$refs.logs.resetParams()
          this.$emit('view-data-hide')
        }
        if (+this.size[1] && this.active && this.activeCalcId) {
          this.$refs.intervals.resetParams()
        }
      })
    },
    $route (route) {
      if (
        route.params && route.params.id && Number(route.params.id) === this.active &&
        route.params.calcId && this.activeCalcId === Number(route.params.calcId)
      ) { return false }
      if (route.params && route.params.id) {
        let deviceId = Number(route.params.id)
        if (this.devicesCollection[deviceId]) {
          if (deviceId !== this.active) {
            this.setActive(deviceId)
          }
          let calcId = Number(route.params.calcId)
          if (route.params && route.params.calcId && this.calcsCollection[calcId]) {
            this.activeCalcId = calcId
          }
        } else if (this.isInit) {
          this.clearActive()
        }
      } else if (route.params && !route.params.id) {
        this.clearActive()
      }
    },
    active (id, old) {
      if (id) {
        this.$router.push(`/devices/${id}/calc/${this.activeCalcId || 'null'}/intervals`)
      } else {
        this.$router.push('/devices')
      }
    },
    activeCalcId (activeCalcId) {
      if (activeCalcId) {
        this.$router.push(`/devices/${this.active}/calc/${activeCalcId}/intervals`)
      }
    }
  },
  components: { intervals, VirtualList }
}
</script>
<style lang="stylus">
  @import '~variables'
  .items__filter {
    min-width: 250px;
    border: 1px solid $dark;
    border-radius: 3px;
  }
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
  .cheap-modifier {
    font-size: .7rem;
    font-weight: bolder;
    border-radius: 3px;
    background-color: #90a4ae;
    color: white;
    padding: 0 3px;
    margin-bottom: 3px;
  }
  .deleted-action {
    width: 100%;
    color: #999;
    background-color: #eee;
    font-size: .7rem;
    padding-top: 0;
    padding-bottom: 0
  }
</style>
