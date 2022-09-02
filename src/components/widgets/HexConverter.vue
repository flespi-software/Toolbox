<template>
  <div class="text-white text-bold q-px-xs row" style="font-family: 'PT Mono', monospace;background: rgba(0,0,0,.8);">
    <template v-if="hex.length <= 256">
      <small class="col-2 gt-sm ellipsis q-pr-md">
        <span class="text-yellow">HEX({{hex.length / 2}}):</span> {{hex}}
      </small>
      <small class="col-md-3 col-5  ellipsis q-pr-md">
        <span class="text-yellow">DEC:</span> {{parseInt(hex, 16)}}
      </small>
      <small class="col md-7 col-7 ellipsis q-pr-md">
        <span class="text-yellow">BIN:</span> {{hex2bin(hex)}}
      </small>
      <q-menu persistent self="bottom middle" anchor="top middle" no>
        <div class="bg-blue-grey-9 row q-pa-sm text-white" style="max-width:100%;width:900px;font-size:15px;">
          <small class="col-12 col-sm-6 col-md-3 ellipsis q-pr-md" v-for="(data, name) of dataview" :key="name">
            <span class="text-yellow">{{name}}:</span> {{data}}
          </small>
        </div>
      </q-menu>

    </template>
    <template v-else>
     <small>Too big to convert</small>
    </template>
  </div>
</template>

<script>
export default {
  props: ['hex'],
  data () {
    return {

    }
  },
  computed: {
    bin () {
      return this.hex2bin(this.hex)
    },
    dataview () {
      return this.hex2DataView(this.hex)
    }
  },
  methods: {
    hex2bin(hex){
      let bin = parseInt(hex, 16).toString(2)
      return bin.padStart(Math.ceil(bin.length / 8) * 8, '0');
    },
    hex2DataView (hex) {
      const data = hex.match(/../g)
      if (data.length) {
        // Create a buffer
        const buf = new ArrayBuffer(data.length < 8 ? 8 : (data.length * 8))
        // Create a data view of it
        const view = new DataView(buf)
        // set bytes
        data.forEach(function (b, i) {
            view.setUint8(i, parseInt(b, 16))
        })
        return {

          Float32: view.getFloat32(0),
          Float32le: view.getFloat32(0, 1),
          Float64: view.getFloat64(0),
          Float64le: view.getFloat64(0, 1),

          BigInt64: view.getBigInt64(0),
          BigInt64le: view.getBigInt64(0, 1),
          BigUint64: view.getBigUint64(0),
          BigUint64le: view.getBigUint64(0, 1),

          Int32: view.getInt32(0),
          Int32le: view.getInt32(0, 1),
          Uint32: view.getUint32(0),
          Uint32le: view.getUint32(0, 1),

          Int16: view.getInt16(0),
          Int16le: view.getInt16(0, 1),
          Uint16: view.getUint16(0),
          Uint16le: view.getUint16(0, 1),

          Int8: view.getInt8(0),
          Uint8: view.getUint8(0)
        }
      } else {
        return {}
      }

    }
  }
}
</script>

<style lang="stylus">

</style>
