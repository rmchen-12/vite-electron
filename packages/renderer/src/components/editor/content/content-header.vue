<template>
  <div class="mail-editor-content-header">
    <ContentHeaderSelect
      label="收件人"
      v-model="receiveList"
      :cantacts="cantacts"
    />
    <ContentHeaderSelect
      label="抄送人"
      actionText="密送"
      v-model="ccList"
      :isBccShow="isBccShow"
      :cantacts="cantacts"
      @showBcc="showBcc"
    />
    <ContentHeaderSelect
      v-if="isBccShow"
      v-model="bccList"
      :cantacts="cantacts"
      label="密送"
    />
    <ContentHeaderInput label="主题" v-model="inputMessage" />
  </div>
</template>

<script>
import { inject, ref, watch, onBeforeMount } from 'vue';
import ContentHeaderInput from './content-header-input.vue';
import ContentHeaderSelect from './content-header-select.vue';
export default {
  components: { ContentHeaderInput, ContentHeaderSelect },
  setup() {
    const updateMTitle = inject('updateMTitle');
    const isBccShow = ref(false);
    const inputMessage = ref('asdf');
    const cantacts = ref([]);
    const receiveList = ref([]);
    const ccList = ref([]);
    const bccList = ref([]);

    onBeforeMount(() => {
      setTimeout(() => {
        cantacts.value = [
          { email: 'aaa@qq.com', name: 'aaa' },
          { email: 'bbb@qq.com', name: 'bbb' },
          { email: 'ccc@qq.com', name: 'ccc' },
          { email: 'ddd@qq.com', name: 'ddd' },
          { email: 'eee@qq.com', name: 'eee' },
          { email: 'aaabbbccc@qq.com', name: 'abc' },
        ];
      }, 1000);
    });

    const showBcc = () => {
      isBccShow.value = true;
    };

    watch(inputMessage, (newValue) => updateMTitle(newValue));
    watch(receiveList, (newValue) => {
      cantacts.value = cantacts.value.filter(
        (v) => !newValue.includes(v.email),
      );
    });
    watch(ccList, (newValue) => {
      cantacts.value = cantacts.value.filter(
        (v) => !newValue.includes(v.email),
      );
    });
    watch(bccList, (newValue) => {
      cantacts.value = cantacts.value.filter(
        (v) => !newValue.includes(v.email),
      );
    });

    return {
      showBcc,
      isBccShow,
      inputMessage,
      cantacts,
      ccList,
      bccList,
      receiveList,
    };
  },
};
</script>

<style lang="scss">
.mail-editor-content-header {
}
</style>
