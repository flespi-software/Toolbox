// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const webpack = require('webpack')
module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: [
      'i18n',
      'flespi-io',
      'icomoon'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.styl'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      'mdi-v4',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      // iconSet: 'ionicons-v4', // Quasar icon set
      // lang: 'de', // Quasar language pack
      all: false,

      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',

        'QSeparator',
        'QInput',
        'QCircularProgress',
        'QResizeObserver',
        'QTabs',
        'QTab',
        'QTabPanels',
        'QTabPanel',
        'QMenu',
        'QInnerLoading',
        'QSpinnerGears',
        'QDialog',
        'QTooltip',
        'QSelect',
        'QChip',
        'QSlider',
        'QToggle',
        'QField',
        'QCheckbox',
        'QExpansionItem',
        'QBtnToggle',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QChatMessage',
        'QTimeline',
        'QTimelineEntry'
      ],

      directives: [
        'ClosePopup',
        'TouchSwipe',
        'TouchPan',
        'Ripple'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog',
        'LocalStorage',
        'SessionStorage'
      ],
      config: {
        screen: {
          bodyClasses: true
        }
      }
    },

    // https://quasar.dev/quasar-cli/cli-documentation/supporting-ie
    supportIE: true,

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // showProgress: false,
      // gzip: true,
      // analyze: true,
      // preloadChunks: false,
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
        cfg.plugins.push(
          new webpack.DefinePlugin({
            DEV: process.env.NODE_ENV === 'development',
            PROD: process.env.NODE_ENV === 'production',
            LOCAL: process.env.NODE_LOCAL === 'local'
          })
        )
      }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      // https: true,
      port: 7007,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [
      'bounceInDown',
      'bounceOutUp'
    ],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/((localhost:9005)|(flespi\.io))(\/gw\/|\/auth\/|\/platform\/|\/storage\/|\/mqtt\/)/,
            handler: 'networkOnly'
          }
        ]
      },
      manifest: {
        name: 'Flespi ToolboX',
        short_name: 'ToolboX',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'any',
        background_color: '#333333',
        theme_color: '#333333',
        icons: [
          {
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'statics/icons/ms-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'statics/icons/apple-icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },
    cordova: {},
    electron: {
      extendWebpack (cfg) {},
      packager: {},
      builder: {}
    }
  }
}
