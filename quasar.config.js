// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app'

export default defineConfig((ctx) => {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'settings-storage',
      'flespi-io',
      'icomoon',
      'integrationBus',
      'logger',
      'select-popup'
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: [
      'app.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'mdi-v7',
      'roboto-font',
      'material-icons'
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      target: {
        browser: 'baseline-widely-available'
      },

      vueRouterMode: 'hash',

      /*
       * @quasar/app-vite defaults this to false, which compiles Vue's Options API out — every
       * `data`, `computed`, `methods`, `watch` and lifecycle hook is then silently ignored and
       * components render with everything undefined. Toolbox is Options API throughout.
       */
      vueOptionsAPI: true,

      /* the aliases Quasar 1 provided out of the box and the ported sources still use */
      alias: {
        src: ctx.appPaths.srcDir,
        assets: ctx.appPaths.resolve.src('assets'),
        components: ctx.appPaths.resolve.src('components'),
        layouts: ctx.appPaths.resolve.src('layouts'),
        pages: ctx.appPaths.resolve.src('pages'),
        boot: ctx.appPaths.resolve.src('boot'),
        stores: ctx.appPaths.resolve.src('stores')
      },

      /* the globals the Vue 2 build defined through webpack's DefinePlugin */
      define: {
        DEV: ctx.dev,
        PROD: ctx.prod,
        LOCAL: process.env.NODE_LOCAL === 'local'
      },

      vitePlugins: [
        ['vite-plugin-checker', {
          eslint: {
            lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{js,mjs,cjs,vue}"',
            useFlatConfig: true
          }
        }, { server: false }]
      ]
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
    devServer: {
      https: false,
      port: 7007,
      /* the Vue 2 build named the browser ('Google Chrome'); Vite reads that from $BROWSER instead */
      open: true
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {
        screen: {
          bodyClasses: true
        }
      },

      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog',
        'LocalStorage',
        'SessionStorage'
      ]
    },

    // https://v2.quasar.dev/options/animations
    animations: [
      'bounceInDown',
      'bounceOutUp'
    ],

    /*
     * PWA has never actually been built — `build` is `quasar build -m spa` and always has been — and
     * the mode is not installed here, so there is no /src-pwa. What the Vue 2 config carried is kept
     * so that `quasar mode add pwa` picks up where it left off; the manifest used to be inline and
     * now lives in /src-pwa/manifest.json, hence extendPWAManifestJson.
     */
    pwa: {
      workboxMode: 'GenerateSW',
      extendPWAGenerateSWOptions (cfg) {
        cfg.skipWaiting = true
        cfg.clientsClaim = true
        cfg.runtimeCaching = [
          {
            urlPattern: /^https:\/\/((localhost:9005)|(flespi\.io))(\/gw\/|\/auth\/|\/platform\/|\/storage\/|\/mqtt\/)/,
            handler: 'NetworkOnly'
          }
        ]
      },
      extendPWAManifestJson (json) {
        json.name = 'Flespi ToolboX'
        json.short_name = 'ToolboX'
        json.display = 'standalone'
        json.orientation = 'any'
        json.background_color = '#333333'
        json.theme_color = '#333333'
        json.icons = [
          { src: 'icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: 'icons/ms-icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: 'icons/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'toolbox'
      }
    },

    bex: {
      extraScripts: []
    }
  }
})
