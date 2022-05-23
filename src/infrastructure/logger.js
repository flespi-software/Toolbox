export class Logger {
  constructor (name = 'ModuleLogger') {
    this.name = `[${name}]`
  }

  extendName (suffix) {
    return new Logger(`${this.name}[${suffix}]`)
  }

  info () {
    console.info(...Array.from(arguments).map(msg => `${this.name} ${msg}`))
  }

  error () {
    console.error(...Array.from(arguments).map(msg => `${this.name} ${msg}`))
  }

  warn () {
    console.warn(...Array.from(arguments).map(msg => `${this.name} ${msg}`))
  }
}
