<template>
  <div :class="`mail-editor-footer-btn ${type}`" @click="click">{{ text }}</div>
</template>

<script>
export default {
  props: {
    text: String,
    type: String,
  },
  setup(props, { emit }) {
    const click = () => emit('click');
    return { click };
  },
};
</script>

<style lang="scss">
.mail-editor-footer-btn {
  display: inline-block;
  padding: 6px 20px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  margin-right: 16px;

  background: transparent;
  border: 1px solid #dedee3;

  &:hover {
    background: #e3e3e3;
  }
}

.mail-editor-footer-btn.primary {
  background: #5d68e8;
  color: #ffffff;

  &:hover {
    background: #5262e2;
  }
}
</style>
