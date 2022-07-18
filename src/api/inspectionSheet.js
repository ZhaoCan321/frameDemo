/*
 * @Author: zhaozhuo
 * @Date: 2022-07-08 14:14:26
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-18 11:45:52
 * @Description: ...
 */
import request from '@/utils/request'

// 获取小程序按钮权限列表接口
export function getAllPadsUserButtonPermissions () {
  return request({
    url: '/api/pads/user/button/permissions',
    method: 'get',
    headers: { showLoading: true },
  })
}

// 获取送检单列表
export function getCheckUnitList (params) {
  return request({
    url: '/api/inspectsheets/page',
    method: 'get',
    headers: { showLoading: true },
    params
  })
}

// 获取送检状态
export function getCheckUnitStatus () {
  return request({
    url: '/api/enums/get/status',
    method: 'get',
    headers: { showLoading: true }
  })
}

// 送检单类型
export function getCheckType (params) {
  return request({
    url: '/api/enums/get/type',
    method: 'get',
    headers: { showLoading: true },
    params
  })
}

// 获取送检单单据类型
export function getCheckUnitType (params) {
  return request({
    url: '/api/enums/get/doc/type',
    method: 'get',
    headers: { showLoading: true },
    params
  })
}

// 根据工单号获取批次号
export function getBarCode (params, orderNumber) {
  return request({
    url: `/api/bar/code/list/${orderNumber}`,
    method: 'get',
    headers: { showLoading: true },
    params
  })
}

// 查询检测方案
export function getInspectsheetsGetQualitySchemes (params) {
  return request({
    url: '/api/inspectsheets/get/quality/schemes',
    method: 'get',
    headers: { showLoading: true },
    params
  })
}

// 获取送检人下拉
export function getCheckPerson () {
  return request({
    url: '/api/users/list/by/company',
    method: 'get',
    headers: { showLoading: true }
  })
}

// 过程检验获取半成品物料信息
export function getProcessMaterialInfo (params) {
  return request({
    url: '/api/materials/semi/products',
    method: 'get',
    headers: { showLoading: true },
    params
  })
}

// 送检单删除
export function deleteCheckSheet (id) {
  return request({
    url: `/api/inspectsheets/delete/${id}`,
    method: 'delete',
    headers: { showLoading: true }
  })
}

// 关联单据编码（即查询质量检测的工单列表）
export function getCheckCode (params) {
  return request({
    url: '/api/workorders/quality/list',
    method: 'get',
    headers: { showLoading: true },
    params
  })
}

// 新增送检单
export function addCheckUnit (params) {
  return request({
    url: '/api/inspectsheets/add',
    method: 'post',
    headers: { showLoading: true },
    data: params
  })
}

// 获取展示组件内容名称
export function getCustomizationComponentName (params) {
  return request({
    url: '/api/customization/component/name/list',
    method: 'get',
    headers: { showLoading: true },
    params
  })
}

// 获取检测单详情
export function checkSheetDetail (id) {
  return request({
    url: `/api/inspectsheets/get/${id}`,
    method: 'get',
    headers: { showLoading: true }
  })
}

// 通过类型获取规则详情
export function getNumRuleDetailByType (params) {
  return request({
    url: '/api/numberRule/getDetailByType',
    method: 'get',
    params,
    headers: { showLoading: true }
  })
}

// 通过id获取规则详情
export function getNumRuleSeqByType (params) {
  return request({
    url: '/api/numberRule/getSeqByType',
    method: 'get',
    params,
    headers: { showLoading: true }
  })
}

// 获取当前登录人
export function getLoginUserNameInfo () {
  return request({
    url: '/api/users/info',
    method: 'get',
  })
}

// 编辑送检单
export function editCheckUnit (params) {
  return request({
    url: '/api/inspectsheets/update',
    method: 'put',
    data: params
  })
}
