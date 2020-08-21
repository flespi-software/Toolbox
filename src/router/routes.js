import config from '../config.js'
import upperFirst from 'lodash/upperFirst'

function getIndexChildrenRoutes (config) {
  return Object.keys(config).reduce((result, moduleName) => {
    const componentName = upperFirst(moduleName),
      type = config[moduleName].type,
      path = config[moduleName].path || moduleName
    if (Array.isArray(path)) {
      path.forEach((path) => {
        result.push(
          {
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
        )
      })
    } else {
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
      if (moduleName === 'trafficViewer') {
        route.children[0].children = [
          {
            path: 'ident/:ident',
            meta: { moduleName }
          }
        ]
      }
      result.push(route)
    }
    return result
  }, [])
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
        component: () => import('layouts/Index')
      }
    ]
  },
  { path: '/token/:token', component: () => import('pages/Login') },
  { path: '/token/:token/type/:type/id/:id', component: () => import('layouts/Index') },
  { path: '/token/:token/group/:group', component: () => import('layouts/Index') },
  { path: '/token/:token/type/:type/id/:id/fullscreen/:fullscreen', component: () => import('layouts/Index') },
  { path: '/token/:token/type/:type/id/:id/fullscreen/:fullscreen/noselect/:noselect', component: () => import('layouts/Index') },
  { path: '/login', component: () => import('pages/Login'), name: 'simpleLogin' },
  { path: '/login/:token', component: () => import('pages/Login') }
]
