<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-08 14:33:44
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-15 11:28:16
 * @Description: ...
-->
<template>
  <CommonHeader title="送检单新增" />
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
              required
              :rules="[{ required: true, message: '该参数必填' }]"
            />
            <van-field
              v-model="form.materialName"
              name="materialName"
              label="物料名称"
              readonly
              placeholder="--"
            />
            <van-field
              v-if="materialCodeFlag"
              v-model="form.materialCode"
              name="materialCode"
              label="物料编码"
              readonly
              placeholder="--"
            />
            <Select v-else label="物料编码" :columns="formList.productMaterialList" v-model="form.materialCode" />
            <van-field
              v-model="form.materialStandard"
              name="materialStandard"
              label="物料规格"
              readonly
              placeholder="--"
            />
            <Select
              v-model="form.inspectionSheetType"
              label="送检类型"
              :columns="formList.unitTypeList"
              required
              :rules="[{ required: true, message: '该参数必填' }]"
            />
            <Select
              v-model="form.documentType"
              label="关联单据类型"
              :columns="formList.checkTypeList"
              required
              :rules="[{ required: true, message: '该参数必填' }]"
            />
            <Select
              v-model="form.workOrderNumber"
              label="关联单据编码"
              :columns="formList.checkCodeList"
              required
              :rules="[{ required: true, message: '该参数必填' }]"
            >
              <template #extra>
                <Scanner @handleScanRes="handleScanWorkOrderNumber" />
              </template>
            </Select>
            <Select
              v-model="form.barCode"
              label="批号"
              :columns="formList.barCodeList"
              :required="barCodeFlag"
              :rules="[{ required: barCodeFlag, message: '该参数必填' }]"
            >
              <template #extra>
                <Scanner @handleScanRes="handleScanBarCode" />
              </template>
            </Select>
            <Select
              v-model="form.qualityInspectionSchemeId"
              label="检测方案"
              :columns="formList.qualityInspectionSchemeNameList"
              required
              :rules="[{ required: true, message: '该参数必填' }]"
            />
            <Select label="送检人" :columns="formList.checkPeopleList" v-model="form.inspectionPersion" />
            <DateSelect :formateVal="formateDateVal" label="生产日期" type="date" v-model="form.productTime" />
            <DateSelect :formateVal="formateDateVal" label="送检日期" type="date" v-model="form.inspectionTime" />
            <van-field
              v-model="form.samplePoint"
              name="取样点"
              label="取样点"
              placeholder="请输入"
            />
            <van-field class="production-quantity" name="生产数量以报工为准" label="生产数量以报工为准">
              <template #right-icon>
                <van-switch v-model="form.isProductionQuantity" size="20" active-color="#13ce66" inactive-color="#ee0a24" />
              </template>
            </van-field>
            <van-field
              v-show="!form.isProductionQuantity"
              v-model="form.productionQuantity"
              name="生产数量"
              label="生产数量"
              placeholder="请输入"
            />
            <van-field
              v-model="form.samplingPerson"
              name="取样人"
              label="取样人"
              placeholder="请输入"
            />
            <van-field
              v-model="form.sampQuantity"
              name="取样数量"
              label="取样数量"
              placeholder="请输入"
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
        />
      </Expand>

      <ConfigData ref="configEle" />
    </div>
    <div class="footer">
      <van-button :disabled="saveDisabled" type="primary" block size="small" @click="saveItem">保存</van-button>
    </div>

    <RulePopup :setOption="setInspectionSheetCode" />
  </CommonMain>
</template>

<script>
import { reactive, toRefs, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import {
  getCheckType,
  getCheckUnitType,
  getBarCode,
  getInspectsheetsGetQualitySchemes,
  getCheckPerson,
  getCheckCode,
  getProcessMaterialInfo,
  getCheckUnitStatus,
  addCheckUnit
} from '@/api/inspectionSheet.js'
import { getSessionStorageData } from '@/utils/storage.js'

import Select from '@/components/Select/index.vue'
import DateSelect from '@/components/DateSelect/index.vue'
import Scanner from '@/components/Scanner/index.vue'
import Expand from './components/expand.vue'
import ConfigData from './components/configData.vue'
import RulePopup from './components/rulePopup.vue'

export default {
  name: 'Add',

  components: {
    Select,
    DateSelect,
    Scanner,
    Expand,
    ConfigData,
    RulePopup
  },

  setup (props, ctx) {
    const router = useRouter()
    const formEle = ref(null)
    const configEle = ref(null)
    const datas = reactive({
      isShowDelete: false,
      form: {
        status: 1,
        inspectionSheetCode: '',
        materialName: '',
        materialCode: '',
        materialStandard: '',
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
      saveDisabled: false
    })

    onMounted(() => {
      getCheckStatusList()
      getCheckTypeList()
      getCheckUnitTypeList()
      getCheckCodeList()
      getCheckPersonList()
    })

    watch(() => datas.form.inspectionSheetType, (nVal) => {
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
    })

    watch(() => datas.form.workOrderNumber, (val) => {
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
    })

    watch(() => datas.form.materialCode, (val) => {
      if (!datas.materialCodeFlag) {
        const code = datas.formList.productMaterialList.filter(item => item.code === val)
        datas.form.materialId = code[0].id
        datas.form.materialStandard = code[0].standard
        datas.form.materialName = code[0].name
      }
    })

    watch(() => datas.form.materialId, (nVal) => {
      datas.form.qualityInspectionSchemeId = ''
      datas.formList.qualityInspectionSchemeNameList = []
      datas.formList.checkPlanDataList = []
      getInspectsheetsGetQualitySchemesList(nVal)
    })

    const getCheckStatusList = () => {
      getCheckUnitStatus().then(res => {
        datas.formList.checkStatusList = setColVal(res.data || [], 'name', 'code')
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
    const getProcessMaterialInfoList = (params) => {
      getProcessMaterialInfo(params).then(res => {
        const productMaterialList = res.data || []

        datas.formList.productMaterialList = setColVal(productMaterialList, 'code', 'code')
        datas.form.materialId = productMaterialList[0]?.id
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

    // 保存数据
    const saveItem = () => {
      formEle.value.validate().then(() => {
        datas.saveDisabled = true
        const params = {
          ...datas.form
        }

        const extend = Object.assign({
          productionQuantity: datas.form.productionQuantity,
          samplingQuantity: datas.form.samplingQuantity,
          samplingPerson: datas.form.samplingPerson,
          sampQuantity: datas.form.sampQuantity,
          isProductionQuantity: datas.form.isProductionQuantity
        }, configEle.value ? configEle.value.form : {})
        params.extend = JSON.stringify(extend)

        addCheckUnit(params).then(() => {
          Toast({
            type: 'success',
            message: '新增成功',
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

    // 根据编码规则设置送检单号
    const setInspectionSheetCode = ({ inspectionSheetCode }) => {
      datas.form.inspectionSheetCode = inspectionSheetCode
    }

    return {
      ...toRefs(datas),
      formEle,
      configEle,
      saveItem,
      formateDateVal,
      handleScanWorkOrderNumber,
      handleScanBarCode,
      setInspectionSheetCode
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
