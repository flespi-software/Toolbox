export default {
  methods: {
    filterMessages (filter, messages) { // live filter messages
      function getPartsOfFilter (filterString) {
        const filtersStringArr = filterString.split(/\||,|&/g)
        let filterStringCopy = filterString

        return filtersStringArr.reduce((acc, filter, index) => {
          let parts = [],
            operation = ''
          const filterLength = filter.length
          filter = filter.trim()
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
          let compareOperation
          if (index === 0) {
            compareOperation = '&'
          } else {
            compareOperation = filterStringCopy[0]
            filterStringCopy = filterStringCopy.slice(1)
            if (compareOperation === ',') {
              compareOperation = '&'
            }
          }
          filterStringCopy = filterStringCopy.slice(filterLength)
          if (operation) {
            acc.push({
              operation,
              compareOperation,
              field: parts[0],
              value: parts[1]
            })
          }
          return acc
        }, [])
      }
      function compare (val, comp, operation) {
        let res
        if (operation === '&') {
          res = val && comp
        } else if (operation === '|') {
          res = val || comp
        }
        return res
      }
      if (this.filter) {
        const filters = getPartsOfFilter(filter)
        return messages.filter(message => {
          const isMessageIncluded = filters.reduce((flag, filter) => {
            let comp
            /* eslint-disable */
            switch (filter.operation) {
              case '!=': {
                comp = !!message[filter.field] && message[filter.field] != filter.value
              }
              case '<=': {
                comp = !!message[filter.field] && message[filter.field] <= filter.value
              }
              case '>=': {
                comp = !!message[filter.field] && message[filter.field] >= filter.value
              }
              case '=': {
                let val = JSON.stringify(message[filter.field])
                if (typeof message[filter.field] === 'string') {
                  val = val.slice(1, -1)
                }
                comp = !!val && !!val.match(`^${filter.value.replace(/\*/g, '.*')}$`)
              }
              case '<': {
                comp = !!message[filter.field] && message[filter.field] < filter.value
              }
              case '>': {
                comp = !!message[filter.field] && message[filter.field] > filter.value
              }
              default: {
                comp = message[filter.field] !== undefined
              }
            }
            /* eslint-enable */
            return compare(flag, comp, filter.compareOperation)
          }, true)
          if (isMessageIncluded) {
            message['x-flespi-filter-fields'] = filters.map(filter => filter.field)
          }
          return isMessageIncluded
        })
      }
    }
  }
}
