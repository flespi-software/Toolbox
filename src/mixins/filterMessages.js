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
          }
          else if (filter.indexOf('<=') !== -1) {
            parts = filter.split('<=')
            operation = '<='
          }
          else if (filter.indexOf('>=') !== -1) {
            parts = filter.split('>=')
            operation = '>='
          }
          else if (filter.indexOf('=') !== -1) {
            parts = filter.split('=')
            operation = '='
          }
          else if (filter.indexOf('<') !== -1) {
            parts = filter.split('<')
            operation = '<'
          }
          else if (filter.indexOf('>') !== -1) {
            parts = filter.split('>')
            operation = '>'
          }
          else {
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
          return filters.reduce((flag, filter) => {
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
                return flag && !!message[filter.field] && message[filter.field] == filter.value
              }
              case '<': {
                return flag && !!message[filter.field] && message[filter.field] < filter.value
              }
              case '>': {
                return flag && !!message[filter.field] && message[filter.field] > filter.value
              }
              default: {
                return flag && !!message[filter.field]
              }
            }
            /* eslint-enable */
          }, true)
        })
      }
    }
  }
}
