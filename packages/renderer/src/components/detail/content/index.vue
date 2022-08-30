<template>
  <div class="mail-detail-content">
    <ContentHeader
      :mTimeStamp="mTimeStamp"
      :mFromName="mFromName"
      :receiveList="receiveList"
      :ccList="ccList"
      :bccList="bccList"
      :mMailAddress="mMailAddress"
    ></ContentHeader>
    <ContentView :mBody="mBody"></ContentView>
  </div>
</template>

<script>
import ContentHeader from './content-header.vue';
import ContentView from './content-view.vue';
export default {
  components: { ContentHeader, ContentView },
  props: {
    mFromName: {
      type: String,
      default: '',
    },
    mTimeStamp: {
      type: String,
      require: true,
    },
    receiveList: {
      type: Array,
    },
    ccList: {
      type: Array,
    },
    bccList: {
      type: Array,
    },
    mMailAddress: {
      type: String,
      require: true,
    },
    mBody: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.mail-detail-content {
  flex: 1;
  overflow: auto;
  padding: 24px 0;
}
</style>
