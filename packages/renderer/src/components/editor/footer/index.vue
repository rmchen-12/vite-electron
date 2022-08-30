<template>
  <div class="mail-editor-footer">
    <Button type="primary" text="发送" @click="handleSend"></Button>
    <Button text="放弃" @click="handleCancel"></Button>

    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div>
        <div class="dialog-title">提示</div>
        <div class="dialog-content">{{ dialogContent }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button text="取消" @click="dialogVisible = false"></Button>
        <Button
          type="primary"
          text="确定"
          @click="dialogVisible = false"
        ></Button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Button from './button.vue';
import Divider from '../../detail/divider.vue';
import { inject, ref } from 'vue';
export default {
  components: { Button, Divider },
  setup(props) {
    const mTitle = inject('mTitle');
    const dialogVisible = ref(false);
    const dialogContent = ref('');

    const handleSend = () => {
      if (!mTitle.value) {
        dialogVisible.value = true;
        dialogContent.value = '是否发送无主题邮件 ?';
      }
    };
    const handleCancel = () => {
      dialogVisible.value = true;
      dialogContent.value = '是否保存为草稿 ?';
    };
    return {
      handleSend,
      handleCancel,
      dialogVisible,
      dialogContent,
    };
  },
};
</script>

<style lang="scss">
.mail-editor-footer {
  flex: 0 0 66px;
  display: flex;
  align-items: center;
  background: #fbfbfc;

  .el-dialog__body {
    padding: 0 30px;
  }

  .dialog-title {
    font-size: 18px;
    font-weight: 500;
    color: #0d0d1a;
  }

  .dialog-content {
    padding-top: 10px;
  }

  .el-button--primary {
    background: #5d68e8;
    border-color: #5d68e8;
    height: 34px;
    border-radius: 4px;
  }
}
</style>
