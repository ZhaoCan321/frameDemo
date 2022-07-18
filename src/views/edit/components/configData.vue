<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-12 11:02:35
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-14 14:31:28
 * @Description: ...
-->
<template>
  <Expand title="定制配置信息" v-if="formList.length">
    <van-form>
      <van-cell-group inset>
        <template v-for="(item, index) in formList" :key="index">
          <van-field
            v-model="form[item.componentName]"
            :name="item.componentCname"
            :label="item.componentCname"
            :disabled="item.disabled"
            placeholder="请输入"
          />
        </template>
      </van-cell-group>
    </van-form>
  </Expand>
</template>

<script>
import { reactive, toRefs, watch, onMounted } from 'vue'
import {
  getCustomizationComponentName
} from '@/api/inspectionSheet.js'

import Expand from './expand.vue'
const TYPE = 'inspectSheet'

export default {
  name: 'ConfigData',

  props: {
    initData: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
    Expand
  },

  setup (props) {
    const datas = reactive({
      form: {},
      formList: []
    })

    onMounted(() => {
      getCustomList()
    })

    watch([() => props.initData, () => datas.formList], ([nInitData, nFormList]) => {
      const keys = Object.keys(nInitData)
      if (keys.length && nFormList.length) {
        nFormList.forEach(item => {
          if (keys.includes(item.componentName)) {
            datas.form[item.componentName] = nInitData[item.componentName].value
            item.disabled = nInitData[item.componentName].disabled
          }
        })
      }
    }, { deep: true })

    const getCustomList = () => {
      const params = {
        locationMarkerName: 'web'
      }
      getCustomizationComponentName(params)
        .then(res => {
          datas.formList = (res.data || []).filter(item => item.supplementaryData === TYPE)
        })
    }

    return {
      ...toRefs(datas)
    }
  }
}
</script>

<style>

</style>
