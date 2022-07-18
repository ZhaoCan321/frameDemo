<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-08 12:30:26
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-14 12:03:04
 * @Description: ...
-->
<template>
  <div class="list-item">
    <div class="title van-hairline--bottom">
      <van-tag plain type="primary" :color="tagColor">{{rowData.statusName}}</van-tag>
      <span>{{rowData.inspectionSheetCode}}</span>
      <span>{{rowData.typeName}}</span>
    </div>
    <div class="content">
      <p v-for="(item, index) in rowDatas" :key="index">
        <i>{{ item.label }}：</i>
        <i>{{ item.value }}</i>
      </p>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { getSessionStorageData } from '@/utils/storage.js'

export default {
  name: 'ListItem',
  props: {
    row: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props, ctx) {
    const curLoginInfo = getSessionStorageData('curLoginInfo') || {}
    const { row: rowData } = toRefs(props)
    const datas = reactive({
      rowDatas: [
        {
          label: '物料名称',
          value: rowData.value.materialName || '--'
        },
        {
          label: '物料编号',
          value: rowData.value.materialCode || '--'
        },
        {
          label: '物料规格',
          value: rowData.value.materialStandard || '--'
        },
        {
          label: '送检人',
          value: rowData.value.inspectionPersionName || curLoginInfo.nickname
        },
        {
          label: '关联单据类型',
          value: rowData.value.documentTypeName || '--'
        },
        {
          label: '关联单据编码',
          value: rowData.value.workOrderNumber || '--'
        },
        {
          label: '批号',
          value: rowData.value.barCode || '--'
        },
        {
          label: '生产日期',
          value: rowData.value.productTime || '--'
        }
      ]
    })

    const tagColor = computed(() => {
      const { status } = rowData.value
      let color = '' // 1 创建 2 生效 3 完成 4 取消

      switch (status) {
        case 1:
          color = '#1888FE'
          break
        case 2:
          color = '#03E2E2'
          break
        case 3:
          color = '#52C41A'
          break
        case 4:
          color = '#909090'
          break
        default:
          break
      }
      return color
    })

    return {
      rowData,
      tagColor,
      ...toRefs(datas)
    }
  }
}
</script>

<style lang="scss">
@mixin df {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-item {
  padding: 10px 8px;
  margin-top: 10px;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  background: #fff;
  i {
    font-style: normal;
  }
  .title {
    padding-bottom: 8px;
    margin-top: 0;
    @include df();
    > span:nth-of-type(1) {
      font-size: 12px;
    }
    > span:nth-of-type(2) {
      flex: 1;
      margin: 0 10px;
      text-align: left;
      font-weight: 600;
      font-size: 16px;
    }
    > span:nth-of-type(3) {
      color: #1888FE;
    }
  }
  .content {
    p {
      margin-top: 8px;
      text-align: left;
      > i:nth-of-type(1) {
        color: #999;
      }
    }
  }
}
</style>
