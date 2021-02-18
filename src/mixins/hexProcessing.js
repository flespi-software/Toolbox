import convert from './convert'
import { date, copyToClipboard } from 'quasar'
import range from 'lodash/range'
import chunk from 'lodash/chunk'
export default {
  mixins: [convert],
  methods: {
    getBytesArray (hex, view) {
      let bytesArray
      if (view === 'hex') {
        const bytes16Array = hex.match(/.{1,32}/g)
        bytesArray = bytes16Array.map(byte16 => byte16.match(/.{1,2}/g))
      } else if (view === 'text') {
        bytesArray = hex.match(/.{1,2}/g)
      }
      return bytesArray
    },
    getAddresses (hex) { return range(0x00, 0x10 * hex.match(/.{1,32}/g).length, 0x10) },
    getSelected (start, end) {
      let selected = []
      if (start !== -1 && end !== -1) {
        if (start > end) {
          selected = range(end, start + 1)
        } else {
          selected = range(start, end + 1)
        }
      }
      return selected
    },
    getHeader (packet) {
      const eventsDesc = {
        0: 'Connect',
        1: 'Disconnect',
        2: 'Data recieved',
        130: 'Data recieved',
        3: 'Data sent',
        131: 'Data sent'
      }
      let header = ''
      header += eventsDesc[packet.type]
      header += '('
      header += date.formatDate(packet.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')
      if (packet.data) {
        const hex = this.base64ToHex(packet.data)
        const transport = (packet.type === 0 || packet.type === 1) ? '' : (packet.type >= 128) ? 'udp' : 'tcp'
        header += ` size: ${Math.floor(hex.length / 2)}B`
        header += ` ${transport}`
      }
      header += ')'
      return header
    },
    getContent (type, hex, view, selected = []) {
      let content = ''
      switch (type) {
        case 'hex': {
          if (selected.length) {
            const byteArray = hex.match(/.{1,2}/g)
            content = selected.map(index => byteArray[index]).join('')
          } else {
            content = hex
          }
          break
        }
        case 'text': {
          const bytesHexArray = hex.match(/.{1,2}/g)
          const byteArray = selected.length ? selected.map(index => bytesHexArray[index]) : bytesHexArray
          content = byteArray.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('')
          break
        }
        case 'view': {
          const bytesArray = this.getBytesArray(hex, view)
          if (view === 'text') {
            const byteArray = selected.length ? selected.map(index => bytesArray[index]) : bytesArray
            content = byteArray.map((byte) => {
              let str = this.replaceByteWithMnemo(byte)
              if (byte === '0A') {
                str += '\n'
              }
              return str
            }).join('')
          } else {
            const isSelectionMode = selected.length,
              allIndexes = chunk(Object.keys(hex.match(/.{1,2}/g)), 16),
              addresses = this.getAddresses(hex),
              indexes = isSelectionMode ? allIndexes.reduce((indexes, row) => {
                let isRowEmpty = true
                const localRow = row.reduce((currentRow, byteIndex, index) => {
                  if (byteIndex < selected[0] || byteIndex > selected[selected.length - 1]) {
                    currentRow.push(null)
                  } else {
                    currentRow.push(byteIndex)
                    isRowEmpty = false
                  }
                  if (index === row.length - 1) {
                    currentRow = isRowEmpty ? null : currentRow
                  }
                  return currentRow
                }, [])
                indexes.push(localRow)
                return indexes
              }, []) : allIndexes
            indexes.forEach((row, index) => {
              if (!row) { return false }
              content += `${addresses[index].toString(16).padStart(7, 0).toUpperCase()}   `
              const currentBytesArray = bytesArray[index]
              let hexView = '',
                textView = ''
              row.forEach((index, byteIndex) => {
                if (!index) {
                  hexView += '  '
                  textView += ' '
                } else {
                  hexView += currentBytesArray[byteIndex]
                  textView += this.replaceByteWithDot(currentBytesArray[byteIndex])
                }
                hexView += ' '
              })
              content += hexView
              content += '   '
              content += ''.padEnd(32 - row.length * 2, ' ')
              content += ''.padEnd(16 - row.length, ' ')
              content += textView
              content += '\n'
            })
          }
          break
        }
      }
      return content
    },
    copy (content, type = 'hex') {
      copyToClipboard(content).then((e) => {
        this.$q.notify({
          type: 'positive',
          icon: 'content_copy',
          message: `${type} copied`,
          timeout: 1000
        })
      }, (e) => {
        this.$q.notify({
          type: 'negative',
          icon: 'content_copy',
          message: `Error coping ${type}`,
          timeout: 1000
        })
      })
    },
    exportData (content, type = '') {
      const typeOfFile = type === 'hex' ? 'application/octet-stream' : 'text/plain',
        link = document.createElement('a'),
        blob = new Blob([content], { type: typeOfFile }),
        data = URL.createObjectURL(blob)
      link.setAttribute('href', data)
      link.setAttribute('download', 'data.txt')
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
