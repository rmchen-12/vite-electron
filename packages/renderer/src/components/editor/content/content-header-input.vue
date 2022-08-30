<template>
  <div class="mail-editor-content-header-input">
    <div class="label-wrapper">
      <span class="label">{{ label }}</span>
    </div>
    <div class="symbol">：</div>
    <input class="input-box" :value="inputValue" @input="inputChange" />
    <div v-if="!isBccShow" class="action" @click="click">{{ actionText }}</div>
    <div class="border"></div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'inputValue',
    event: 'change',
  },
  props: {
    label: {
      type: String,
      require: true,
    },
    inputValue: String,
    actionText: {
      type: String,
    },
    isBccShow: Boolean,
  },
  setup(props, { emit }) {
    const click = () => emit('showBcc');
    const inputChange = (event) => {
      emit('change', event.target.value);
    };

    return { click, inputChange };
  },
};
</script>

<style lang="scss">
.mail-editor-content-header-input {
  display: flex;
  align-items: center;
  padding: 10px 0 8px 0;
  position: relative;

  .label-wrapper {
    text-align: justify;
    text-align-last: justify;
  }
  .label {
    display: inline-block;
    width: 44px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #62626e;
    text-align: justify;
  }
  .symbol {
    display: inline-block;
    width: 14px;
    color: #62626e;
    vertical-align: middle;
    font-weight: 400;
  }
  .input-box {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    color: #0d0d1a;
    margin-bottom: -1px;
  }
  .border {
    position: absolute;
    bottom: 0;
    height: 1px;
    width: 100%;
    background: #ebebf0;
  }
}
</style>
