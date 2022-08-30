<template>
  <div class="mail-detail-content-header">
    <div class="left">
      <div class="left-item">
        <div class="left-item-label">发件人：</div>
        <div class="left-item-value">
          {{ mFromName }}
          <span class="left-item-value-address">({{ mMailAddress }})</span>
        </div>
      </div>

      <div v-if="receiveList.length > 0" class="left-item">
        <div class="left-item-label">收件人：</div>
        <div class="left-item-value">{{ receiveList.join("，") }}</div>
      </div>
      <div v-if="ccList.length > 0" class="left-item">
        <div class="left-item-label">抄件人：</div>
        <div class="left-item-value">{{ ccList.join("，") }}</div>
      </div>
      <div v-if="bccList.length > 0" class="left-item">
        <div class="left-item-label">密送人：</div>
        <div class="left-item-value">{{ bccList.join("，") }}</div>
      </div>
    </div>
    <div class="right">{{ timeStamp }}</div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    mTimeStamp: {
      type: String,
      require: true,
    },
    mFromName: {
      type: String,
      default: '',
    },
    receiveList: {
      type: Array,
      default: () => [],
    },
    ccList: {
      type: Array,
      default: () => [],
    },
    bccList: {
      type: Array,
      default: () => [],
    },
    mMailAddress: {
      type: String,
      require: true,
    },
  },
  computed: {
    timeStamp() {
      return dayjs(this.mTimeStamp).format('YYYY-MM-DD HH:mm:ss');
    },
  },
};
</script>

<style lang="scss">
.mail-detail-content-header {
  display: flex;
  justify-content: space-between;

  padding-right: 24px;

  .left {
    &-item {
      display: flex;
      padding-bottom: 12px;
      &-label {
        font-size: 14px;
        font-weight: 400;
        color: #62626e;
      }
      &-value {
        font-size: 14px;
        font-weight: 600;
        color: #0d0d1a;
        &-address {
          font-size: 14px;
          font-weight: 400;
          color: #212121;
        }
      }
    }
  }

  .right {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #9999a3;
  }
}
</style>
