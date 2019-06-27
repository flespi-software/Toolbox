import config from '../config.json'
import upperFirst from 'lodash/upperFirst'

function getIndexChildrenRoutes (config) {
  return Object.keys(config).reduce((result, moduleName) => {
    let componentName = upperFirst(moduleName),
      type = config[moduleName].type,
      path = config[moduleName].path || moduleName
    let route = {
      path: path,
      component: () => import(`pages/${type}/${componentName}`),
      meta: {moduleName},
      children: [
        {
          path: `:id`,
          meta: {moduleName}
        }
      ]
    }
    if (moduleName === 'devices') {
      result.push({
        path: `devices/:id/calc/:calcId/intervals`,
        component: () => import(`pages/${type}/Intervals`),
        meta: {moduleName: 'intervals'}
      })
    }
    result.push(route)
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
  { path: '/token/:token/type/:type/id/:id', component: () => import('layouts/Index') },
  { path: '/token/:token/group/:group', component: () => import('layouts/Index') },
  { path: '/token/:token/type/:type/id/:id/fullscreen/:fullscreen', component: () => import('layouts/Index') },
  { path: '/token/:token/type/:type/id/:id/fullscreen/:fullscreen/noselect/:noselect', component: () => import('layouts/Index') },
  { path: '/login', component: () => import('pages/Login'), name: 'simpleLogin' },
  { path: '/login/:token', component: () => import('pages/Login') },
  { path: '/login/:token/flespi', component: () => import('pages/Login') }
]
