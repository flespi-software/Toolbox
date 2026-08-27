<template>
  <section class="table-skeleton">
    <div class="table-skeleton__row">
      <span class="row__item" v-for="(rowWidth, i) in rowsWidths" :key="i" :style="{ minWidth: `${rowWidth ? rowWidth : '150'}px` }">
        <div class="item__wrapper">
          <div class="item__skeleton"></div>
        </div>
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TableSkeleton',
  props: ['rows'],
  computed: {
    rowsWidths () {
      const rows = this.rows ? this.rows : new Array(12)
      return rows
    }
  }
}
</script>

<style lang="scss">
  .table-skeleton {
    overflow: hidden;
    &__row {
      line-height: 19px;
      margin: 0;
      height: 19px;
      display: flex;
      .row__item {
        padding: 2px 0;
        padding-left: 5px;
        border-right: 2px solid $grey-8;
        .item__wrapper {
          padding-right: 6px;
          .item__skeleton {
            height: 15px;
            border-radius: 5px;
            animation: flashing 1s infinite;
            background-color: rgba(255, 255, 255, .6);
          }
        }
      }
    }
  }
  @keyframes flashing {
    0% {
      opacity: .3;
    }
    50% {
      opacity: .2;
    }
    100% {
      opacity: .3;
    }
  }
</style>
