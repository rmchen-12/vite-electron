<template>
  <div class="mail-editor">
    <!-- <Header :mTitle="mTitle"></Header> -->
    <Content></Content>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './header/index.vue';
import Divider from '../detail/divider.vue';
import Content from './content/index.vue';
import Footer from './footer/index.vue';
import { provide, ref, toRefs } from 'vue';

export default {
  components: { Header, Divider, Content, Footer },
  setup(props) {
    const { mTitle } = toRefs(props);
    const a = ref(mTitle);
    const updateMTitle = (newValue) => {
      a.value = newValue;
    };
    provide('mTitle', a);
    provide('updateMTitle', updateMTitle);
  },
};
</script>

<style lang="scss">
.mail-editor {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  height: 100vh;
  background: #f6f7fb;
  padding: 0 20px;
}
</style>
