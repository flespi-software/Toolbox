<template>
  <q-dialog class="modal-date" :maximized="$q.platform.is.mobile" @show="openHandler" @hide="tabModel = ''" ref="modal">
    <q-card :style="{minWidth: $q.platform.is.mobile ? '100%' : '30vw', height: $q.platform.is.mobile ? '100%' : '60vh'}" :class="{'bg-grey-9': inverted !== undefined}">
      <q-card-section :style="{height: 'calc(100% - 54px)'}" class="q-pa-none">
        <template v-if="hasData">
          <q-tabs v-model="tabModel" class="text-white">
            <template v-for="(item, key) in config">
              <template v-if="item.data">
                <q-tab :name="key" :label="item.title" :key="`tab-${key}`" color="grey-9"/>
              </template>
            </template>
          </q-tabs>
          <q-tab-panels v-model="tabModel" class="bg-grey-9 scroll" style="height: calc(100% - 48px)">
            <q-tab-panel v-for="(item, key) in config" :name="key" :key="`tab-pane-${key}`">
              <template v-if="item.data">
                <div style="font-size: 1.1rem" class="text-center q-mb-sm text-white" :class="[item.data._color]" v-if="item.description">{{item.description}}</div>
                <component v-if="item.wrapper && typeof item.wrapper === 'object'" :is="item.wrapper" :data="getData(item.data)" :inverted="inverted"/>
                <component v-else-if="item.wrapper && typeof item.wrapper === 'string'" :is="item.wrapper" :class="{'text-white': inverted !== undefined}">{{getData(item.data)}}</component>
                <div v-else :class="{'text-white': inverted !== undefined}">{{getData(item.data)}}</div>
              </template>
            </q-tab-panel>
          </q-tab-panels>
        </template>
        <div v-else class="text-center" style="font-size: 2rem; margin-top: 50px" :class="{'text-white': inverted !== undefined}">No additional data available</div>
      </q-card-section>
      <q-separator color="white"/>
      <q-card-actions align="right" class="bg-grey-9 text-white">
        <q-btn flat @click="$refs.modal.hide()">Close</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: [
    'config',
    'inverted'
  ],
  data () {
    return {
      tabModel: ''
    }
  },
  computed: {
    hasData () {
      return Object.keys(this.config).reduce((res, key) => {
        if (this.config[key].data) {
          res = true
        }
        return res
      }, false)
    }
  },
  methods: {
    open () {
      this.$refs.modal.show()
    },
    openHandler () {
      let index = 0
      const hasData = Object.keys(this.config).some((element, elementIndex) => {
        index = elementIndex
        return !!this.config[element].data
      })
      this.tabModel = hasData ? Object.keys(this.config)[index] : Object.keys(this.config)[0] ? Object.keys(this.config)[index] : ''
    },
    getData (obj) {
      return Object.keys(obj).reduce((result, key) => {
        if (key === '_description' || key === '_color') { return result }
        result[key] = obj[key]
        return result
      }, {})
    }
  }
}
</script>

<style lang="stylus">
</style>
