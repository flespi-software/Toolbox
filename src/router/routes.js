import config from '../config'

function getIndexChildrenRoutes (config) {
  return Object.keys(config).reduce((result, moduleName) => {
    result.push({
      path: moduleName,
      component: () => import(`components/${moduleName}/Index`),
      meta: {moduleName}
    })
    result.push({
      path: `${moduleName}/:id`,
      component: () => import(`components/${moduleName}/Index`),
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
