<template>
  <div ref="maskEle" class="mask" :style="maskStyle">
    <div v-show="searchFlag" id="searchInfo" class="searchInfo">
      <van-form v-model="searchParams" class="vantForm">
        <van-cell-group inset>
          <div class="selTest">
            <van-field
              v-model="searchParams.inspectionSheetCode"
              label="送检单号"
              placeholder="请输入"
            />
          </div>
          <div class="selTest">
            <Select label="送检状态" :columns="checkStatusList" v-model="searchParams.status" />
          </div>
          <div class="selTest">
            <DateSelect :formateVal="formateDateVal" type="datetime" label="开始时间" v-model="searchParams.startTime" />
          </div>
          <div class="selTest">
            <DateSelect :formateVal="formateDateVal" type="datetime" label="结束日期" v-model="searchParams.endTime" />
          </div>
        </van-cell-group>
        <div class="btnOk">
          <van-button round block @click="cancel"> 重置 </van-button>
          <van-button round block type="primary" @click="onSubmit"> 确定 </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { nextTick, reactive, watch, computed, toRefs, ref, onMounted } from 'vue'
import {
  getCheckUnitStatus
} from '@/api/inspectionSheet.js'

import Select from '@/components/Select/index.vue'
import DateSelect from '@/components/DateSelect/index.vue'

export default {
  name: 'Searchform',
  props: {
    searchFlag: { type: Boolean, required: true },
    searchForm: { type: Object, required: true }
  },
  components: {
    Select,
    DateSelect
  },
  emits: ['cancel', 'confirm'],
  setup (props, { emit }) {
    const maskEle = ref(null)
    const datas = reactive({
      searchParams: {
        inspectionSheetCode: '',
        status: '',
        startTime: '',
        endTime: ''
      },
      checkStatusList: []
    })

    nextTick(() => {
      if (process.env.NODE_ENV === 'development') {
        const res = 67 + 58
        maskEle.value.style.height = `calc(100vh - ${res}px)`
      } else {
        window.flutter_inappwebview.callHandler('appBarheight').then(res1 => {
          window.flutter_inappwebview
            .callHandler('closeBarheight')
            .then(res2 => {
              const res = res1 + res2 + 58
              maskEle.value.style.height = `calc(100vh - ${res}px)`
            })
        })
      }
    })

    onMounted(() => {
      getCheckStatusList()
    })

    const maskStyle = computed(() => {
      if (props.searchFlag) {
        return {
          zIndex: 30
        }
      }
      return {
        zIndex: -1
      }
    })

    watch(() => props.searchForm, (newVal) => {
      if (newVal) {
        datas.searchParams = { ...datas.searchParams, ...newVal }
      }
    }, { immediate: true })

    const getCheckStatusList = () => {
      getCheckUnitStatus().then(res => {
        datas.checkStatusList = (res.data || []).map((item) => ({
          ...item,
          text: item.name,
          value: item.code
        }))
      })
    }

    const onSubmit = () => {
      emit('confirm', datas.searchParams)
    }
    const cancel = () => {
      datas.searchParams = {
        inspectionSheetCode: '',
        status: '',
        startTime: '',
        endTime: ''
      }
      emit('cancel', datas.searchParams)
    }

    const formateDateVal = (valArr) => {
      return valArr.slice(0, 3).join('-') + ' ' + valArr.slice(-2).join(':') + ':00'
    }

    return {
      ...toRefs(datas),
      maskEle,
      maskStyle,
      onSubmit,
      cancel,
      formateDateVal
    }
  }
}
</script>

<style lang="scss">
.el-popper {
  margin-top: 0 !important;
  .popper__arrow {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.mask {
  height: calc(100vh - 113px);
  background: #7f7f7f;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 30;
  .searchInfo {
    position: absolute;
    z-index: 33;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    .vantForm {
      font-size: 13px;
      :deep(.van-field) {
        line-height: 14px;
      }
      :deep(.van-button--primary) {
        background: #007cff;
        border: 1px solid #007cff;
      }
      :deep(.van-field__control) {
        text-align: right;
      }
      :deep(.van-button--block) {
        height: 30px;
        font-size: 13px;
      }
      .btnOk {
        display: flex;
        justify-content: center;
        margin: 10px 0;
        height: 30px;
        :deep(.van-button--round) {
          width: 130px;
        }
        :deep(.van-button--default) {
          margin-right: 10px;
        }
      }
      .selTest {
        display: flex;
        justify-content: space-between;
        height: 36px;
        box-sizing: border-box;
        border-bottom: 1px solid #f6f6f6;
        label {
          display: inline-block;
          width: 90px;
          text-align: center;
          font-size: 14px;
          line-height: 36px;
          color: #323232;
        }
        :deep(.van-cell) {
          padding-right: 0;
        }
      }
    }
  }
}
</style>
