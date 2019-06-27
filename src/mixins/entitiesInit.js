import {mapActions} from 'vuex'

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
          switch (entity) {
            case 'devices': {
              if (fromEntity === 'intervals') { fromEntity = 'devices' }
              if (entity !== fromEntity) {
                if (idFromRoute) {
                  promises.push({entity: 'tasks', addition: true, id: Number(idFromRoute), mode: 1})
                }
                promises.push(vm.isNeedSelect ? entity : {entity, id: Number(idFromRoute.split('-')[0])})
              }
              break
            }
            case 'intervals': {
              promises.push({entity: 'calcs', addition: true})
              entity = 'devices'
              if (entity !== fromEntity) {
                if (idFromRoute) {
                  promises.push({entity: 'tasks', addition: true, id: Number(idFromRoute), mode: 1})
                }
                promises.push(vm.isNeedSelect ? entity : {entity, id: Number(idFromRoute.split('-')[0])})
              }
              break
            }
            case 'hexViewer': {
              entity = 'channels'
              if (entity !== fromEntity) {
                promises.push(vm.isNeedSelect ? entity : {entity, id: Number(idFromRoute.split('-')[0])})
              }
              break
            }
            default: {
              promises.push(vm.isNeedSelect ? entity : {entity, id: idFromRoute.split('-')[0]})
            }
          }
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
            init.push({entity: 'tasks', addition: true, id: toId, mode: 1})
            break
          }
          case 'intervals': {
            if (toId !== fromId) {
              init.push({entity: 'tasks', addition: true, id: toId, mode: 1})
            }
            break
          }
        }
      }
      if (fromId) {
        switch (toEntity) {
          case 'devices': {
            uninit.push({entity: 'tasks', addition: true, id: fromId, mode: 1})
            break
          }
          case 'intervals': {
            if (toId !== fromId) {
              uninit.push({entity: 'tasks', addition: true, id: fromId, mode: 1})
            }
            break
          }
        }
      }
    }
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
            promises.push({entity: 'tasks', addition: true, id: idFromRoute, mode: 1})
            promises.push(this.isNeedSelect ? fromEntity : {fromEntity, id: idFromRoute})
          }
          break
        }
        case 'intervals': {
          promises.push({entity: 'calcs', addition: true})
          fromEntity = 'devices'
          if (toEntity !== fromEntity) {
            promises.push({entity: 'tasks', addition: true, id: idFromRoute, mode: 1})
            promises.push(this.isNeedSelect ? fromEntity : {fromEntity, id: idFromRoute})
          }
          break
        }
        case 'hexViewer': {
          fromEntity = 'channels'
          if (fromEntity !== toEntity) {
            promises.push(this.isNeedSelect ? fromEntity : {fromEntity, id: idFromRoute})
          }
          break
        }
        default: {
          promises.push(this.isNeedSelect ? fromEntity : {fromEntity, id: idFromRoute})
        }
      }
    }
    return this.removeEntities(promises).then(() => { next() })
  },
  methods: {
    ...mapActions([
      'getEntities',
      'removeEntities'
    ])
  }
}
