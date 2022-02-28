<template>
  <iframe
    ref="iframe"
    :id="postkey"
    :name="postkey"
    :src="link"
    style="width: 100%; height: 100%;"
    frameborder="0"
  ></iframe>
</template>

<script>
export default {
  name: 'ExpressionsTestViewer',
  props: {
    theme: {
      type: String,
      default () { return 'dark' }
    },
    token: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array
    },
    expression: {
      type: String
    }
  },
  data () {
    return {
      postkey: 'expression-test',
      path: 'https://flespi.io/exprtool/#/expr',
      eventsHandlers: {
        ready: this.ready
      }
    }
  },
  computed: {
    link () {
      return `${this.path}?theme=${this.theme}&token=${this.token}`
    }
  },
  methods: {
    setData () {
      const payload = `FlespiTools|${this.postkey}|ExpressionsSetData=>${JSON.stringify(this.data)}`
      this.$refs.iframe.contentWindow.postMessage(payload, '*')
    },
    setCols () {
      const cols = `FlespiTools|${this.postkey}|ExpressionsSetColumns=>${JSON.stringify(this.columns)}`
      this.$refs.iframe.contentWindow.postMessage(cols, '*')
    },
    setExpression () {
      const expr = `FlespiTools|${this.postkey}|ExpressionsSetExpression=>${this.expression}`
      this.$refs.iframe.contentWindow.postMessage(expr, '*')
    },
    ready () {
      if (this.columns) { this.setCols() }
      if (this.data) { this.setData() }
      if (this.expression) { this.setExpression() }
    },
    eventHandle (event) {
      let cmd,
        payload
      if (typeof event.data === 'string' && event.data.indexOf('FlespiTools|') === 0) {
        let data = event.data.split('|')
        if (this.postkey && this.postkey === data[1]) {
          data = data[2].split('=>')
          cmd = data[0]
          try {
            payload = JSON.parse(data[1])
          } catch (e) {
            payload = data[1]
          }
          if (cmd) {
            this.eventsHandlers[cmd](payload)
          }
        }
      }
    }
  },
  mounted() {
    window.addEventListener('message', this.eventHandle)
  },
  watch: {
    data () {
      this.setData()
    },
    expression () {
      this.setExpression()
    },
    columns () {
      this.setCols()
    }
  },
}
</script>
