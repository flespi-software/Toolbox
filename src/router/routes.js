import config from '../config.js'
import upperFirst from 'lodash/upperFirst'

function getIndexChildrenRoutes (config) {
  return Object.keys(config).reduce((result, moduleName) => {
    const componentName = upperFirst(moduleName),
      type = config[moduleName].type,
      path = config[moduleName].path || moduleName
    const route = {
      path: path,
      component: () => import('pages/' + type + '/' + componentName),
      meta: { moduleName },
      children: [
        {
          path: ':id',
          meta: { moduleName }
        }
      ]
    }
    if (moduleName === 'trafficViewer' || moduleName === 'hexViewer') {
      route.children[0].children = [
        {
          path: 'ident/:ident',
          meta: { moduleName }
        }
      ]
    }
    result.push(route)
    return result
  }, [])
}

const redirect = (to) => {
  const route = { path: '/', query: {} }
  if (to.params.type && to.params.id) {
    const path = config[to.params.type].path || to.params.type
    route.path = `/${path}/${to.params.id}`
    route.meta = { moduleName: to.params.type }
    if (to.params.type === 'intervals') {
      const ids = to.params.id.split('-')
      route.path = `device/${ids[0]}/calc/${ids[1]}/intervals`
    }
  }
  if (to.params.group) { route.query.group = to.params.group }
  if (to.params.token) { route.query.token = to.params.token }
  if (to.params.fullscreen) { route.query.fullscreen = to.params.fullscreen }
  if (to.params.noselect) { route.query.noselect = to.params.noselect }
  console.log(route)
  return route
}

export default [
  {
    path: '/',
    component: () => import('layouts/Index'),
    children: [
      ...getIndexChildrenRoutes(config),
      {
        path: 'view/:type/:id',
        name: 'module',
        redirect,
        component: () => import('layouts/Index')
      }
    ]
  },
  { path: '/token/:token', component: () => import('pages/Login') },
  { path: '/token/:token/type/:type/id/:id', redirect, component: () => import('layouts/Index') },
  { path: '/token/:token/group/:group', redirect, component: () => import('layouts/Index') },
  { path: '/token/:token/type/:type/id/:id/fullscreen/:fullscreen', redirect, component: () => import('layouts/Index') },
  { path: '/token/:token/type/:type/id/:id/fullscreen/:fullscreen/noselect/:noselect', redirect, component: () => import('layouts/Index') },
  { path: '/login', component: () => import('pages/Login'), name: 'simpleLogin' },
  { path: '/login/:token', component: () => import('pages/Login') }
]
