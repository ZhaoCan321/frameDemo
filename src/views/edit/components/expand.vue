<!--
 * @Author: zhaozhuo
 * @Date: 2022-06-17 17:35:12
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-12 15:34:14
 * @Description: ...
-->
<template>
  <div class="base-info">
    <div class="title van-hairline--bottom">
      <div class="text">
        <span class="mark" />
        <span>{{ title }}</span>
      </div>
    </div>
    <div class="info-box">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  },
  setup () {

  }
}
</script>

<style lang="scss" scoped>
.base-info {
  padding: 0 6px;
  margin-bottom: 14px;
  color: #333333;
  background: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    padding: 9px 0;
    font-size: 16px;
    .text {
      display: flex;
      align-items: center;
      font-weight: 500;
      .mark {
        display: inline-block;
        width: 4px;
        height: 16px;
        margin-right: 6px;
        background: linear-gradient(180deg, #3E9CFF 0%, #3173B8 100%);
        border-radius: 2px;
      }
    }
  }
}
</style>
