<template>
  <q-item class="bg-grey-9">
    <q-item-section>
      <q-item-label header class="q-pa-none bg-white full-width skeleton--modificator" style="height: 16px;"></q-item-label>
    </q-item-section>
  </q-item>
</template>

<style lang="stylus">
  .skeleton--modificator
    border-radius 3px
    animation flashing 1s infinite
  @keyframes flashing
    0%
      opacity .3
    50%
      opacity .2
    100%
      opacity .3
</style>
