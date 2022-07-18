/*
 * @Author: zhaozhuo
 * @Date: 2022-07-08 11:40:51
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-15 09:55:48
 * @Description: ...
 */
import axios from 'axios'
import { getToken, getTokenType } from '@/utils/storage.js'
import { Toast } from 'vant'

const service = axios.create({
  withCredentials: true,
  timeout: 15000
})

let toast = null
let requestNumLoading = 0
const showLoading = () => {
  if (requestNumLoading === 0) {
    toast = Toast.loading({
      duration: 0,
      overlay: true,
      forbidClick: true
    })
  }
  requestNumLoading++
}
const closeLoading = () => {
  requestNumLoading = Math.max(0, --requestNumLoading)
  if (requestNumLoading === 0) {
    toast.clear()
  }
}

// 请求拦截
service.interceptors.request.use(
  config => {
    // loading
    if (config.headers.showLoading) {
      showLoading()
    }
    // 设置token
    config.headers.Authorization = getTokenType() + ' ' + getToken()
    // pad 端的baseUrl 可能会随时改变
    config.baseURL =
      process.env.NODE_ENV === 'development'
        ? process.env.VUE_APP_NGINX_PATH
        : localStorage.getItem('baseUrl') + '/factory/v1'
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    // loading
    if (response.config.headers.showLoading) {
      closeLoading()
    }
    // 处理数据
    const { data: { code, message } } = response
    if (+code !== 200) {
      Toast.fail({
        message: (message || '获取数据失败') + response.config.url
      })
      return Promise.reject(new Error(message || 'Error'))
    } else {
      return response.data
    }
  },
  error => {
    if (error.config.headers.showLoading) {
      closeLoading()
    }
    Toast.fail({
      message: (error.message || '请求错误') + error.config.url
    })
    return Promise.reject(error)
  }
)

export default service
