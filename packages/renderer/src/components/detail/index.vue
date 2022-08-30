<template>
  <div class="mail-detail">
    <div class="pr-24">
      <Header
        :mTitle="mTitle"
        :isDraft="isDraft"
        :isDeleted="isDeleted"
      ></Header>
    </div>
    <div class="pr-24"><Divider></Divider></div>

    <Content
      :mTimeStamp="mTimeStamp"
      :mFromName="mFromName"
      :receiveList="receiveList"
      :ccList="ccList"
      :bccList="bccList"
      :mMailAddress="mMailAddress"
      :mBody="mBody"
    ></Content>

    <Footer v-if="!isDraft"></Footer>
    <div v-else class="pb-150 pr-24">
      <Divider></Divider>
    </div>
  </div>
</template>

<script>
import Header from './header/index.vue';
import Divider from './divider.vue';
import Content from './content/index.vue';
import Footer from './footer/index.vue';
export default {
  name: 'Detail',
  components: { Header, Divider, Content, Footer },
  data() {
    return {};
  },
  props: {
    // 发件人
    mFromName: {
      type: String,
      default: '',
    },
    // 用来查邮件的id
    messageId: {
      type: String,
      require: true,
    },
    // 回复id
    replyMessageId: {
      type: String,
      default: '',
    },
    // 邮件主题
    mTitle: {
      type: String,
      default: '',
    },
    mMailAddress: {
      type: String,
      default: '',
    },
    mTimeStamp: {
      type: String,
      default: '',
    },
    mBody: {
      type: String,
      default: '',
    },
    // 收件人
    receiveList: {
      type: Array,
    },
    // 抄送人
    ccList: {
      type: Array,
    },
    // 密送人
    bccList: {
      type: Array,
    },
    // 附件列表
    fileList: {
      type: Array,
    },
    // 已读/未读
    isRead: {
      type: Boolean,
      require: true,
    },
    // 是否草稿
    isDraft: {
      type: Boolean,
      require: true,
    },
    isDeleted: {
      type: Boolean,
      require: true,
    },
  },
  setup(props, { emit }) {},
};
</script>

<style lang="scss">
.mail-detail {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  height: 100%;
  padding: 16px 0 0 24px;

  .pr-24 {
    padding-right: 24px;
  }

  .pb-150 {
    padding-bottom: 150px;
  }
}
</style>
