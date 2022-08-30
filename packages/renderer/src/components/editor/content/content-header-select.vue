<template>
  <div class="mail-editor-content-header-select">
    <div class="label-wrapper">
      <span class="label">{{ label }}</span>
    </div>
    <div class="symbol">：</div>

    <div class="select-wrapper" ref="selectDOM">
      <el-select
        v-model="selectedEmail"
        value-key="email-select"
        style="width: 100%"
        multiple
        filterable
        allow-create
        default-first-option
        size="mini"
        :filter-method="chooseEmail"
        placeholder=""
        remote
        @change="selectChange"
        @remote-change="visibleChange"
      >
        <el-option
          v-for="item in emailList"
          :key="item.email"
          :label="item.name"
          :value="item.email"
        >
          <span v-html="item.renderStr"></span>
        </el-option>
      </el-select>
    </div>

    <div v-if="!isBccShow" class="action" @click="click">{{ actionText }}</div>
    <div class="border"></div>
  </div>
</template>

<script>
import { nextTick, onBeforeMount, reactive, ref, toRefs } from 'vue';
import { fuzzy } from './fuzzy';
import { validate } from './email-validator';

export default {
  model: {
    prop: 'selectedValue',
    event: 'selectedChange',
  },
  props: {
    label: {
      type: String,
      require: true,
    },
    actionText: String,
    isBccShow: Boolean,
    selectedValue: Array,
    cantacts: Array,
  },
  setup(props, { emit }) {
    const { cantacts } = toRefs(props);
    const selectDOM = ref(null);
    const emailList = ref([]);
    const selectedEmail = ref('');

    const selectChange = (value) => {
      emit('selectedChange', value);

      const verificationResults = value
        .map((v, index) => {
          if (validate(v)) {
            return;
          } else {
            return index;
          }
        })
        .filter((v) => v !== undefined);

      nextTick().then(() => {
        verificationResults.forEach((v) => {
          const invalidDOM = selectDOM.value.querySelectorAll('.el-tag')[v];
          invalidDOM.classList.add('invalid');
        });
      });
    };

    const chooseEmail = (query) => {
      const results = fuzzy.filter(String(query), cantacts.value, {
        pre: '<span style="color:#5D68E8">',
        post: '</span>',
        extract: (el) => el.email,
      });
      emailList.value = results.map((v) => ({
        renderStr: `${v.original.name} < ${v.string} > `,
        name: v.original.name,
        email: v.original.email,
      }));
    };

    const visibleChange = () => {
      selectChange(selectedEmail.value);
    };

    const click = () => emit('showBcc');

    return {
      click,
      selectDOM,
      emailList,
      chooseEmail,
      selectChange,
      selectedEmail,
      visibleChange,
    };
  },
};
</script>

<style lang="scss">
.mail-editor-content-header-select {
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
  .select-wrapper {
    margin-bottom: -2px;
    width: 100%;
  }
  .el-input__inner {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    color: #0d0d1a;
    padding: 0;
  }
  .el-select__input {
    margin-left: 0px;
  }
  .invalid {
    background: #000;
    color: #ffffff;
  }
  .action {
    position: absolute;
    right: 0;
    font-size: 14px;
    font-weight: 400;
    color: #7c7c86;
    padding-left: 10px;
    cursor: pointer;
    user-select: none;
    width: 38px;
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
