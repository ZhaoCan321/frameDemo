<!--
 * @Author: piaopiao.huang
 * @Date: 2021-12-30 11:34:56
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-15 10:14:39
 * @Description: 公共布局
-->

<template>
  <div class="main-content">
    <slot />
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import { setSessionStorageData } from '@/utils/storage.js'

nextTick(() => {
  try {
    const main = document.querySelector('.main-content')
    if (process.env.NODE_ENV === 'development') {
      main.style.top = 67 + 'px'
      setSessionStorageData('statusBarHeight', 67)
    } else {
      window.flutter_inappwebview.callHandler('closeBarheight').then((res) => {
        window.flutter_inappwebview.callHandler('appBarheight').then((res2) => {
          main.style.top = res + res2 + 'px'
          setSessionStorageData('statusBarHeight', res + res2)
        })
      })
    }
  } catch (err) {
    console.error(err)
  }
})

</script>

<style lang="scss" scoped>
.main-content {
  width: 100%;
  position: absolute;
  top: 44px; // 默认顶部距离
  bottom: 0;
  box-sizing: border-box;
  background: #f5f6fa;
}
</style>
