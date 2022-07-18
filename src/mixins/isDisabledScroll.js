/*
 * @Author: zhaozhuo
 * @Date: 2022-05-07 11:44:21
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-15 18:24:55
 * @Description: ...
 */

import { onMounted, onBeforeUnmount, nextTick, watch, ref } from 'vue'

const useIsDisabledScroll = (scrollCls) => {
  const scrollElement = ref(null)
  const scrollTop = ref(0)
  const isRefreshDisable = ref(false)

  onMounted(() => {
    nextTick(() => {
      resolveConflict()
    })
  })

  onBeforeUnmount(() => {
    scrollElement.value.removeEventListener('touchmove', () => {})
    scrollElement.value.removeEventListener('touchend', () => {})
  })

  watch(scrollTop, (newval) => {
    if (newval > 0) {
      isRefreshDisable.value = true
    } else {
      isRefreshDisable.value = false
    }
  })

  const resolveConflict = () => {
    const scrollEle = scrollElement.value = document.querySelector(scrollCls)

    scrollEle.addEventListener('touchmove', () => {
      scrollTop.value = scrollEle.scrollTop
    })
    scrollEle.addEventListener('touchend', () => {
      scrollTop.value = scrollEle.scrollTop
    })
  }

  return {
    scrollTop,
    isRefreshDisable
  }
}

export default useIsDisabledScroll
