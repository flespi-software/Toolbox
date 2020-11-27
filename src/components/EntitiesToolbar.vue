<template>
  <q-toolbar class="justify-between bg-grey-9">
    <q-resize-observer @resize="resizeHandler"/>
    <slot name="selects"></slot>
    <div v-if="item">
      <q-btn v-if="!item.deleted && mode !== undefined" flat dense class="on-right pull-right text-center rounded-borders q-px-xs q-py-none" color="white" @click="$emit('change-mode', !mode)" style="min-width: 73px; max-width: 73px;">
        <q-icon size="1.5rem" color="white" :name="mode ? 'playlist_play' : 'history'"/>
        <div style="font-size: .7rem; line-height: .7rem">{{mode ? 'Real-time' : 'History'}}</div>
        <q-tooltip>Mode (Real-time/History)</q-tooltip>
      </q-btn>
      <q-btn-toggle
        v-if="!item.deleted && ratio !== undefined && width >= 900"
        dense flat
        color="grey-4"
        toggle-color="white"
        toggle-text-color="white"
        class="q-ml-sm gt-xs" size="sm"
        :value="ratio"
        @input="r => $emit('change-ratio', r)"
        :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'messages', value: 0}]"
      />
    </div>
    <div v-if="item && ($q.platform.is.desktop && width >= 900)" class="flex justify-end" :style="{width: `${actions && actions.length ? actions.length * 72 : ''}px`}">
      <template v-for="(action, index) in actions">
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp" :key="index" v-if="action.condition">
          <q-btn :title="action.label" class="on-left cursor-pointer pull-right text-center rounded-borders q-px-xs q-py-none text-white" @click="action.handler" flat dense style="width: 60px">
            <q-icon size="1.5rem" :name="action.icon"/>
            <div style="font-size: .7rem; line-height: .7rem">{{action.label}}</div>
          </q-btn>
        </transition>
      </template>
    </div>
    <div v-else-if="item && (!$q.platform.is.desktop || width < 900)">
      <q-btn flat icon="mdi-dots-vertical" color="white" v-if="hasActiveActions" dense>
        <q-menu>
          <q-list dark class="bg-grey-7">
            <q-item v-close-popup v-if="!item.deleted && ratio !== undefined">
              <q-btn-toggle
                dense dark
                color="grey-4"
                toggle-color="grey-6"
                toggle-text-color="white"
                size="sm" flat
                :value="ratio"
                @input="r => $emit('change-ratio', r)"
                :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'messages', value: 0}]"
              />
            </q-item>
            <template v-for="(action, index) in actions">
              <q-item v-close-popup v-if="action.condition" clickable @click="action.handler" :key="index" dense>
                <q-item-section avatar>
                  <q-icon :name="action.icon" />
                </q-item-section>
                <q-item-section>{{action.label}}</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </q-toolbar>
</template>

<script>
export default {
  props: ['item', 'ratio', 'mode', 'actions'],
  data () {
    return {
      width: 0
    }
  },
  computed: {
    hasActiveActions () {
      return (!this.item.deleted && this.ratio !== undefined) || (this.actions && this.actions.reduce((res, action) => res || (action && action.condition), false))
    }
  },
  methods: {
    resizeHandler ({ width }) {
      this.width = width
    }
  }
}
</script>
