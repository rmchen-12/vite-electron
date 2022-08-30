<template>
  <div class="mail-detail-footer">
    <Button text="回复"></Button>
    <Divider direction="vertical"></Divider>
    <Button text="全部回复"></Button>
    <Divider direction="vertical"></Divider>
    <Button text="转发"></Button>
  </div>
</template>

<script>
import Button from './button.vue';
import Divider from '../divider.vue';
export default {
  components: { Button, Divider },
};
</script>

<style lang="scss">
.mail-detail-footer {
  display: flex;
  align-items: center;
  height: 126px;
  background: #fbfbfc;
  padding-left: 12px;
}
</style>
