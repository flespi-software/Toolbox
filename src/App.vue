<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view v-if="!$store.state.offline"></router-view>
    <div v-else class="offline-page window-height window-width bg-light column items-center no-wrap">
      <div class="offline-back flex items-center justify-center">
        <div class="offline-code flex items-center justify-center"></div>
      </div>
      <div class="offline-card shadow-4 bg-white">
        <div class="column items-center justify-center no-wrap text-grey-6 uppercase" style="font-size: 10vmax;">
          Offline
        </div>
        <q-progress indeterminate color="grey-6" style="width: 100%; height: 3px" />
        <div class="text-center text-grey-6 uppercase">
          waiting for reconnection
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
 * Root component
 */
import { QProgress } from 'quasar-framework'

export default {
  data () {
    return {
      intervalId: 0
    }
  },
  created () {
    this.intervalId = setInterval(() => { this.$store.dispatch('checkConnection') }, 5000)
  },
  components: {
    QProgress
  }
}
</script>

<style lang="stylus">
  @import '~variables'
  .with-modal
    overflow hidden !important
    padding-right 0 !important
  .offline-page
    .offline-back
      width 100%
      height 50vh
      overflow hidden
      padding-top 15vh
      font-size 10vmax
      background-image url(./statics/mountain.svg)
      background-position center 100px
      background-size contain
      background-repeat no-repeat
      background-color #333
      color rgba(255,255,255,0.7)
      .offline-code
        height 50vh
        width: 80vw;
        max-width: 600px;
        background-image url(./statics/toolbox.png)
        background-position center
        background-size contain
        background-repeat no-repeat
    .offline-card
      border-radius 2px
      margin-top -50px
      width 80vw
      max-width 600px
      padding 25px
      > i
        font-size 5rem
  @media (min-width 767px) {
    .modify {
      border-right: 1px solid #ccc;
      padding-right: 30px;
    }
  }
</style>
