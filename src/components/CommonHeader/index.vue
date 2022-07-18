<template>
  <header :style="{ background: backgroundColor }" class="common-header">
    <section class="status-bar" />
    <section class="common-header-content">
      <p class="left-box">
        <slot name="left">
          <img v-show="isShowBack" class="topImg" src="@/assets/images/common/back.png" @click="handleRouteLink" />
        </slot>
      </p>
      <p class="page-title">{{ title }}</p>
      <p class="right-box">
        <slot name="right" />
      </p>
    </section>
  </header>
</template>

<script setup>
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
// props
const props = defineProps({
  // 头部title 信息
  title: {
    type: String,
    require: true,
    default: ''
  },
  // 是否展示返回图标
  isShowBack: {
    type: Boolean,
    require: false,
    default: true
  },
  // 处理特殊路由
  specialRoute: {
    type: Object,
    require: false,
    default: () => {}
  },
  // 背景颜色
  backgroundColor: {
    type: String,
    require: false,
    default: 'linear-gradient(90deg, #7EB5FC 0%, #407CF5 100%);'
  }
})

// data
const router = useRouter()

nextTick(() => {
  try {
    const statusBar = document.querySelector('.status-bar')
    const appTile = document.querySelector('.common-header-content')
    if (process.env.NODE_ENV === 'development') {
      appTile.style.height = 43 + 'px'
      statusBar.style.height = 24 + 'px'
    } else {
      // 获取头部高度(右上角关闭按钮高度)
      window.flutter_inappwebview.callHandler('closeBarheight').then((res) => {
        if (res > 0) {
          appTile.style.height = res + 'px'
        }
      })
      // 获取顶部通知栏高度
      window.flutter_inappwebview.callHandler('appBarheight').then((res) => {
        if (res > 0) {
          statusBar.style.height = res + 'px'
        }
      })
    }
  } catch (err) {
    console.error(err)
  }
})

// methods
const handleRouteLink = () => {
  const { path = '' } = props.specialRoute || {}
  if (path.length === 0) {
    router.go(-1)
    return
  }
  router.push({ path: path })
}

</script>

<style lang="scss" scoped>
.common-header {
  width: 100vw;
  box-sizing: border-box;
  background: linear-gradient(90deg, #7eb5fc 0%, #407cf5 100%);
  .status-bar {
    width: 100%;
    background: transparent;
  }
  .common-header-content {
    width: 100%;
    height: 2.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      margin: 0;
    }
    .left-box,
    .right-box {
      width: 2.5625rem;
      text-align: center;

      img {
        width: 0.6875rem;
      }
    }

    .page-title {
      font-size: 1.125rem;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
