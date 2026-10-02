<template>
  <q-dialog v-model="opened" persistent no-route-dismiss>
    <q-card style="min-width: 350px" class="bg-grey-9 text-white">
      <q-card-section>
        <div class="text-h6">Settings</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model.number="dataLimit" outlined label="Page row count" dark color="white" type="number" autofocus />
      </q-card-section>
      <q-card-section class="q-pt-none row justify-center q-gutter-x-sm">
        <q-btn flat label="Export" icon="mdi-download" :loading="exporting" @click="exportSettings">
          <q-tooltip>Save the settings (columns, view settings) to a file</q-tooltip>
        </q-btn>
        <q-btn flat label="Import" icon="mdi-upload" :loading="importing" @click="$refs.importFile.click()">
          <q-tooltip>Replace the settings with the ones saved to a file</q-tooltip>
        </q-btn>
        <input ref="importFile" type="file" accept=".json,application/json" style="display: none" @change="importSettings">
      </q-card-section>
      <q-card-section class="q-pt-none row justify-center">
        <q-btn flat label="Set Toolbox to default" color="red-7" v-if="!clearSure" @click="clearSure = true" />
        <q-btn flat label="Are you sure?" color="yellow-7" v-else @click="clear"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Save" @click="save" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from 'quasar'

export default {
  props: ['limit'],
  data () {
    return {
      opened: false,
      dataLimit: this.limit,
      clearSure: false,
      exporting: false,
      importing: false
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
    async exportSettings () {
      this.exporting = true
      try {
        const data = await this.$settingsStorage.exportRecords()
        const link = document.createElement('a')
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
        link.setAttribute('href', url)
        link.setAttribute('download', `toolbox-settings-${date.formatDate(Date.now(), 'YYYY-MM-DD')}.json`)
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(url))
      } catch (e) {
        this.$q.notify({ type: 'negative', message: `Export failed: ${e.message}` })
      } finally {
        this.exporting = false
      }
    },
    async importSettings (event) {
      const file = event.target.files && event.target.files[0]
      /* picking the same file again must fire change again */
      event.target.value = ''
      if (!file) { return }
      this.importing = true
      try {
        await this.$settingsStorage.importExport(JSON.parse(await file.text()))
        /* the settings are read once at start, a reload is the only way every list picks them up */
        document.location.reload()
      } catch (e) {
        const message = e instanceof SyntaxError ? 'The file is not valid JSON' : e.message
        this.$q.notify({ type: 'negative', message: `Import failed: ${message}` })
        this.importing = false
      }
    },
    clear () {
      this.$emit('clear')
      this.clearSure = false
      this.hide()
    }
  }
}
</script>
