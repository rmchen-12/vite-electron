<template>
  <div class="mail-editor-header">
    <span class="back"></span>
    <span class="title">{{ mTitle }}</span>
    <div class="border"></div>
  </div>
</template>

<script>
export default {
  props: {
    mTitle: String,
  },
};
</script>

<style lang="scss">
.mail-editor-header {
  flex: 0 0 52px;
  line-height: 52px;
  background: #ffffff;
  padding: 0 24px;
  border-bottom: 1px solid #fafafc;

  .back {
    position: relative;
    content: "";
    display: inline-block;
    height: 10px;
    width: 10px;
    border-width: 0 0 2px 2px;
    border-color: #9999a3;
    border-style: solid;
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    cursor: pointer;
    user-select: none;
    margin-left: 6px;
  }

  .title {
    height: 24px;
    font-size: 16px;
    font-weight: 500;
    color: #0d0d1a;
    padding-left: 24px;
  }

  .border {
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #EBEBF0;
  }
}
</style>
