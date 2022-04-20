<template>
  <q-dialog ref="dialog" @hide="onDialogHide" full-width full-height no-route-dismiss>
    <q-card class="q-dialog-plugin bg-grey-9">
      <q-card-section class="q-pa-none" style="height: calc(100% - 52px)">
        <expressions-test-viewer
          :theme="theme"
          :columns="columns"
          :token="token"
          :data="data"
          :expression="expression"
        />
      </q-card-section>
      <q-card-actions align="right">
        <!-- <q-btn flat label="OK" @click="onOKClick" /> -->
        <q-btn flat dark color="white" label="Close" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import ExpressionsTestViewer from "./ExpressionsTestViewer.vue"

export default {
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
  components: { ExpressionsTestViewer },

  methods: {
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
