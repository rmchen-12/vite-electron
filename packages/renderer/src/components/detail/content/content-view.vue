<template>
  <div class="mail-detail-content-view" v-html="mBody"></div>
</template>

<script>
export default {
  props: {
    mBody: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.mail-detail-content-view {
  padding: 18px 38px 18px 0;
}
</style>
