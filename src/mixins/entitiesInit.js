import { mapActions } from 'vuex'
import get from 'lodash/get'

let loadedEntities = {}
function getMainEntity (entity, routeId, lsId, flag, dest) {
  let res
  if (flag) {
    if (routeId) {
      res = { entity, id: routeId, mode: 1 }
    } else if (lsId) {
      res = { entity, id: lsId, mode: 1 }
    } else {
      /* needn`t init main entity */
    }
  } else {
    res = { entity, id: routeId, mode: 1 }
  }
  return res ? dest.push(res) : false
}

export default {
  beforeRouteEnter (to, from, next) {
    let toEntity = to.meta.moduleName,
      fromEntity = from.meta.moduleName
    next(vm => {
      if (toEntity !== fromEntity || !fromEntity) {
        let entity = toEntity,
          promises = []
        if (entity) {
          let idFromRoute = to.params && to.params.id ? to.params.id : null
          let mainEntityIdFromRoute
          if (idFromRoute) { mainEntityIdFromRoute = Number(idFromRoute.split('-')[0]) }
          let idFromLS = get(vm.settings, `entities[${entity}]`, undefined)
          switch (entity) {
            case 'devices': {
              if (fromEntity === 'intervals') { fromEntity = 'devices' }
              if (entity !== fromEntity) {
                if (idFromRoute) {
                  promises.push({ entity: 'tasks', id: Number(idFromRoute), mode: 1 })
                }
                getMainEntity(entity, mainEntityIdFromRoute, idFromLS, vm.isNeedSelect, promises)
              }
              break
            }
            case 'intervals': {
              promises.push({ entity: 'calcs', mode: 1 })
              entity = 'devices'
              if (entity !== fromEntity) {
                if (idFromRoute) {
                  promises.push({ entity: 'tasks', id: Number(idFromRoute), mode: 1 })
                }
                getMainEntity(entity, mainEntityIdFromRoute, idFromLS, vm.isNeedSelect, promises)
              }
              break
            }
            case 'hexViewer': {
              entity = 'channels'
              if (entity !== fromEntity) {
                getMainEntity(entity, mainEntityIdFromRoute, idFromLS, vm.isNeedSelect, promises)
              }
              break
            }
            case 'channels': {
              fromEntity = fromEntity === 'hexViewer' ? 'channels' : fromEntity
              if (entity !== fromEntity) {
                getMainEntity(entity, mainEntityIdFromRoute, idFromLS, vm.isNeedSelect, promises)
              }
              break
            }
            case 'platform': {
              entity = 'subaccounts'
              if (fromEntity === 'mqtt') {
                break
              }
              getMainEntity(entity, mainEntityIdFromRoute, idFromLS, vm.isNeedSelect, promises)
              break
            }
            case 'mqtt': {
              entity = 'subaccounts'
              if (fromEntity === 'platform') {
                break
              }
              getMainEntity(entity, mainEntityIdFromRoute, idFromLS, vm.isNeedSelect, promises)
              break
            }
            default: {
              getMainEntity(entity, mainEntityIdFromRoute, idFromLS, vm.isNeedSelect, promises)
            }
          }
        }
        promises.forEach(promise => {
          loadedEntities[promise.entity] = promise
        })
        /* update status entity in render */
        if (loadedEntities[entity] && !loadedEntities[entity].id) {
          vm.isItemsInit = true
        }
        vm.getEntities(promises).then(() => { vm.init && vm.init() })
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    let toEntity = to.meta.moduleName,
      fromEntity = from.meta.moduleName,
      toId = to.params && to.params.id ? Number(to.params.id) : null,
      fromId = from.params && from.params.id ? Number(from.params.id) : null,
      uninit = [],
      init = []
    if (toEntity === fromEntity) {
      if (toId) {
        switch (toEntity) {
          case 'devices': {
            init.push({ entity: 'tasks', id: toId, mode: 1 })
            break
          }
          case 'intervals': {
            if (toId !== fromId) {
              init.push({ entity: 'tasks', id: toId, mode: 1 })
            }
            break
          }
        }
      }
      if (fromId) {
        switch (toEntity) {
          case 'devices': {
            uninit.push({ entity: 'tasks', id: fromId, mode: 1 })
            break
          }
          case 'intervals': {
            if (toId !== fromId) {
              uninit.push({ entity: 'tasks', id: fromId, mode: 1 })
            }
            break
          }
        }
      }
    }
    uninit.forEach(promise => {
      delete loadedEntities[promise.entity]
    })
    init.forEach(promise => {
      loadedEntities[promise.entity] = promise
    })
    this.removeEntities(uninit)
      .then(() => { this.getEntities(init) })
      .then(next)
  },
  beforeRouteLeave (to, from, next) {
    let fromEntity = from.meta.moduleName,
      toEntity = to.meta.moduleName,
      promises = []
    if (fromEntity && toEntity !== fromEntity) {
      let idFromRoute = from.params && from.params.id ? Number(from.params.id) : null
      switch (fromEntity) {
        case 'devices': {
          if (toEntity === 'intervals') { toEntity = 'devices' }
          if (toEntity !== fromEntity) {
            promises.push({ entity: 'tasks', id: idFromRoute, mode: 1 })
            promises.push(this.isNeedSelect && this.isItemsInit ? { entity: fromEntity, mode: 1 } : { entity: fromEntity, id: idFromRoute, mode: 1 })
          }
          break
        }
        case 'intervals': {
          promises.push({ entity: 'calcs', mode: 1 })
          fromEntity = 'devices'
          if (toEntity !== fromEntity) {
            promises.push({ entity: 'tasks', id: idFromRoute, mode: 1 })
            promises.push(this.isNeedSelect && this.isItemsInit ? { entity: fromEntity, mode: 1 } : { entity: fromEntity, id: idFromRoute, mode: 1 })
          }
          break
        }
        case 'hexViewer': {
          fromEntity = 'channels'
          if (fromEntity !== toEntity) {
            promises.push(this.isNeedSelect && this.isItemsInit ? { entity: fromEntity, mode: 1 } : { entity: fromEntity, id: idFromRoute, mode: 1 })
          }
          break
        }
        case 'platform': {
          fromEntity = 'subaccounts'
          if (toEntity === 'mqtt') {
            break
          }
          promises.push(this.isNeedSelect && this.isItemsInit ? { entity: fromEntity, mode: 1 } : { entity: fromEntity, id: idFromRoute, mode: 1 })
          break
        }
        case 'mqtt': {
          fromEntity = 'subaccounts'
          if (toEntity === 'platform') {
            break
          }
          promises.push(this.isNeedSelect && this.isItemsInit ? { entity: fromEntity, mode: 1 } : { entity: fromEntity, id: idFromRoute, mode: 1 })
          break
        }
        default: {
          promises.push(this.isNeedSelect && this.isItemsInit ? { entity: fromEntity, mode: 1 } : { entity: fromEntity, id: idFromRoute, mode: 1 })
        }
      }
    }
    promises.forEach(promise => {
      delete loadedEntities[promise.entity]
    })
    return this.removeEntities(promises).then(() => { next() })
  },
  methods: {
    ...mapActions([
      'getEntities',
      'removeEntities',
      'unsubscribeItems'
    ]),
    itemsLoad (entity, update, id, cb) {
      return this.getEntities([{ entity, mode: 1 }])
        .then((res) => {
          if (id) {
            this.unsubscribeItems({ entity, id: id, mode: 1 })
          }
          update(() => {
            loadedEntities[entity] = { entity, mode: 1 }
            cb && cb()
          })
        })
    }
  }
}
