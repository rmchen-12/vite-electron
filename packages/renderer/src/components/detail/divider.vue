<template>
  <div class="mail-detail-divider">
    <div v-if="direction === 'horizontal'" class="horizontal"></div>
    <div v-if="direction === 'vertical'" class="vertical"></div>
  </div>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'horizontal',
    },
  },
};
</script>

<style lang="scss" scoped>
.mail-detail-divider {
  background: #ebebf0;
  .horizontal {
    height: 1px;
    width: 100%;
  }
  .vertical {
    display: inline-block;
    width: 1px;
    // height: 1em;
    vertical-align: middle;
    position: relative;
    padding: 4px 0;
  }
}
</style>
