<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-08 14:33:44
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-18 09:28:50
 * @Description: ...
-->
<template>
  <CommonHeader title="送检单编辑" />
  <CommonMain>
    <div class="detail-box">
      <Expand title="基本信息">
        <van-form ref="formEle">
          <van-cell-group inset>
            <van-field
              v-model="form.inspectionSheetCode"
              name="inspectionSheetCode"
              label="送检单号"
              placeholder="请输入"
              disabled
              required
              :rules="[{ required: true, message: '该参数必填' }]"
            />
            <van-field
              v-model="form.materialName"
              name="materialName"
              label="物料名称"
              disabled
              readonly
              placeholder="--"
            />
            <van-field
              v-if="materialCodeFlag"
              v-model="form.materialCode"
              name="materialCode"
              label="物料编码"
              disabled
              placeholder="--"
            />
            <Select v-else label="物料编码" :disabled="forbidClick" :columns="formList.productMaterialList" v-model="form.materialCode" @change="changeMaterialCode" />
            <van-field
              v-model="form.materialStandard"
              name="materialStandard"
              label="物料规格"
              disabled
              placeholder="--"
            />
            <Select
              v-model="form.status"
              label="送检状态"
              :columns="formList.checkStatusList"
              :disabled="checkState"
            />
            <Select
              v-model="form.inspectionSheetType"
              label="送检类型"
              :columns="formList.unitTypeList"
              :disabled="forbidClick"
              required
              :rules="[{ required: true, message: '该参数必填' }]"
              @change="changeType"
            />
            <Select
              v-model="form.documentType"
              label="关联单据类型"
              :columns="formList.checkTypeList"
              :disabled="forbidClick"
              required
              :rules="[{ required: true, message: '该参数必填' }]"
             />
            <Select
              v-model="form.workOrderNumber"
              label="关联单据编码"
              :columns="formList.checkCodeList"
              :disabled="forbidClick"
              required
              :rules="[{ required: true, message: '该参数必填' }]"
              @change="changeWorkOrderNumber"
            >
              <template #extra v-if="!forbidClick">
                <Scanner @handleScanRes="handleScanWorkOrderNumber" />
              </template>
            </Select>
            <Select
              v-model="form.barCode"
              label="批号"
              :columns="formList.barCodeList"
              :required="barCodeFlag"
              :rules="[{ required: barCodeFlag, message: '该参数必填' }]"
              :disabled="forbidClick"
            >
              <template #extra v-if="!forbidClick">
                <Scanner @handleScanRes="handleScanBarCode" />
              </template>
            </Select>
            <Select
              v-model="form.qualityInspectionSchemeId"
              label="检测方案"
              :columns="formList.qualityInspectionSchemeNameList"
              :disabled="initStatus != 1"
              required
              :rules="[{ required: true, message: '该参数必填' }]"
            />
            <Select :disabled="forbidClick" label="送检人" :columns="formList.checkPeopleList" v-model="form.inspectionPersion" />
            <DateSelect :disabled="forbidClick" :formateVal="formateDateVal" label="生产日期" type="date" v-model="form.productTime" />
            <DateSelect :disabled="forbidClick" :formateVal="formateDateVal" label="送检日期" type="date" v-model="form.inspectionTime" />

            <van-field
              v-model="form.samplePoint"
              name="取样点"
              label="取样点"
              :disabled="forbidClick"
              placeholder="请输入"
            />
            <van-field :disabled="forbidClick" class="production-quantity" name="生产数量以报工为准" label="生产数量以报工为准">
              <template #right-icon>
                <van-switch v-model="form.isProductionQuantity" :disabled="forbidClick" size="20" active-color="#13ce66" inactive-color="#ee0a24" />
              </template>
            </van-field>
            <van-field
              v-show="!form.isProductionQuantity"
              v-model="form.productionQuantity"
              name="生产数量"
              label="生产数量"
              placeholder="请输入"
              :disabled="forbidClick"
            />
            <van-field
              v-model="form.samplingPerson"
              name="取样人"
              label="取样人"
              placeholder="请输入"
              :disabled="forbidClick"
            />
            <van-field
              v-model="form.sampQuantity"
              name="取样数量"
              label="取样数量"
              placeholder="请输入"
              :disabled="forbidClick"
            />
          </van-cell-group>
        </van-form>
      </Expand>

      <Expand title="备注">
        <van-field
          v-model="form.remark"
          rows="3"
          label=""
          type="textarea"
          placeholder="请输入备注信息"
          :disabled="forbidClick"
        />
      </Expand>

      <ConfigData ref="configEle" :initData="extendData" />
    </div>
    <div class="footer">
      <van-icon v-permission="{ action: 'product.inspection.sheet:delete' }" v-if="form.status === 1" name="delete-o" color="#ee0a24" size="24" @click="deleteItem" />
      <van-icon v-permission="{ action: 'product.inspection.sheet:delete' }" v-if="form.status !== 1" name="delete-o" color="#ee0a24" size="24" style="opacity: 0.5;" />
      <van-button :disabled="saveDisabled" v-permission="{ action: 'product.inspection.sheet:update' }" type="primary" block size="small" @click="saveItem">保存</van-button>
    </div>
  </CommonMain>
</template>

<script>
import { reactive, toRefs, ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast, Dialog } from 'vant'
import {
  getCheckType,
  getCheckUnitType,
  getBarCode,
  getInspectsheetsGetQualitySchemes,
  getCheckPerson,
  getCheckCode,
  getProcessMaterialInfo,
  deleteCheckSheet,
  getCheckUnitStatus,
  editCheckUnit,
  checkSheetDetail
} from '@/api/inspectionSheet.js'
import { getSessionStorageData } from '@/utils/storage.js'

import Select from '@/components/Select/index.vue'
import DateSelect from '@/components/DateSelect/index.vue'
import Scanner from '@/components/Scanner/index.vue'
import Expand from './components/expand.vue'
import ConfigData from './components/configData.vue'

export default {
  name: 'Edit',

  components: {
    Select,
    DateSelect,
    Scanner,
    Expand,
    ConfigData
  },

  setup (props, ctx) {
    const router = useRouter()
    const route = useRoute()

    const formEle = ref(null)
    const configEle = ref(null)
    const datas = reactive({
      isShowDelete: false,
      form: {
        inspectionSheetCode: '',
        materialId: '',
        cloneMaterialId: '',
        materialName: '',
        materialCode: '',
        materialStandard: '',
        status: '',
        inspectionSheetType: 2,
        documentType: 1,
        workOrderNumber: '',
        barCode: '',
        qualityInspectionSchemeId: '',
        inspectionPersion: '',
        productTime: '',
        inspectionTime: '',
        samplePoint: '',
        isProductionQuantity: false,
        productionQuantity: '',
        samplingPerson: '',
        sampQuantity: '',
        remark: ''
      },
      formList: {
        unitTypeList: [], // 送检单类型
        checkTypeList: [], // 关联单据类型
        checkCodeList: [], // 关联单据编码
        productMaterialList: [], // 物料编码
        barCodeList: [], // 批次号
        qualityInspectionSchemeNameList: [], // 检测方案
        checkPeopleList: [], // 送检人
        checkStatusList: [] // 送检状态
      },
      workOrderParams: null,
      materialCodeFlag: true,
      barCodeFlag: true,
      forbidClick: false,
      checkState: false,
      initStatus: '',
      extendData: {},
      saveDisabled: false
    })

    onMounted(() => {
      getCheckStatusList()
      getCheckUnitTypeList()
      getCheckTypeList()
      getCheckCodeList()
      getCheckPersonList()
    })

    const changeType = (nVal) => {
      // 过程检验1，成品检验2
      // 如果 过程检测、首件检验、末件检验 则获取检测方案，物料数据， 填写物料内容, 不校验批号
      // 如果 成品检验 则获取物料单号，填写物料内容， 校验批号
      if (nVal === 1 || nVal === 3 || nVal === 4) {
        datas.materialCodeFlag = false
        datas.barCodeFlag = false
        if (datas.workOrderParams) {
          getProcessMaterialInfoList({
            materialCode: datas.workOrderParams.materialCode
          })
        }
      } else if (nVal === 2) {
        datas.materialCodeFlag = false
        datas.barCodeFlag = true

        datas.form.materialId = datas.workOrderParams.materialId
        datas.form.materialCode = datas.workOrderParams.materialCode
        datas.form.materialName = datas.workOrderParams.materialName
        datas.form.materialStandard = datas.workOrderParams.materialStandard
      }
    }
    // watch(() => datas.form.inspectionSheetType, (nVal) => {
    // })

    const changeWorkOrderNumber = (val) => {
      if (val) {
        const params = datas.formList.checkCodeList.filter(
          item => item.workOrderNumber === val
        )[0]
        datas.workOrderParams = params

        const workOrderNumber = params.workOrderNumber
        datas.form.materialId = params.materialId || ''
        const materialCode = params.materialCode
        const materialStandard = params.materialStandard
        const materialName = params.materialName
        if (!datas.form.inspectionSheetType) {
          Toast.fail('请先选择送检类型')
        } else if (datas.form.inspectionSheetType === 1) { // 过程检验
          // 过程检验获取半成品物料信息
          const query = {
            materialCode
          }
          getProcessMaterialInfoList(query)
        } else if (datas.form.inspectionSheetType === 2) { // 成品检验
          datas.form.materialCode = materialCode
          datas.form.materialName = materialName
          datas.form.materialStandard = materialStandard
        }
        // 根据工单号查询批次号
        getBarCodeList(workOrderNumber)
      } else {
        // 清理 关联项
        datas.form.qualityInspectionSchemeId = ''
        datas.form.materialCode = ''
        datas.form.materialName = ''
        datas.form.materialStandard = ''
        datas.formList.qualityInspectionSchemeNameList = []
        datas.formList.productMaterialList = []
      }
    }

    // watch(() => datas.form.workOrderNumber, (val) => {
    // })

    const changeMaterialCode = (val) => {
      if (!datas.materialCodeFlag) {
        const code = datas.formList.productMaterialList.filter(item => item.code === val)
        datas.form.materialId = code[0].id
        datas.form.materialStandard = code[0].standard
        datas.form.materialName = code[0].name
      }
    }
    // watch(() => datas.form.materialCode, (val) => {
    // })

    watch(() => datas.form.materialId, (nVal) => {
      datas.form.qualityInspectionSchemeId = ''
      datas.formList.qualityInspectionSchemeNameList = []
      datas.formList.checkPlanDataList = []
      getInspectsheetsGetQualitySchemesList(nVal)
    })

    // 获取详情
    const getCheckSheetDetail = () => {
      const { id } = route.query
      checkSheetDetail(id).then(res => {
        const detailData = res.data
        datas.form.inspectionSheetCode = detailData.inspectionSheetCode
        datas.form.inspectionSheetType = detailData.inspectionSheetType
        datas.form.inspectionPersion = detailData.inspectionPersion
        datas.form.status = detailData.status
        datas.initStatus = detailData.status

        if (detailData.inspectionSheetType === 1) {
          datas.materialCodeFlag = false
          datas.barCodeFlag = false
          getProcessMaterialInfoList({
            materialCode: detailData.materialCode
          }, false)
        } else if (detailData.inspectionSheetType === 2) {
          datas.materialCodeFlag = true
          datas.barCodeFlag = true
        }

        const extendData = JSON.parse(detailData.extend)
        if (extendData) {
          datas.form.samplingQuantity = extendData.samplingQuantity
          datas.form.samplingPerson = extendData.samplingPerson
          datas.form.sampQuantity = extendData.sampQuantity
          datas.form.productionQuantity = extendData.isProductionQuantity ? '' : extendData.productionQuantity
          datas.form.isProductionQuantity = extendData.isProductionQuantity

          datas.extendData.batchNumber = {
            key: 'batchNumber',
            value: extendData.batchNumber
          }
        }

        if (detailData.status === 1) {
          getInspectsheetsGetQualitySchemesList(detailData.materialId)
        }
        if (detailData.status === 2) {
          datas.forbidClick = true
          datas.extendData.batchNumber.disabled = true
          datas.formList.qualityInspectionSchemeNameList = [
            {
              text: detailData.qualityInspectionSchemeName,
              value: detailData.qualityInspectionSchemeId
            }
          ]
        }
        if (detailData.status === 4 || detailData.status === 3) {
          datas.checkState = true
          datas.forbidClick = true
          datas.extendData.batchNumber.disabled = true
          datas.formList.qualityInspectionSchemeNameList = [
            {
              text: detailData.qualityInspectionSchemeName,
              value: detailData.qualityInspectionSchemeId
            }
          ]
        } else {
          datas.checkState = false
        }

        datas.form.cloneMaterialId = detailData.materialId
        datas.form.workOrderNumber = detailData.workOrderNumber
        datas.form.documentType = detailData.documentType
        datas.form.materialCode = detailData.materialCode
        datas.form.materialStandard = detailData.materialStandard
        datas.form.materialName = detailData.materialName
        datas.form.barCode = detailData.barCode
        datas.form.productTime = detailData.productTime
        datas.form.inspectionTime = detailData.inspectionTime
        datas.form.samplePoint = detailData.samplePoint
        datas.form.inspectionSheetId = detailData.inspectionSheetId
        datas.form.qualityInspectionSchemeId = detailData.qualityInspectionSchemeId
        datas.form.qualityInspectionSchemeName = detailData.qualityInspectionSchemeName
        datas.form.remark = detailData.remark

        datas.formList.checkStatusList.forEach(el => {
          if (+el.code < detailData.status) {
            el.disabled = true
          } else if (detailData.status === 1) {
            datas.formList.checkStatusList[2].disabled = true
          } else if (detailData.status === 4) {
            datas.formList.checkStatusList[3].disabled = false
          } else if (detailData.status === 2) {
            datas.formList.checkStatusList[3].disabled = true
          }
          if (detailData.inspectionResultStatus === null || detailData.inspectionResultStatus === 0 || detailData.inspectionResultStatus === 1 || detailData.inspectionResultStatus === 4) {
            datas.formList.checkStatusList[3].disabled = false
          }
        })

        getWorkOrderParams()
      })
    }

    const getWorkOrderParams = () => {
      if (!datas.formList.checkCodeList.length || !datas.form.workOrderNumber) return
      datas.workOrderParams = datas.formList.checkCodeList.find(item => item.workOrderNumber === datas.form.workOrderNumber)
    }

    const getCheckStatusList = () => {
      getCheckUnitStatus().then(res => {
        datas.formList.checkStatusList = setColVal(res.data || [], 'name', 'code')
        getCheckSheetDetail()
      })
    }

    // 获取送检单类型
    const getCheckTypeList = () => {
      getCheckType().then(res => {
        datas.formList.unitTypeList = setColVal(res.data || [], 'name', 'code')
      })
    }

    // 获取关联单据类型
    const getCheckUnitTypeList = () => {
      getCheckUnitType().then(res => {
        datas.formList.checkTypeList = setColVal(res.data || [], 'name', 'code')
      })
    }

    // 获取关联单据编码
    const getCheckCodeList = () => {
      getCheckCode().then(res => {
        datas.formList.checkCodeList = setColVal(res.data || [], 'workOrderNumber', 'workOrderNumber')
        getWorkOrderParams()
      })
    }

    // 根据工单号获取批次号
    const getBarCodeList = (val) => {
      const params = {
        materialCode: datas.form.materialCode,
        current: '',
        size: ''
      }
      getBarCode(params, val).then(res => {
        datas.formList.barCodeList = setColVal(res.data.records || [], 'barCode', 'barCode')
      })
    }

    // 获取检测方案
    const getInspectsheetsGetQualitySchemesList = (materialId) => {
      const params = {
        id: materialId
      }
      getInspectsheetsGetQualitySchemes(params).then(res => {
        datas.formList.qualityInspectionSchemeNameList = setColVal(res.data || [], 'qualityInspectionSchemeName', 'qualityInspectionSchemeId')
      })
    }

    // 获取送检人
    const getCheckPersonList = () => {
      getCheckPerson().then(res => {
        const curLoginInfo = getSessionStorageData('curLoginInfo') || {}
        const resData = res.data || []
        const curItem = resData.find(item => item.username === curLoginInfo.username)
        if (curItem) {
          datas.formList.checkPeopleList = setColVal(resData, 'nickname', 'username')
        } else {
          resData.push(curItem)
          datas.formList.checkPeopleList = setColVal(resData, 'nickname', 'username')
        }
      })
    }

    // 过程检验获取半成品物料信息
    // 存在问题
    const getProcessMaterialInfoList = (params, isChangeMaterialId = true) => {
      getProcessMaterialInfo(params).then(res => {
        const productMaterialList = res.data || []

        datas.formList.productMaterialList = setColVal(productMaterialList, 'code', 'code')
        if (isChangeMaterialId) {
          datas.form.materialId = productMaterialList[0]?.id
        }
        datas.form.materialCode = productMaterialList[0]?.code
        datas.form.materialStandard = productMaterialList[0]?.standard
        datas.form.materialName = productMaterialList[0]?.name
      })
    }

    const setColVal = (arr, text, value) => {
      return arr.map(item => ({
        ...item,
        text: item[text],
        value: item[value]
      }))
    }

    // 删除
    const deleteItem = (row) => {
      Dialog.confirm({
        title: '提示',
        message: '是否删除该数据？'
      })
        .then(() => {
          deleteCheckSheet(datas.form.inspectionSheetId).then(res => {
            Toast({
              type: 'success',
              message: '删除成功',
              onClose: () => {
                router.go(-1)
              }
            })
          })
        })
        .catch(() => {
          // on cancel
        })
    }

    const saveItem = () => {
      formEle.value.validate().then(() => {
        datas.saveDisabled = true
        const params = {
          ...datas.form,
          materialId: datas.form.materialId ? datas.form.materialId : datas.form.cloneMaterialId
        }

        const extend = Object.assign({
          productionQuantity: datas.form.productionQuantity,
          samplingQuantity: datas.form.samplingQuantity,
          samplingPerson: datas.form.samplingPerson,
          sampQuantity: datas.form.sampQuantity,
          isProductionQuantity: datas.form.isProductionQuantity
        }, configEle.value ? configEle.value.form : {})
        params.extend = JSON.stringify(extend)

        editCheckUnit(params).then(() => {
          Toast({
            type: 'success',
            message: '修改成功',
            onClose: () => {
              router.go(-1)
            }
          })
        }).finally(() => {
          datas.saveDisabled = false
        })
      })
    }

    const formateDateVal = (valArr) => {
      return valArr.slice(0, 3).join('-')
    }

    // 扫描单据编码
    const handleScanWorkOrderNumber = (res) => {
      datas.form.workOrderNumber = res
    }

    // 扫描批号
    const handleScanBarCode = (res) => {
      datas.form.barCode = res
    }

    return {
      ...toRefs(datas),
      formEle,
      configEle,
      changeType,
      changeWorkOrderNumber,
      changeMaterialCode,
      deleteItem,
      saveItem,
      formateDateVal,
      handleScanWorkOrderNumber,
      handleScanBarCode
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.van-field__body > input) {
  text-align: right;
}
:deep(.van-field__error-message) {
  text-align: right;
}
.detail-box {
  height: calc(100% - 16px);
  padding-bottom: 50px;
  margin: 8px 10px;
  overflow: auto;
  .base-info:last-child {
    margin-bottom: 0;
  }
  :deep(.van-cell-group) {
    margin: 0;
  }
  :deep(.van-field__label--required:before) {
    margin-left: -7px;
  }
  .production-quantity {
    :deep(.van-field__label) {
      width: 9.2em;
    }
  }
}
.footer {
  height: 50px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 14px;
  justify-content: space-around;
  background: #fff;
  :deep(.van-button--block) {
    width: 80%;
  }
}
</style>
