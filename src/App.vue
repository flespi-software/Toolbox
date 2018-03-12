<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view v-if="!$store.state.offline"></router-view>
    <div v-else class="offline-page window-height window-width bg-light column items-center no-wrap">
      <div class="offline-back">
        <div class="offline-code"></div>
        <div class="offline-line">
          <span v-for="n in Array(20)">offline</span>
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
      height 100vh
      overflow hidden
      font-size 10vmax
      background-image url(./statics/corpse.png)
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
        margin 0 auto
      .offline-line
        overflow hidden
        width 160%
        transform rotate(-20deg) translate(-50%)
        background-color #ff0
        background-image url(./statics/police50.png)
        margin -30% 50%
        font-size 3rem
        & > span
          margin 10rem
          padding 0 20px
          text-transform uppercase
          font-weight bold
          color: #000
          background-color #ff0
  @media (min-width 767px) {
    .modify {
      border-right: 1px solid #ccc;
      padding-right: 30px;
    }
  }
</style>
