<template>
  <q-dialog ref="dialog" @hide="onDialogHide" full-width full-height no-route-dismiss>
    <q-card class="bg-grey-9">
      <q-card-section style="height: 50px;" class="bg-grey-8 q-pa-sm text-white text-h5">
        <span>Error traffic</span>
        <q-btn color="green" class="float-right" icon="mdi-download-network-outline" label="Open traffic viewer" @click="onOKClick" />
        <q-btn color="white" flat class="float-right q-mr-xs" :label="view === 'hex' ? 'View as text' : 'View as hex'" @click="changeMode" />
      </q-card-section>
      <q-card-section class="q-pa-none scroll" style="height: calc(100% - 102px)">
        <hex-viewer
          v-if="hex"
          class="hex-error-viewer"
          :hex="hex"
          :view="view"
          :highlights="highlights"
        />
        <div v-else class="text-white text-h3 text-center q-mt-lg">
          There is no traffic or traffic has expired
        </div>
      </q-card-section>
      <q-card-actions align="right" class="bg-grey-8">
        <q-btn flat color="white" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import HexViewer from "../HexViewer.vue"
import convert from '../../mixins/convert'
export default {
  name: 'TrafficErrorDialog',
  components: { HexViewer },
  props: {
    data: Array,
    error: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const highlights = []
    let hex = this.data.reduce((res, data) => {
      return res + this.getHex(data)
    }, '')
    if (this.error) {
      const error = this.error
      const errorHighlight = {
        type: 'error',
        start: error.field_start,
        end: error.field_boundary,
        text: error.text
      }
      if (error.packet_start) {
        hex = hex.slice(error.packet_start*2)
      }
      errorHighlight.end = error.field_boundary || hex.length - 1
      highlights.push(errorHighlight)
    }
    return {
      hex,
      view: 'hex',
      highlights,
      errorText: this.error.text
    }
  },
  methods: {
    changeMode () {
      this.view = this.view === 'hex' ? 'text' : 'hex'
    },
    getHex (data) {
      return convert.methods.base64ToHex(data)
    },
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    onOKClick () {
      this.$emit('ok')
      this.hide()
    },

    onCancelClick () {
      this.hide()
    }
  }
}
</script>
