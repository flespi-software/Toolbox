<template>
  <q-dialog v-model="opened" persistent no-route-dismiss>
    <q-card style="min-width: 350px" class="bg-grey-9 text-white">
      <q-card-section>
        <div class="text-h6">Settings</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model.number="dataLimit" outlined label="Page row count" dark color="white" type="number" autofocus />
      </q-card-section>
      <q-card-section class="q-pt-none row justify-center">
        <q-btn flat label="Set Toolbox to default" color="red-7" v-if="!clearSure" @click="clearSure = true" />
        <q-btn flat label="Are you sure?" color="yellow-7" v-else @click="clear"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Save" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ['limit'],
  data () {
    return {
      opened: false,
      dataLimit: this.limit,
      clearSure: false
    }
  },
  methods: {
    show () {
      this.opened = true
    },
    hide () {
      this.opened = false
    },
    save () {
      this.$emit('input', {
        limit: +this.dataLimit
      })
    },
    clear () {
      this.$emit('clear')
      this.clearSure = false
      this.hide()
    }
  }
}
</script>
