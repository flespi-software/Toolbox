<template>
  <div class="image-view__image" :style="{backgroundImage: `url(${item})`}"></div>
</template>

<script>
export default {
  name: 'image-view',
  props: {
    item: String,
    inverted: {
      type: Boolean,
      default () {
        return true
      }
    }
  }
}
</script>

<style lang="stylus">
  .image-view__image
    background-repeat no-repeat
    height 60vh
    background-size contain
    background-position center
</style>
