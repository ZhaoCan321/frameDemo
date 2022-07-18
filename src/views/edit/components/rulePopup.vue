<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-13 12:24:22
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-14 14:28:43
 * @Description: ...
-->
<template>
  <van-popup v-model:show="ruleDetailByTypeFlag" position="bottom" :style="{ height: '60%' }" :close-on-click-overlay="false">
    <h5>请选择编码类型</h5>

    <div class="content">
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1" title="编码规则类型">
          <van-radio-group v-model="ruleChecked" direction="horizontal" @change="changeRulesType">
            <van-radio class="radio-item" v-for="(item, index) in codingRulesTypeList" :key="index" :name="item.id">{{ setRuleLabel(item.prefixDetail) }}</van-radio>
          </van-radio-group>

          <p class="example">
            <span>样例：</span> <span>{{codingRulesTypeFormExample}}</span>
          </p>
        </van-collapse-item>
      </van-collapse>

      <van-form ref="formEle">
        <van-cell-group inset>
          <van-field
            v-for="(item, index) in rulePrefixDetail"
            :key="index"
            v-model="form[`prefixValue${index}`]"
            :name="item.name"
            :label="item.name"
            :disabled="item.type != 1"
            placeholder="请输入"
          />
        </van-cell-group>
      </van-form>
    </div>

    <div class="footer">
      <van-button type="primary" block size="small" @click="save">保存</van-button>
    </div>
  </van-popup>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from 'vue'
import { Toast } from 'vant'
import { getNumRuleDetailByType, getNumRuleSeqByType } from '@/api/inspectionSheet.js'

export default {
  name: 'RulePopup',

  props: {
    setOption: Function
  },

  setup (props, { emit }) {
    const datas = reactive({
      activeNames: ['1'],
      form: {
        type: '',
        example: ''
      },
      codingRulesTypeList: [],
      readonly: true,
      ruleDetailByTypeFlag: false,
      inspectionSheetCode: '',
      rulePrefixDetail: [],
      ruleChecked: ''
    })

    onMounted(() => {
      getDetailByType()
    })

    const codingRulesTypeFormExample = computed(() => {
      const codingRulesTypeFormKeys = Object.keys(datas.form)
      if (codingRulesTypeFormKeys.length) {
        let vals = ''
        codingRulesTypeFormKeys.forEach(key => {
          if (key.startsWith('prefixValue')) {
            vals += datas.form[key]
          }
        })
        return vals
      }
      return '--'
    })

    const getDetailByType = () => {
      const params = { typeCode: 15 }
      getNumRuleDetailByType(params).then(res => {
        const codingRulesTypeList = datas.codingRulesTypeList = res.data
        if (codingRulesTypeList.length === 0) {
          datas.readonly = false
          props.setOption({
            inspectionSheetCode: ''
          })
        } else if (codingRulesTypeList.length === 1) {
          const prefixDetail = JSON.parse(codingRulesTypeList[0].prefixDetail)
          if (isExistManualInput(prefixDetail)) {
            datas.ruleDetailByTypeFlag = true
          } else {
            const params = { id: codingRulesTypeList[0].id }
            getSeqByType(params)
          }
        } else {
          datas.ruleDetailByTypeFlag = true
        }
      })
    }

    const getSeqByType = (params) => {
      getNumRuleSeqByType(params)
        .then(res => {
          const rulePrefixDetail = filterNotShowType(res.data.prefixValueList)
          datas.inspectionSheetCode = rulePrefixDetail.reduce((str, item) => {
            str = str + item.value
            return str
          }, '')
          props.setOption({
            inspectionSheetCode: datas.inspectionSheetCode
          })
        })
    }

    const isExistManualInput = (prefixDetail) => {
      return prefixDetail.some(item => item.code === 1)
    }

    const filterNotShowType = (data) => {
      // 2 是物料和工单生成的时候数据，不显示
      return data.filter((item) => item.type !== 2)
    }

    const setRuleLabel = (prefixDetail) => {
      const nPrefixDetail = JSON.parse(prefixDetail)
      if (nPrefixDetail && nPrefixDetail.length) {
        const str = nPrefixDetail.reduce((str, i) => {
          str = str + i.name + '-'
          return str
        }, '')
        return str.slice(0, -1)
      }
    }

    const changeRulesType = (val) => {
      const param = { id: val }
      getNumRuleSeqByType(param).then(res => {
        datas.rulePrefixDetail = filterNotShowType(res.data.prefixValueList)
        datas.rulePrefixDetail.forEach((item, index) => {
          datas.form[`prefixValue${index}`] = item.value
        })
      })
    }

    // 判断手动输入的是否为空
    const isManualInputEmpty = () => {
      const { rulePrefixDetail, form } = datas
      const index = rulePrefixDetail.findIndex(item => item.code === 1)
      return index === -1 ? false : !form[`prefixValue${index}`]
    }

    const save = () => {
      if (datas.ruleChecked) {
        // 校验是否存在手动输入
        if (isManualInputEmpty()) {
          Toast.fail({
            message: '请输入人工输入'
          })
        } else {
          datas.inspectionSheetCode = codingRulesTypeFormExample
          datas.ruleDetailByTypeFlag = false
          props.setOption({
            inspectionSheetCode: datas.inspectionSheetCode
          })
        }
      } else {
        Toast.fail({
          message: '请选择编码规则类型'
        })
      }
    }

    return {
      ...toRefs(datas),
      changeRulesType,
      setRuleLabel,
      isManualInputEmpty,
      codingRulesTypeFormExample,
      save
    }
  }
}
</script>

<style lang="scss" scope>
h5 {
  padding: 10px 16px;
  font-size: 16px;
  text-align: center;
}
.radio-item {
  padding: 8px 0;
}
.example {
  padding: 10px 28px;
  color: #f20;
}
.content {
  height: calc(100% - 86px);
  overflow: auto;
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
