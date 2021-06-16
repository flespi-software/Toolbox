<template>
   <q-page padding class="dash">
     <q-list class="row absolute-top-left absolute-bottom-right">
       <q-item v-for="(model, moduleName) in renderEntities" :key="moduleName" :to='model.route' class="dash__element col-1 col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-12 bg-grey-8" :class="{'dash__element--mobile': $q.platform.is.mobile}" active-class="bg-grey-9">
        <q-item-section class="text-center text-white full-width q-ma-lg">
          <div>
            <q-icon :name="model.icon" :color="model.color" size="7em"/>
          </div>
          <div class="text-h5 ellipsis full-width">{{model.label}}</div>
        </q-item-section>
      </q-item>
     </q-list>
   </q-page>
</template>

<script>
export default {
  props: ['config', 'entities'],
  data () {
    return {
      routes: {
        platform: '/platform',
        channels: '/channels',
        devices: '/devices',
        streams: '/streams',
        modems: '/modems',
        calcs: '/calcs',
        plugins: '/plugins',
        hexViewer: '/tools/hex',
        trafficViewer: '/tools/traffic',
        containers: '/containers',
        cdns: '/cdns',
        mqtt: '/mqtt',
        mqttClient: '/tools/mqtt'
      }
    }
  },
  computed: {
    renderEntities () {
      return this.entities.filter(name => this.routes[name]).map(name => ({
        route: this.routes[name],
        label: this.config[name].label,
        icon: this.config[name].icon,
        color: name === 'platform' ? 'red-6' : undefined
      }))
    }
  }
}
</script>

<style lang="stylus">
  .dash
    width 100%
    height 100%
    overflow auto
    background-image url(../../public/mountain.svg)
    background-position center 100px
    background-size contain
    background-repeat no-repeat
    &__element
      max-height 33%
      min-height 200px
      &--mobile
        opacity .9
      &:hover
        opacity .9
      opacity .6
</style>
