<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-13 09:30:11
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-13 12:22:25
 * @Description: ...
-->
<template>
  <span class="scan-box" @click.stop="handleScan">
    <img src="@/assets/images/common/scan_icon.png" alt="">
  </span>
</template>

<script>
export default {
  name: 'Scanner',

  emits: ['handleScanRes'],

  setup (props, { emit }) {
    const handleScan = () => {
      if (process.env.NODE_ENV === 'production') {
        window.flutter_inappwebview.callHandler('qrCode').then(res => {
          if (res) {
            emit('handleScanRes', res)
          }
        })
      } else {
        emit('handleScanRes', '123456')
      }
    }

    return {
      handleScan
    }
  }
}
</script>

<style lang="scss" scoped>
.scan-box {
  display: flex;
  align-items: center;
  padding: 0 5px;
  img {
    width: 15px;
  }
}
</style>
