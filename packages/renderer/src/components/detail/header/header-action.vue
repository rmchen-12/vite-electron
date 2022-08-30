<template>
  <div class="mail-detail-header-action">
    <div v-if="isDraft">
      <HeaderActionItem name="mail-edit" tip="再次编辑"></HeaderActionItem>
      <HeaderActionItem name="mail-replyall" tip="删除"></HeaderActionItem>
    </div>

    <div v-else-if="isDeleted">
      <HeaderActionItem name="mail-reply" tip="回复"></HeaderActionItem>
      <HeaderActionItem name="mail-replyall" tip="全部回复"></HeaderActionItem>
      <HeaderActionItem name="mail-forward" tip="转发"></HeaderActionItem>
      <HeaderActionItem name="mail-del" tip="彻底删除"></HeaderActionItem>
      <HeaderActionItem name="mail-recover" tip="恢复"></HeaderActionItem>
    </div>

    <div v-else>
      <HeaderActionItem name="mail-reply" tip="回复"></HeaderActionItem>
      <HeaderActionItem name="mail-replyall" tip="全部回复"></HeaderActionItem>
      <HeaderActionItem name="mail-forward" tip="转发"></HeaderActionItem>
      <HeaderActionItem name="mail-del" tip="删除"></HeaderActionItem>
    </div>
  </div>
</template>

<script>
import HeaderActionItem from './header-action-item.vue';
export default {
  name: 'HeaderAction',
  components: { HeaderActionItem },
  props: {
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
.mail-detail-header-action {
  svg {
    padding-left: 16px;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}
</style>
