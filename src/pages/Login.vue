<template>
  <div class="login-page window-height window-width bg-light column items-center no-wrap">
    <a v-if="!$q.platform.is.mobile || !$q.platform.within.iframe" href="https://github.com/flespi-software/Toolbox/" target="_blank"><img class="absolute-top-right" style="border: 0; width: 149px; height: 149px;" src="../statics/right-graphite@2x.png" alt="Fork me on GitHub"></a>
    <div class="login-back flex items-center justify-center">
      <div class="login-code flex justify-center">
        <img style="max-width: 80vw; max-height: 50vh;" :style="{ maxHeight: $q.platform.is.mobile ? '80px' : '' }" src="../statics/toolbox.png" alt="Toolbox">
        <div v-if="!$route.params.token">
          <div v-if="!canLogin || $q.platform.within.iframe" class="login-card shadow-4 bg-white column items-center justify-center no-wrap">
            <div class="row full-width">
              <div class="col-12 text-center text-red text-bold">
                <big>Token has been expired or revoked</big>
              </div>
            </div>
          </div>
          <div v-else class="login-card shadow-4 bg-white column items-center justify-center no-wrap">
            <p class="text-center text-grey-9">Swiss knife to view and analyze flespi data</p>
            <div class="row full-width">
              <div class="col-12 text-center">
                <q-btn @click="openWindow(`${$authHost}/login/#/providers`)" icon="mdi-account-circle" color="red-7" rounded label="login / register" :size="$q.platform.is.mobile ? 'md' : 'lg'"/>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="login-card shadow-4 bg-white column items-center justify-center no-wrap">
            <q-circular-progress indeterminate color="green-6" style="width: 100%; height: 45px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'

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
    ...mapState({
      sessionSettings: state => state.sessionSettings
    }),
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
    ...mapActions(['initConnection']),
    ...mapMutations(['setRegions', 'setToken', 'setToolboxSessionSettings']),
    goto (to) {
      if (this.tokenInfo) {
        this.$router.push(to).catch(err => err)
      } else {
        let connectEventIndex = false,
          errorEventIndex = false
        const eventHandler = () => {
          this.$router.push(to).catch(err => err)
          connectEventIndex && Vue.connector.socket.off('connect', connectEventIndex)
          errorEventIndex && Vue.connector.socket.off('error', errorEventIndex)
        }
        connectEventIndex = Vue.connector.socket.on('connect', eventHandler)
        errorEventIndex = Vue.connector.socket.on('error', eventHandler)
      }
    },
    logIn (region) {
      this.initConnection({ token: this.token, region })
        .then(() => {
          this.$nextTick(() => {
            if (this.$route.params && this.$route.params.goto) {
              this.goto(this.$route.params.goto)
            } else {
              this.goto('/')
            }
          })
        })
    },
    autoLogin () {
      this.initConnection({ token: this.$route.params.token })
        .then(() => {
          this.goto('/')
        })
    },
    checkHasToken () {
      const sessionSettings = this.sessionSettings || {}
      const sessionStorageToken = sessionSettings.token
      const sessionStorageRegion = sessionSettings.region
      if (this.$route.params && this.$route.params.token) {
        this.autoLogin()
      } else if (sessionStorageToken) {
        this.token = sessionStorageToken
        this.logIn(sessionStorageRegion)
      }
    },
    openWindow (url, title) {
      title = title || 'auth'
      const w = 500, h = 600
      const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
      const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

      const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
      const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

      const left = ((width / 2) - (w / 2)) + dualScreenLeft
      const top = ((height / 2) - (h / 2)) + dualScreenTop
      const newWindow = window.open(url, title, 'toolbar=no,location=no,status=yes,resizable=yes,scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

      // Puts focus on the newWindow
      if (window.focus) {
        newWindow.focus()
      }
    },
    regionInitFromAuth (region) {
      this.setRegions({ [region.name]: region })
      this.setToolboxSessionSettings({ region })
      this.$connector.setRegion(region)
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
    if (this.sessionSettings && this.sessionSettings.isVisibleToolbar) {
      this.canLogin = this.sessionSettings.isVisibleToolbar
    }
    const tokenHandler = (event) => {
      if (typeof event.data === 'string' && ~event.data.indexOf('FlespiLogin|token:')) {
        let payload = event.data
        payload = payload.replace('FlespiLogin|token:', '')
        payload = JSON.parse(payload)
        this.token = payload.token
        this.regionInitFromAuth(payload.region)
        this.setToken(payload.token)
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
      height 100vh
      overflow hidden
      padding-top 15vh
      background-image url(../statics/mountain.svg)
      background-position center 100px
      background-size contain
      background-repeat no-repeat
      background-color #333
      color rgba(255,255,255,0.7)
      .login-code
        width: 80vw;
        max-width: 600px;
    .login-card
      border-radius 2px
      width 80vw
      max-width 600px
      padding 25px
      > i
        font-size 5rem
</style>
