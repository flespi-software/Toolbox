import config from '../config.json'
import capitalize from 'lodash/capitalize'

function getIndexChildrenRoutes (config) {
  return Object.keys(config).reduce((result, moduleName) => {
    let componentName = capitalize(moduleName)
    result.push({
      path: moduleName,
      component: () => import(`pages/viewer/${componentName}`),
      meta: {moduleName}
    })
    result.push({
      path: `${moduleName}/:id`,
      component: () => import(`pages/viewer/${componentName}`),
      meta: {moduleName}
    })
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
  { path: '/login/:token', component: () => import('pages/Login') }
]
