<template>
  <div class="login-page window-height window-width bg-light column items-center no-wrap">
    <a v-if="!$q.platform.is.mobile || $q.platform.within.iframe" href="https://github.com/flespi-software/Toolbox/" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0; width: 149px; height: 149px;" src="../statics/right-graphite@2x.png" alt="Fork me on GitHub"></a>
    <div class="login-back flex items-center justify-center">
      <div class="login-code flex items-center justify-center"></div>
    </div>
    <div v-if="!$route.params.token">
      <div v-if="!canLogin || $q.platform.within.iframe" class="login-card shadow-4 bg-white column items-center justify-center no-wrap">
        <div class="row full-width">
          <div class="col-12 text-center text-red text-bold">
            <big>Token has been expired or revoked</big>
          </div>
        </div>
      </div>
      <div v-else class="login-card shadow-4 bg-white column items-center justify-center no-wrap">
        <p class="text-center">Swiss knife to view and analyze flespi data</p>
        <div class="row full-width">
          <div class="col-12 text-center">
            <q-btn @click="openWindow(`${$flespiServer}/login/#/providers`)" icon="mdi-account-circle" color="red-7" rounded label="login / register" size="lg"/>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="login-card shadow-4 bg-white column items-center justify-center no-wrap">
        <q-progress indeterminate color="positive" style="width: 100%; height: 45px" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      token: '',
      icons: {
        facebook: 'mdi-facebook-box',
        google: 'mdi-google-plus-box',
        live: 'mdi-windows',
        github: 'mdi-github-box',
        email: 'mdi-at'
      },
      canLogin: true
    }
  },
  computed: {
    model: {
      get () {
        return this.token
      },
      set (val) {
        this.token = val
      }
    },
    tokenInfo () {
      return this.$store.state.tokenInfo
    }
  },
  methods: {
    ...mapMutations(['setToken']),
    goto (to) {
      if (this.tokenInfo) {
        this.$router.push(to)
      } else {
        let connectEventIndex, errorEventIndex,
          eventHandler = () => {
            this.$router.push(to)
            connectEventIndex && Vue.connector.socket.on('connect', connectEventIndex)
            errorEventIndex && Vue.connector.socket.on('error', errorEventIndex)
          }
        connectEventIndex = Vue.connector.socket.on('connect', eventHandler)
        errorEventIndex = Vue.connector.socket.on('error', eventHandler)
      }
    },
    logIn () {
      this.setToken(this.token)
      this.$nextTick(() => {
        if (this.$route.params && this.$route.params.goto) {
          this.goto(this.$route.params.goto)
        } else {
          this.goto('/')
        }
      })
    },
    autoLogin () {
      this.setToken(this.$route.params.token)
      this.goto('/')
    },
    checkHasToken () {
      let sessionStorageToken = this.$q.sessionStorage.get.item('toolbox-token')
      if (this.$route.params && this.$route.params.token) {
        this.autoLogin()
      } else if (sessionStorageToken) {
        this.token = sessionStorageToken
        this.logIn()
      }
    },
    openWindow (url, title) {
      title = title || 'auth'
      let w = 500, h = 600
      let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
      let dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

      let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
      let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

      let left = ((width / 2) - (w / 2)) + dualScreenLeft
      let top = ((height / 2) - (h / 2)) + dualScreenTop
      let newWindow = window.open(url, title, 'toolbar=no,location=no,status=yes,resizable=yes,scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

      // Puts focus on the newWindow
      if (window.focus) {
        newWindow.focus()
      }
    }
  },
  watch: {
    $route (val) {
      if (val.params && val.params.token) {
        this.autoLogin()
      }
    }
  },
  created () {
    let sessionSettings = this.$q.sessionStorage.get.item('toolbox-session-settings')
    if (sessionSettings) {
      this.canLogin = sessionSettings.isVisibleToolbar
    }
    let tokenHandler = (event) => {
      if (typeof event.data === 'string' && ~event.data.indexOf('FlespiToken')) {
        this.token = event.data
        this.logIn()
        window.removeEventListener('message', tokenHandler)
      }
    }
    window.addEventListener('message', tokenHandler)
    this.checkHasToken()
  }
}
</script>

<style lang="stylus">
  .row__wrapper
    height 80px
  .login-page
    .login-back
      width 100%
      height 50vh
      overflow hidden
      padding-top 15vh
      font-size 10vmax
      background-image url(../statics/mountain.svg)
      background-position center 100px
      background-size contain
      background-repeat no-repeat
      background-color #333
      color rgba(255,255,255,0.7)
      .login-code
        height 50vh
        width: 80vw;
        max-width: 600px;
        background-image url(../statics/toolbox.png)
        background-position center
        background-size contain
        background-repeat no-repeat
    .login-card
      border-radius 2px
      margin-top -50px
      width 80vw
      max-width 600px
      padding 25px
      > i
        font-size 5rem
</style>
