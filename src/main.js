/*
 * @Author: zhaozhuo
 * @Date: 2022-07-08 10:03:56
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-15 09:10:29
 * @Description: ...
 */
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router/index.js'
import permission from '@/directive/permission.js'

// vant样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
// 样式
import '@/assets/css/reset.css'
import '@/assets/css/common.css'
// 组件
import CommonHeader from '@/components/CommonHeader/index.vue'
import CommonMain from '@/components/CommonMain/index.vue'

const app = createApp(App)

app.directive('permission', permission)
app.use(router)

app.component('CommonHeader', CommonHeader)
app.component('CommonMain', CommonMain)

app.mount('#app')
