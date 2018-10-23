export default {
  methods: {
    filterMessages (filter, messages) { // live filter messages
      function getPartsOfFilter (filterString) {
        let filtersStringArr = filterString.split(',')

        return filtersStringArr.reduce((acc, filter) => {
          let parts = [],
            operation = ''
          if (filter.indexOf('!=') !== -1) {
            parts = filter.split('!=')
            operation = '!='
          } else if (filter.indexOf('<=') !== -1) {
            parts = filter.split('<=')
            operation = '<='
          } else if (filter.indexOf('>=') !== -1) {
            parts = filter.split('>=')
            operation = '>='
          } else if (filter.indexOf('=') !== -1) {
            parts = filter.split('=')
            operation = '='
          } else if (filter.indexOf('<') !== -1) {
            parts = filter.split('<')
            operation = '<'
          } else if (filter.indexOf('>') !== -1) {
            parts = filter.split('>')
            operation = '>'
          } else {
            parts = [filter, null]
            operation = 'exist'
          }
          if (operation) {
            acc.push({
              operation: operation,
              field: parts[0],
              value: parts[1]
            })
          }
          return acc
        }, [])
      }
      if (this.filter) {
        let filters = getPartsOfFilter(filter)
        return messages.filter(message => {
          let isMessageIncluded = filters.reduce((flag, filter) => {
            /* eslint-disable */
            switch (filter.operation) {
              case '!=': {
                return flag && !!message[filter.field] && message[filter.field] != filter.value
              }
              case '<=': {
                return flag && !!message[filter.field] && message[filter.field] <= filter.value
              }
              case '>=': {
                return flag && !!message[filter.field] && message[filter.field] >= filter.value
              }
              case '=': {
                let val = JSON.stringify(message[filter.field]).slice(1, -1)
                return flag && !!val && !!val.match(`^${filter.value.replace(/\*/g, '.*')}$`)
              }
              case '<': {
                return flag && !!message[filter.field] && message[filter.field] < filter.value
              }
              case '>': {
                return flag && !!message[filter.field] && message[filter.field] > filter.value
              }
              default: {
                return flag && message[filter.field] !== undefined
              }
            }
            /* eslint-enable */
          }, true)
          if (isMessageIncluded) {
            message['x-flespi-filter-fields'] = filters.map(filter => filter.field)
          }
          return isMessageIncluded
        })
      } else {
        if (this.mode === 0) {
          return messages.map(message => {
            if (message['x-flespi-filter-fields']) {
              delete message['x-flespi-filter-fields']
            }
            return message
          })
        } else { return messages }
      }
    }
  }
}
