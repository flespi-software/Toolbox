<template>
  <div class="empty-state__back">
    <div class="text-center text-grey-4" :class="[`q-pb-${$q.platform.is.mobile ? 'sm' : 'lg'}`, $q.platform.is.mobile ? '' : 'q-pt-lg']" style="font-size: 1.5rem;">{{config.label}}</div>
    <div class="row text-white q-px-md q-mb-md" v-if="$q.platform.is.desktop">
      <div class="text-grey-4 col-12 q-px-sm" style="font-size: .9rem;">{{config.sublabel}}</div>
      <div class="q-pa-sm" :class="hint.wclass || [ 'col-6', 'col-sm-3' ]" v-for="(hint, i) in config.hints" :key="i">
        <div class="empty-state__card full-height" v-html="hint.html"></div>
      </div>
    </div>
    <template v-else >
      <q-dialog v-model="dialogModel">
        <div class="row text-white q-pa-md bg-grey-9">
          <div class="text-grey-4 col-12 q-px-sm" style="font-size: .9rem;">{{config.sublabel}}</div>
          <div class="q-pa-sm" :class="hint.wclass || [ 'col-6', 'col-sm-3' ]" v-for="(hint, i) in config.hints" :key="i">
            <div class="empty-state__card full-height" v-html="hint.html"></div>
          </div>
        </div>
      </q-dialog>
      <div class="text-center q-mb-sm">
        <q-btn label="Details" @click="dialogModel = true" dense color="white" flat></q-btn>
      </div>
    </template>
    <div class="text-center">
      <q-btn type="a" label="More about Toolbox" href="https://flespi.com/blog/drive-telematics-diagnostics-beyond-ordinary-with-flespi-toolbox" target="_blank" dense :flat="$q.platform.is.mobile" color="red" size=".8rem"/>
    </div>
    <slot name="after"></slot>
  </div>
</template>

<script>
export default {
  name: 'EmptyPane',
  props: [ 'config' ],
  data () {
    return {
      dialogModel: false
    }
  }
}
</script>

<style lang="stylus">
.empty-state__back
  width 100%
  height 100%
  overflow auto
  background-image url(../statics/mountain.svg)
  background-position center 100px
  background-size contain
  background-repeat no-repeat
.empty-state__card
  padding 8px
  font-size .8rem
  border-radius 5px
  background-color rgba(0, 0, 0, .3)
</style>
