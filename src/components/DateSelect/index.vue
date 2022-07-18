<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-11 09:08:00
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-14 11:20:48
 * @Description: ...
-->
<template>
  <van-field
    v-model="result"
    is-link
    readonly
    :label="label"
    placeholder="点击选择内容"
    :disabled="disabled"
    @click="showPicker"
  />
  <van-popup v-model:show="isShowPicker" position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      ref="datePickerEle"
      :type="type"
      @confirm="onConfirm"
      @cancel="isShowPicker = false"
    />
  </van-popup>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'DateSelect',
  props: {
    type: String,
    label: {
      type: String,
      required: true
    },
    initData: String,
    modelValue: String,
    formateVal: Function,
    disabled: {
      type: Boolean,
      defualt: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const currentDate = ref(new Date())
    const datePickerEle = ref(null)
    const result = ref(null)
    const isShowPicker = ref(false)
    let pickerInstance = null

    watch([() => props.modelValue, isShowPicker], ([nVal, nShow]) => {
      if (nVal) {
        result.value = nVal
        currentDate.value = new Date(props.modelValue)
      } else if (!nVal) {
        result.value = ''
        currentDate.value = new Date()
      }
    }, { flush: 'post', deep: true })

    const onConfirm = (option) => {
      const picker = getPicker()
      const valArr = picker.getValues()
      result.value = props.formateVal(valArr)
      isShowPicker.value = false
      emit('update:modelValue', result.value)
    }

    const getPicker = () => {
      if (pickerInstance) {
        return pickerInstance
      } else {
        pickerInstance = datePickerEle.value.getPicker()
        return pickerInstance
      }
    }

    const showPicker = () => {
      if (!props.disabled) {
        isShowPicker.value = true
      }
    }

    return {
      result,
      datePickerEle,
      currentDate,
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
