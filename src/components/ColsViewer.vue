<template>
  <div style="height: 100%">
    <q-item class="q-pa-none">
      <q-item-section>
        <q-item-label class="ellipsis text-bold text-white">Message</q-item-label>
      </q-item-section>
      <q-item-section side><q-icon color="white" class="pull-right cursor-pointer" name="mdi-close" @click.native="$emit('close')" size="1.8rem" /></q-item-section>
    </q-item>
    <q-item  class="q-pa-none">
      <q-item-section class="q-px-sm">
        <q-input type="text" color="white" dark label="Search" v-model="search" class="q-py-none" outlined dense/>
      </q-item-section>
    </q-item>
    <q-scroll-area style="height: calc(100% - 104px);">
      <q-list separator dark>
        <draggable :list="cols" handle=".handle">
          <q-item v-for="(col, index) in cols" :key="index" class="cols-editor__col">
            <q-item-section avatar>
              <q-icon size="1.5rem" class="handle" name="mdi-drag" style="cursor: move"
                :color="col.display ? 'white' : 'grey-8'"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label header class="ellipsis text-bold text-white q-pa-none">{{col.name}}<q-tooltip>{{col.name}}</q-tooltip></q-item-label>
              <q-slider class="col-8" :min="50" :max="2500" :step="25"
                :value="col.width" @change="value => col.width = value"
                label
                :label-value="`${col.width}px`"
                dark
                color="grey-8"
                label-color="white"
              />
            </q-item-section>
            <q-item-section avatar>
              <q-btn :icon="cols[key] && cols[key].display ? 'mdi-eye' : 'mdi-eye-off'" @click="col.display = !col.display" flat dense>
                <q-tooltip>{{cols[key] && cols[key].display ? 'Hide this column' : 'Show this column'}}</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </draggable>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
export default {
  props: ['cols'],
  data () {
    return {}
  },
  methods: {},
  components: { Draggable }
}
</script>

<style lang="stylus">
  .cols-editor__col[draggable="true"]
    background-color #9e9e9e
</style>
