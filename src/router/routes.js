import config from '../config.js'
import upperFirst from 'lodash/upperFirst'

function getIndexChildrenRoutes (config) {
  return Object.keys(config).reduce((result, moduleName) => {
    const componentName = upperFirst(moduleName),
      type = config[moduleName].type,
      path = config[moduleName].path || moduleName
    const route = {
      path: `${path}/:id?`,
      name: `${moduleName}`,
      component: () => import('pages/' + type + '/' + componentName),
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

export default [
  {
    path: '/',
    component: () => import('layouts/Index'),
    children: [ ...getIndexChildrenRoutes(config) ]
  },
  { path: '/token/:token', component: () => import('pages/Login') },
  { path: '/login', component: () => import('pages/Login'), name: 'simpleLogin' },
  { path: '/login/:token', component: () => import('pages/Login') }
]
