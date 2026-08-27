/*
  => CommandExample({payload}) Message format: `Toolbox|${postkey}|${commandName}=>${payload}`
  <= @eventExample({payload})
*/

/*
 * The Vue 2 build used an empty `new Vue()` as the emitter; Vue 3 has no instance events, so the
 * handful of methods the bus actually needs are implemented here. The wire format is untouched —
 * it is the public API other applications embed Toolbox through.
 */
class Emitter {
  constructor () {
    this.handlers = {}
  }

  on (event, handler) {
    if (!this.handlers[event]) { this.handlers[event] = [] }
    this.handlers[event].push(handler)
    return handler
  }

  off (event, handler) {
    if (!this.handlers[event]) { return }
    if (handler === undefined) {
      delete this.handlers[event]
      return
    }
    this.handlers[event] = this.handlers[event].filter(item => item !== handler)
  }

  emit (event, payload) {
    if (!this.handlers[event]) { return }
    this.handlers[event].slice().forEach(handler => handler(payload))
  }
}

class IntegrationBus {
  constructor () {
    this.bus = new Emitter()
    this.postkey = window.name
    window.addEventListener('message', (event) => {
      let cmd = '',
        payload = null
      if (typeof event.data === 'string' && event.data.indexOf('Toolbox|') === 0) {
        let data = event.data.split('|')
        data = data[this.postkey ? 2 : 1].split('=>')
        cmd = data[0]
        try {
          payload = JSON.parse(data[1])
        } catch (e) {
          payload = data[1]
        }
      }
      if (cmd) {
        this.bus.emit(cmd, payload)
      }
    })
  }

  on () {
    this.bus.on(...arguments)
  }

  send (cmd, payload) {
    cmd = `Toolbox${this.postkey ? `|${this.postkey}` : ''}|${cmd}${payload ? `=>${JSON.stringify(payload)}` : ''}`
    window.parent && window.parent !== window && window.parent.postMessage(cmd, '*')
    window.opener && window.opener.postMessage(cmd, '*')
  }
}

export default new IntegrationBus()
