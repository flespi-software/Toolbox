import config from '../config.js'
import upperFirst from 'lodash/upperFirst'

/*
 * The Vue 2 build resolved viewer pages through webpack's dynamic `import('pages/' + type + '/' + name)`.
 * Vite needs the set of candidates to be known at build time, so the pages are enumerated up front and
 * looked up by the same path the config describes.
 */
const pages = import.meta.glob('../pages/**/*.vue')

function pageComponent (type, componentName) {
  return pages[`../pages/${type}/${componentName}.vue`]
}

/* migration scaffolding: drop it once every viewer page is ported */
const notPortedYet = []

function getIndexChildrenRoutes (config) {
  return Object.keys(config).reduce((result, moduleName) => {
    const componentName = upperFirst(moduleName),
      type = config[moduleName].type,
      path = config[moduleName].path || moduleName
    const component = pageComponent(type, componentName)
    /*
     * A record without a component is not a route Vue Router will accept — it warns for each one and
     * cannot render them anyway. Entities whose page has not been ported yet are left out.
     */
    if (!component) {
      notPortedYet.push(`${type}/${componentName}.vue`)
      return result
    }
    const route = {
      path: `${path}/:id?`,
      name: `${moduleName}`,
      component,
      meta: { moduleName }
    }
    if (moduleName === 'trafficViewer' || moduleName === 'hexViewer') {
      route.children = [
        {
          name: `${moduleName}-nested`,
          path: 'ident/:ident',
          meta: { moduleName }
        }
      ]
    }
    result.push(route)
    return result
  }, [])
}

const indexChildrenRoutes = getIndexChildrenRoutes(config)

if (DEV && notPortedYet.length) {
  console.info(`[Toolbox] viewer pages not ported yet (${notPortedYet.length}): ${notPortedYet.join(', ')}`)
}

export default [
  {
    path: '/',
    component: () => import('../layouts/Index.vue'),
    children: [
      ...indexChildrenRoutes,
      /* the AI logs viewer used to answer at /ai — links and bookmarks to it must keep working */
      { path: 'ai', redirect: '/ai/logs' }
    ]
  },
  { path: '/token/:token', component: () => import('../pages/Login.vue') },
  { path: '/login', component: () => import('../pages/Login.vue'), name: 'simpleLogin' },
  { path: '/login/:token', component: () => import('../pages/Login.vue') }
]
