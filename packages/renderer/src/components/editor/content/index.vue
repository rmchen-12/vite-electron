<template>
  <div class="mail-editor-content">
    <ContentHeader></ContentHeader>
    <Editor></Editor>
  </div>
</template>

<script>
import ContentHeader from './content-header.vue';
import Editor from './content-editor.vue';
export default {
  components: { ContentHeader, Editor },
};
</script>

<style lang="scss">
.mail-editor-content {
  flex: 1 1 auto;
  margin-top: 14px;
  padding: 0 24px;
  background: #ffffff;
  border-radius: 8px;
  // border: 1px solid #ebebf0;

  display: flex;
  flex-direction: column;
}
</style>
