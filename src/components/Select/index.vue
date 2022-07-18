<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-11 09:08:00
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-14 11:20:01
 * @Description: ...
-->
<template>
  <van-field
    v-model="result"
    is-link
    readonly
    :label="label"
    placeholder="点击选择内容"
    :required="required"
    :rules="rules"
    :disabled="disabled"
    @click="showPicker"
  >
    <template #right-icon>
      <slot name="extra"></slot>
    </template>
  </van-field>
  <van-popup v-model:show="isShowPicker" position="bottom">
    <van-picker
      ref="pickerEle"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="isShowPicker = false"
    />
  </van-popup>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'Select',
  props: {
    label: {
      type: String,
      required: true
    },
    columns: Array,
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      defualt: false
    },
    modelValue: [String, Number]
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    const result = ref('')
    const pickerEle = ref(null)
    const isShowPicker = ref(false)

    // pickerEle 初始的时候不会加载，只有在第一次点击的时候才会获取到 pickerEle
    watch([() => props.modelValue, () => props.columns, isShowPicker], ([nVal, nCol, nShow]) => {
      if (nVal && nCol.length) {
        const index = nCol.findIndex(item => item.value === nVal)
        result.value = nCol[index]?.text || props.modelValue
        pickerEle?.value?.setIndexes([index])
      } else if (nVal && nCol.length === 0) {
        result.value = props.modelValue
      } else if (!nVal) {
        result.value = ''
        pickerEle?.value?.setIndexes([0])
      }
    }, { flush: 'post', deep: true })

    const onConfirm = (option) => {
      result.value = option?.text
      isShowPicker.value = false
      emit('update:modelValue', option?.value)
      emit('change', option?.value)
    }

    const showPicker = () => {
      if (!props.disabled) {
        isShowPicker.value = true
      }
    }

    return {
      result,
      pickerEle,
      isShowPicker,
      showPicker,
      onConfirm
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.van-picker-column__item--selected) {
  background: #f9f9f9;
}
</style>
