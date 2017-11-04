<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view></router-view>
  </div>
</template>

<script>
/*
 * Root component
 */
export default {}
</script>

<style lang="stylus">
  @import '~variables'
  .with-modal
    overflow hidden !important
    padding-right 0 !important
</style>
