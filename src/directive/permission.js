/*
 * @Author: zhaozhuo
 * @Date: 2022-07-13 10:25:38
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-15 17:16:26
 * @Description: ...
 */
import { getSessionStorageData } from '@/utils/storage.js'

function checkPermission (el, binding) {
  const { value } = binding

  if (value && typeof value === 'object') {
    const action = binding.value.action
    // 按钮权限数据
    loopFn({ action, el })
  } else {
    // 指令使用方式  v-permission="{ action: 'shipment.application:detail',effect:'disabled' }"
    throw new Error(
      'need permission! Like v-permission="{ action: \'shipment.application:detail\',effect:\'disabled\' }"'
    )
  }
}

function loopFn (params) {
  const authList = getSessionStorageData('authList')
  if (authList !== null) {
    const { action, el } = params
    const authListPath = authList.map(auth => auth.path)
    if (authListPath) {
      if (authListPath.indexOf(action) === -1) {
        // 不具备权限
        el.classList.add('permission-disabled')
        const parentEle = el.parentNode
        if (parentEle && el) {
          el.style.pointerEvents = 'none'
        }
      }
    }
  } else {
    setTimeout(() => {
      loopFn(params)
    }, 100)
  }
}

export default {
  mounted (el, binding) {
    checkPermission(el, binding)
  },
  updated (el, binding) {
    checkPermission(el, binding)
  }
}
