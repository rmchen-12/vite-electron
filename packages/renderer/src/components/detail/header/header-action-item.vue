<template>
  <el-tooltip
    class="item"
    effect="dark"
    :enterable="false"
    :visible-arrow="false"
    :content="tip"
    placement="bottom"
    @click="click"
  >
    <svg-icon :name="name"></svg-icon>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      require: true,
    },
    tip: {
      type: String,
      require: true,
    },
  },
  setup(props, { emit }) {
    const click = () => emit('emitAction');
    return { click };
  },
};
</script>

<style></style>
