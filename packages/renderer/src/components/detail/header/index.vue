<template>
  <div class="mail-detail-header">
    <div class="title">
      <span v-if="isDraft" class="title-label">[草稿]</span>
      {{ mTitle }}
    </div>
    <HeaderAction :isDraft="isDraft" :isDeleted="isDeleted"></HeaderAction>
  </div>
</template>

<script>
import HeaderAction from './header-action.vue';
export default {
  components: { HeaderAction },
  props: {
    mTitle: {
      type: String,
      require: true,
    },
    isDraft: {
      type: Boolean,
      require: true,
    },
    isDeleted: {
      type: Boolean,
      require: true,
    },
  },
};
</script>

<style lang="scss">
.mail-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #0d0d1a;
    line-height: 25px;

    &-label {
      color: #9999a3;
      font-weight: normal;
    }
  }
}
</style>
