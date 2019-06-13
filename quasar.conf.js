// Configuration for your app
const webpack = require('webpack'),
  serverAliases = {
    'local': '',
    'flespi': 'https://flespi.io'
  }
module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'i18n',
      'flespi-io',
      'clipboard',
      'icomoon'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      'mdi'
    ],
    supportIE: true,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'hash',
      basePath: './',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
        cfg.plugins.push(
          new webpack.DefinePlugin({
            'SERVER': JSON.stringify(serverAliases[process.env.FLESPI_SERVER]),
            'DEV': process.env.NODE_ENV === 'development',
            'PROD': process.env.NODE_ENV === 'production'
          })
        )
      }
    },
    devServer: {
      // https: true,
      port: 7007,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QItemSeparator',
        'QInput',
        'QProgress',
        'QWindowResizeObservable',
        'QResizeObservable',
        'QTabs',
        'QTab',
        'QTabPane',
        'QRouteTab',
        'QPopover',
        'QInnerLoading',
        'QSpinnerGears',
        'QModal',
        'QModalLayout',
        'QTooltip',
        'QSelect',
        'QChip',
        'QSlider',
        'QToggle',
        'QDatetime',
        'QSearch',
        'QField',
        'QCheckbox',
        'QCollapsible',
        'QContextMenu',
        'QBtnToggle',
        'QCard',
        'QCardTitle',
        'QCardMain',
        'QCardSeparator',
        'QCardActions'
      ],
      directives: [
        'CloseOverlay',
        'TouchSwipe',
        'TouchPan'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog',
        'LocalStorage',
        'SessionStorage'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [
    ],
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
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/ms-icon-144x144.png',
            'sizes': '144x144',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/apple-icon-152x152.png',
            'sizes': '152x152',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.2'
  }
}
