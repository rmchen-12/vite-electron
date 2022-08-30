<template>
  <div class="email-detail-footer-button">{{ text }}</div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      require: true,
    },
  },
};
</script>

<style lang="scss">
.email-detail-footer-button {
  cursor: pointer;
  background: #fbfbfc;
  border-radius: 4px;
  padding: 4px 12px;
  transition: all 0.1s;
  color: #5d68e8;
  font-size: 14px;
  font-weight: 500;
  color: #5d68e8;
  user-select: none;
  &:hover {
    background: #f5f5f7;
  }
}
</style>
