<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view></router-view>
    <offline logo="../statics/toolbox.png"/>
  </div>
</template>

<script>
/*
 * Root component
 */
import Offline from './components/Offline'
export default {
  components: { Offline }
}
</script>

<style lang="stylus">
  @import '~variables'
  .with-modal
    overflow hidden !important
    padding-right 0 !important
</style>
