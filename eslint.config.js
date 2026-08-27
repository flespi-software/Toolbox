import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    /**
     * Ignore the following files.
     * Please note that pluginQuasar.configs.recommended() already ignores
     * the "node_modules" folder for you (and all other Quasar project
     * relevant folders and files).
     *
     * ESLint requires "ignores" key to be the only one in this object
     */
    // ignores: []
  },

  ...pluginQuasar.configs.recommended(),
  js.configs.recommended,

  /**
   * https://eslint.vuejs.org
   *
   * pluginVue.configs.base
   *   -> Settings and rules to enable correct ESLint parsing.
   * pluginVue.configs[ 'flat/essential']
   *   -> base, plus rules to prevent errors or unintended behavior.
   * pluginVue.configs["flat/strongly-recommended"]
   *   -> Above, plus rules to considerably improve code readability and/or dev experience.
   * pluginVue.configs["flat/recommended"]
   *   -> Above, plus rules to enforce subjective community defaults to ensure consistency.
   */
  ...pluginVue.configs[ 'flat/essential' ],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node, // SSR, Electron, config files
        process: 'readonly', // process.env.*
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly', // BEX related
        browser: 'readonly', // BEX related

        /* build-time globals defined in quasar.config.js */
        DEV: 'readonly',
        PROD: 'readonly',
        LOCAL: 'readonly'
      }
    },

    // add your custom rules here
    rules: {
      'prefer-promise-reject-errors': 'off',
      'vue/multi-word-component-names': 'off',

      /*
       * The Vue 2 build ran `plugin:vue/essential` only — `eslint:recommended` was commented out.
       * The recommended set is kept here, minus the rules that only flag the codebase's existing
       * style (ignored catch bindings, empty catch blocks, assignments kept for readability).
       */
      'no-unused-vars': ['error', { caughtErrors: 'none', args: 'none' }],
      'no-empty': 'off',
      'no-useless-assignment': 'off',
      'no-prototype-builtins': 'off',

      // allow debugger during development only
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  },

  {
    files: [ 'src-pwa/sw/**/*.js' ],
    languageOptions: {
      globals: {
        ...globals.serviceworker
      }
    }
  },

  prettierSkipFormatting
]
