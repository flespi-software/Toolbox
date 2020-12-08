<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view></router-view>
    <offline/>
  </div>
</template>

<script>
/*
 * Root component
 */
import Offline from './components/Offline'
export default {
  name: 'App',
  components: { Offline }
}
</script>

<style lang="stylus">
  .with-modal
    overflow hidden !important
    padding-right 0 !important
</style>
