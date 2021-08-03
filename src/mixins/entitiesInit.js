import { mapActions } from 'vuex'
import get from 'lodash/get'

const loadedEntities = {}
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
    const toEntity = to.meta.moduleName
    let fromEntity = from.meta.moduleName
    next(vm => {
      if (toEntity !== fromEntity || !fromEntity) {
        let entity = toEntity
        const promises = []
        if (entity) {
          const idFromRoute = to.params && to.params.id ? JSON.parse(to.params.id) : null
          const idFromLS = get(vm.settings, `entities[${entity}]`, undefined)
          switch (entity) {
            case 'devices': {
              if (fromEntity === 'intervals') { fromEntity = 'devices' }
              if (idFromRoute) {
                promises.push({ entity: 'tasks', id: { device: idFromRoute }, mode: 1 })
              }
              if (entity !== fromEntity) {
                getMainEntity(entity, idFromRoute, idFromLS, vm.isNeedSelect, promises)
              }
              break
            }
            case 'calcs': {
              if (fromEntity === 'intervals') { fromEntity = 'calcs' }
              if (idFromRoute) {
                promises.push({ entity: 'tasks', id: { calc: idFromRoute }, mode: 1 })
              }
              if (entity !== fromEntity) {
                getMainEntity(entity, idFromRoute, idFromLS, vm.isNeedSelect, promises)
              }
              break
            }
            case 'intervals': {
              const deviceTo = to.params && to.params.deviceId ? JSON.parse(to.params.deviceId) : null,
                calcTo = to.params && to.params.calcId ? JSON.parse(to.params.calcId) : null,
                fromId = from.params && from.params.id ? JSON.parse(from.params.id) : null
              if (fromEntity === 'devices') {
                vm.isCalcsInit = getMainEntity('calcs', calcTo, undefined, vm.isNeedSelect || (typeof vm.isNeedSelect === 'string' && !vm.isNeedSelect.indexOf('calcs')), promises)
                vm.isDevicesInit = loadedEntities.devices && !loadedEntities.devices.id
                vm.deviceBlocked = true
                vm.setToolboxSessionSettings({
                  intervalDevicesBlocked: true
                })
                entity = 'devices'
                if (fromId !== deviceTo) {
                  promises.push({ entity: 'tasks', id: { device: deviceTo, calc: calcTo }, mode: 1 })
                }
              } else if (fromEntity === 'calcs') {
                vm.isDevicesInit = getMainEntity('devices', deviceTo, undefined, vm.isNeedSelect || (typeof vm.isNeedSelect === 'string' && !vm.isNeedSelect.indexOf('devices')), promises)
                vm.isCalcsInit = loadedEntities.calcs && !loadedEntities.calcs.id
                vm.calcsBlocked = true
                vm.setToolboxSessionSettings({
                  intervalCalcsBlocked: true
                })
                entity = 'calcs'
                if (fromId !== calcTo) {
                  promises.push({ entity: 'tasks', id: { device: deviceTo, calc: calcTo }, mode: 1 })
                }
              } else {
                vm.deviceBlocked = true
                vm.calcsBlocked = true
                vm.setToolboxSessionSettings({
                  intervalDevicesBlocked: true,
                  intervalCalcsBlocked: true
                })
                promises.push({ entity: 'tasks', id: { device: deviceTo, calc: calcTo }, mode: 1 })
                vm.isCalcsInit = getMainEntity('calcs', calcTo, undefined, vm.isNeedSelect || (typeof vm.isNeedSelect === 'string' && !vm.isNeedSelect.indexOf('calcs')), promises)
                vm.isDevicesInit = getMainEntity('devices', deviceTo, undefined, vm.isNeedSelect || (typeof vm.isNeedSelect === 'string' && !vm.isNeedSelect.indexOf('devices')), promises)
              }
              break
            }
            case 'trafficViewer':
            case 'hexViewer': {
              entity = 'channels'
              if (entity !== fromEntity) {
                getMainEntity(entity, idFromRoute, idFromLS, vm.isNeedSelect, promises)
              }
              break
            }
            case 'channels': {
              fromEntity = fromEntity === 'hexViewer' || fromEntity === 'trafficViewer' ? 'channels' : fromEntity
              if (entity !== fromEntity) {
                getMainEntity(entity, idFromRoute, idFromLS, vm.isNeedSelect, promises)
              }
              break
            }
            case 'platform': {
              entity = 'subaccounts'
              if (fromEntity === 'mqtt') {
                break
              }
              getMainEntity(entity, idFromRoute, idFromLS, vm.isNeedSelect, promises)
              break
            }
            case 'mqtt': {
              entity = 'subaccounts'
              if (fromEntity === 'platform') {
                break
              }
              getMainEntity(entity, idFromRoute, idFromLS, vm.isNeedSelect, promises)
              break
            }
            default: {
              getMainEntity(entity, idFromRoute, idFromLS, vm.isNeedSelect, promises)
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
    const toEntity = to.meta.moduleName,
      fromEntity = from.meta.moduleName,
      toId = to.params && to.params.id ? JSON.parse(to.params.id) : null,
      fromId = from.params && from.params.id ? JSON.parse(from.params.id) : null,
      uninit = [],
      init = []
    if (toEntity === fromEntity) {
      if (toId) {
        switch (toEntity) {
          case 'devices': {
            init.push({ entity: 'tasks', id: { device: toId }, mode: 1 })
            break
          }
          case 'calcs': {
            init.push({ entity: 'tasks', id: { calc: toId }, mode: 1 })
            break
          }
        }
      }
      if (fromId) {
        switch (toEntity) {
          case 'devices': {
            uninit.push({ entity: 'tasks', id: { device: fromId }, mode: 1 })
            break
          }
          case 'calcs': {
            uninit.push({ entity: 'tasks', id: { calc: fromId }, mode: 1 })
            break
          }
        }
      }
      // if (toEntity === 'intervals') {
      //   const deviceTo = to.params && to.params.deviceId ? JSON.parse(to.params.deviceId) : null,
      //     deviceFrom = from.params && from.params.deviceId ? JSON.parse(from.params.deviceId) : null,
      //     calcTo = to.params && to.params.calcId ? JSON.parse(to.params.calcId) : null,
      //     calcFrom = from.params && from.params.calcId ? JSON.parse(from.params.calcId) : null
      //   if (deviceTo !== deviceFrom || calcTo !== calcFrom) {
      //     init.push({ entity: 'tasks', id: { device: deviceTo, calc: calcTo }, mode: 1 })
      //     uninit.push({ entity: 'tasks', id: { device: deviceFrom, calc: calcFrom }, mode: 1 })
      //   }
      // }
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
      toEntity = to.meta.moduleName
    const promises = []
    if (fromEntity && toEntity !== fromEntity) {
      const idFromRoute = from.params && from.params.id ? JSON.parse(from.params.id) : null
      switch (fromEntity) {
        case 'devices': {
          if (toEntity === 'intervals') { toEntity = 'devices' }
          // promises.push({ entity: 'tasks', id: { device: idFromRoute }, mode: 1 })
          if (toEntity !== fromEntity) {
            promises.push({ entity: 'tasks', id: { device: idFromRoute }, mode: 1 })
            promises.push(this.isNeedSelect && this.isItemsInit ? { entity: fromEntity, mode: 1 } : { entity: fromEntity, id: idFromRoute, mode: 1 })
          }
          break
        }
        case 'calcs': {
          if (toEntity === 'intervals') { toEntity = 'calcs' }
          // promises.push({ entity: 'tasks', id: { calc: idFromRoute }, mode: 1 })
          if (toEntity !== fromEntity) {
            promises.push(this.isNeedSelect && this.isItemsInit ? { entity: fromEntity, mode: 1 } : { entity: fromEntity, id: idFromRoute, mode: 1 })
          }
          break
        }
        case 'intervals': {
          const deviceFrom = from.params && from.params.deviceId ? JSON.parse(from.params.deviceId) : null,
            calcFrom = from.params && from.params.calcId ? JSON.parse(from.params.calcId) : null
          if (toEntity === 'devices') {
            promises.push((this.isNeedSelect || (typeof this.isNeedSelect === 'string' && !this.isNeedSelect.indexOf('calcs'))) && this.isCalcsInit ? { entity: 'calcs', mode: 1 } : { entity: 'calcs', id: calcFrom, mode: 1 })
          } else if (toEntity === 'calcs') {
            promises.push((this.isNeedSelect || (typeof this.isNeedSelect === 'string' && !this.isNeedSelect.indexOf('devices'))) && this.isDevicesInit ? { entity: 'devices', mode: 1 } : { entity: 'devices', id: deviceFrom, mode: 1 })
          } else {
            promises.push((this.isNeedSelect || (typeof this.isNeedSelect === 'string' && !this.isNeedSelect.indexOf('calcs'))) && this.isCalcsInit ? { entity: 'calcs', mode: 1 } : { entity: 'calcs', id: calcFrom, mode: 1 })
            promises.push((this.isNeedSelect || (typeof this.isNeedSelect === 'string' && !this.isNeedSelect.indexOf('devices'))) && this.isDevicesInit ? { entity: 'devices', mode: 1 } : { entity: 'devices', id: deviceFrom, mode: 1 })
          }
          promises.push(loadedEntities.tasks)
          break
        }
        case 'trafficViewer':
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
            this.unsubscribeItems({ entity, id, mode: 1 })
          }
          update && update()
          loadedEntities[entity] = { entity, mode: 1 }
          cb && cb()
        })
    },
    filterItems (entity, filter, update) {
      if (this.isItemsInitStart && !this.isItemsInit) { return }
      if (this.isItemsInit) {
        update()
        return
      }
      this.isItemsInitStart = true
      this.itemsLoad(entity, update, this.active, () => { this.isItemsInit = true })
    }
  }
}
