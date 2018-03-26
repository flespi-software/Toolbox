<template>
  <div>
    <span :class="{'text-white': inverted !== undefined}">{{data.constructor === Array ? '[' : '{'}}</span>
    <div class="margin-left" v-for="(value, key, index) in data" :key="`${key}-${index}`">
      <div v-if="value && typeof value === 'object'">
        <div @click="toggle(data.constructor === Array ? key : index)" class="cursor-pointer">
          <q-icon :color="inverted !== undefined ? 'white' : 'dark'" v-if="showObj[data.constructor === Array ? key : index]" name="mdi-menu-down" style="vertical-align: baseline" />
          <q-icon :color="inverted !== undefined ? 'white' : 'dark'" v-else name="mdi-menu-right" style="vertical-align: baseline" />
          <span :class="[theme.label]">{{key}}</span><span :class="{'text-white': inverted !== undefined}"> : {{data.constructor === Array ? `Array [${value.length}]` : 'Object'}}</span>
        </div>
        <json-tree class="margin-left" v-if="showObj[data.constructor === Array ? key : index]" :data='value' :inverted="inverted"/>
      </div>
      <div v-else>
        <span :class="[theme.label]">{{key}}</span><span :class="{'text-white': inverted !== undefined}"> : </span>
        <span :class="{[theme.typeNumberOrBool]: typeof value === 'number' || typeof value === 'boolean', [theme.typeString]: typeof value === 'string', [theme.typeEmpty]: typeof value === 'undefined' || value === null }">{{JSON.stringify(value)}}</span>
      </div>
    </div>
      <span :class="{'text-white': inverted !== undefined}">{{data.constructor === Array ? ']' : '}'}}</span>
  </div>
</template>

<script>
export default {
  name: 'json-tree',
  props: {
    data: [Object, Array],
    inverted: true
  },
  data () {
    const showObj = []
    const len = Object.keys(this.data).length
    for (let i = 0, l = len; i < l; i++) {
      showObj.push(true)
    }
    return {
      showObj: showObj
    }
  },
  computed: {
    theme () {
      return this.inverted !== undefined
        ? {
          label: 'text-pink-4',
          typeString: 'text-red-3',
          typeNumberOrBool: 'text-blue-3',
          typeEmpty: 'text-grey-5'
        }
        : {
          label: 'text-pink-8',
          typeString: 'text-red-6',
          typeNumberOrBool: 'text-blue-6',
          typeEmpty: 'text-grey-6'
        }
    }
  },
  methods: {
    toggle (index) {
      this.showObj[index] = !this.showObj[index]
      this.showObj.splice(index, 1, this.showObj[index])
    }
  }
}
</script>

<style>
  .margin-left {
    margin-left: 16px;
  }
</style>
