<template>
  <div class="email-editor-content-editor">
    <Toolbar
      class="toolbar"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="editor"
      :style="`height:${editorHeight}px`"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import { throttle } from 'lodash';
import { onMounted, onUnmounted, reactive, ref } from 'vue';

export default {
  components: { Editor, Toolbar },

  setup() {
    const editor = ref(null);
    const editorConfig = reactive({
      placeholder: '请输入邮件内容',
      MENU_CONF: {},
    });
    const toolbarConfig = reactive({
      toolbarKeys: [
        'bold',
        'underline',
        'italic',
        'color',
        'through',
        '|',
        'blockquote',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        {
          key: 'group-insert', // 必填，要以 group 开头
          title: '插入', // 必填
          menuKeys: ['insertLink', 'uploadImage', 'uploadAttachment'], // 下级菜单 key ，必填
        },
      ],
      excludeKeys: 'fullScreen',
    });
    const html = ref('');
    const mode = ref('simple');
    const editorHeight = ref(0);

    const onCreated = (_editor) => {
      editor.value = Object.seal(_editor); // 一定要用 Object.seal() ，否则会报错
      console.log(editor.value.getAllMenuKeys());
    };

    let resizeObserver;

    const computeEditorHeight = () => {
      const windowHeight = window.innerHeight;
      const padding = 22; /* 内容区padding值 */
      const footerHeight = document.querySelector(
        '.mail-editor-footer',
      ).clientHeight;
      const top = document
        .getElementsByClassName('editor')[0]
        .getBoundingClientRect().top;

      editorHeight.value = windowHeight - footerHeight - top - padding;
    };

    onMounted(() => {
      resizeObserver = new ResizeObserver(throttle(computeEditorHeight, 100));
      resizeObserver.observe(document.body);
      resizeObserver.observe(document.querySelector('.mail-editor-content'));
    });

    onUnmounted(() => {
      resizeObserver.disconnect();
    });

    editorConfig.MENU_CONF['uploadAttachment'] = {
      // server: "/api/upload", // 服务端地址
      // timeout: 5 * 1000, // 5s

      fieldName: 'custom-fileName',
      // meta: { token: "xxx", a: 100 }, // 请求时附加的数据
      // metaWithUrl: true, // meta 拼接到 url 上
      // headers: { Accept: "text/x-json" },

      maxFileSize: 10 * 1024 * 1024, // 10M
      onBeforeUpload(file) {
        console.log('onBeforeUpload', file);
        return file; // 上传 file 文件
        // return false // 会阻止上传
      },
      onProgress(progress) {
        console.log('onProgress', progress);
      },
      onSuccess(file, res) {
        console.log('onSuccess', file, res);
      },
      onFailed(file, res) {
        alert(res.message);
        console.log('onFailed', file, res);
      },
      onError(file, err, res) {
        alert(err.message);
        console.error('onError', file, err, res);
      },

      // 上传成功后，用户自定义插入文件
      customInsert(res, file, insertFn) {
        console.log('customInsert', res);
        const { url } = res.data || {};
        if (!url) throw new Error('url is empty');

        // 插入附件到编辑器
        insertFn(`customInsert-${file.name}`, url);
      },

      // 用户自定义上传
      customUpload(file, insertFn) {
        console.log('customUpload', file);

        return new Promise((resolve) => {
          // 插入一个文件，模拟异步
          setTimeout(() => {
            const src = 'https://www.w3school.com.cn/i/movie.ogg';
            insertFn(`customUpload-${file.name}`, src);
            resolve('ok');
          }, 500);
        });
      },
    };

    return {
      editor,
      html,
      editorConfig,
      toolbarConfig,
      mode,
      editorHeight,
      onCreated,
    };
  },

  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
};
</script>

<style lang="scss">
@import "@wangeditor/editor/dist/css/style.css";

.email-editor-content-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 0;

  // 编辑器样式自定义
  --w-e-toolbar-bg-color: #fafafc;
  .w-e-text-placeholder {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    color: #9999a3;
  }

  .toolbar {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 36px;
    background: #fafafc;
    border-radius: 4px;
    border: 1px solid #ebebf0;
  }
  .editor {
    overflow-y: hidden;
    margin-top: 16px;
  }
}
</style>
