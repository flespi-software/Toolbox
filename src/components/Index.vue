<template>
  <q-layout ref="layout" view="hHh LpR lFf" :page-style="{background: '#333'}">
    <q-toolbar slot="header" color="dark" class="header__main-toolbar">
      <q-toolbar-title>
        <img :src="$q.platform.is.mobile ? 'statics/toolbox_mobile.png':'statics/toolbox50.png'" alt="Track it!" style="height: 30px"> <sup>{{version}}</sup>
      </q-toolbar-title>
      <q-tabs color="dark" v-if="false">
        <q-route-tab
          slot="title"
          name="channels-tab"
          label="Channels"
          to="/channels"
        />
        <q-route-tab
          slot="title"
          name="devices-tab"
          label="Devices"
          to="/devices"
        />
      </q-tabs>
      <q-btn @click="exitHandler"><q-icon name="mdi-exit-to-app"></q-icon></q-btn>
    </q-toolbar>
    <div>
      <router-view></router-view>
    </div>
  </q-layout>
</template>

<script>
  import { QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QTabs, QRouteTab, LocalStorage } from 'quasar-framework'
  import { mapState, mapMutations } from 'vuex'
  import dist from '../../package.json'

  export default {
    data () {
      return {
        version: dist.version
      }
    },
    computed: {
      ...mapState({
        token: (state) => state.token
      })
    },
    methods: {
      ...mapMutations([
        'setToken',
        'clearToken'
      ]),
      exitHandler (e) {
        this.clearToken()
        this.$router.push('/login')
      }
    },
    watch: {
      token (val) {
        if (!val) {
          this.$router.push('/login')
        }
      },
      $route (route) {
        if (route.path === '/') {
          this.$router.push('/channels')
        }
      }
    },
    created () {
      let localStorageToken = LocalStorage.get.item('X-Flespi-Token')
      if (!this.token && !localStorageToken) { // if not logged in
        this.$router.push('/login')
      }
      else {
        if (localStorageToken) { // if token saved in local-storage
          this.setToken(localStorageToken)
        }
        if (this.$route.path === '/') { // if main route
          this.$router.push('/channels')
        }
        else { // go to send route
          this.$router.push(this.$route.path)
        }
      }
    },
    components: { QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QTabs, QRouteTab }
  }
</script>

<style>
  .header__main-toolbar {
    padding: 1px 12px;
  }
</style>
