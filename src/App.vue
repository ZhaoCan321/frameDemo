<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-08 10:03:56
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-15 17:18:49
 * @Description: ...
-->
<template>
  <router-view></router-view>
</template>

<script>
import { onMounted } from 'vue'
import { setSessionStorageData } from '@/utils/storage.js'
import { getAllPadsUserButtonPermissions, getLoginUserNameInfo } from '@/api/inspectionSheet.js'
import packageJSON from '../package.json'

export default {
  name: 'App',
  setup () {
    onMounted(() => {
      if (process.env.NODE_ENV === 'production') {
        window.addEventListener('flutterInAppWebViewPlatformReady', (event) => {
          getPermission(packageJSON.name)
          getCurrentLoginInfo()
        })
      } else {
        getPermission(packageJSON.name)
        getCurrentLoginInfo()
      }
    })

    const getPermission = (appId) => {
      getAllPadsUserButtonPermissions()
        .then(res => {
          const authList = res.data.filter(item => item.parentId === appId)
          setSessionStorageData('authList', authList)
        })
    }

    const getCurrentLoginInfo = () => {
      getLoginUserNameInfo()
        .then(res => {
          setSessionStorageData('curLoginInfo', res.data)
        })
    }
  }
}
</script>

<style>

#app {
  width: 100vw;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  outline: none;
  -webkit-tag-highlight-color: transparent;
}
</style>
