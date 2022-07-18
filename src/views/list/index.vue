<!--
 * @Author: zhaozhuo
 * @Date: 2022-07-08 10:18:36
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-18 09:09:50
 * @Description: ...
-->
<template>
  <CommonHeader title="送检单列表" :isShowBack="false" />
  <CommonMain>
    <div ref="commonWrapper" class="common-wrapper">

      <section class="search-box">
        <van-search
          id="vanSearch"
          show-action
          placeholder="查询"
          readonly
          @focus="showSearch"
        >
          <template #action>
            <div class="scan-box" @click="goEdit('add')" v-permission="{ action: 'product.inspection.sheet:add' }">
              <van-icon name="add" size="20px" color="#1888FE"/>
            </div>
          </template>
        </van-search>
        <SearchFormbox
          :search-flag="searchFlag"
          :search-form="searchParams"
          @cancel="handleCancelSearch"
          @confirm="handleConfirmSearch"
        />
      </section>

      <van-pull-refresh
        v-model="refreshing"
        :disabled="isRefreshDisable"
        @refresh="onRefresh"
      >
        <van-list
          v-if="list.length >= 0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMore"
        >
          <listItem
            v-for="(item, index) in list"
            :key="index"
            :row="item"
            @click="goEdit('edit', item)"
          />
        </van-list>
        <div v-else class="no-data">暂无数据</div>
      </van-pull-refresh>
    </div>
  </CommonMain>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventListener } from '@vant/use'
import { getCheckUnitList } from '@/api/inspectionSheet.js'
import useIsDisabledScroll from '@/mixins/isDisabledScroll.js'

import SearchFormbox from './components/searchFormbox.vue'
import listItem from './components/listItem.vue'

export default {
  name: 'List',
  components: {
    SearchFormbox,
    listItem
  },
  setup (props, ctx) {
    let cloneSearchParams = {}
    const router = useRouter()
    const datas = reactive({
      searchFlag: false,
      searchParams: {
        inspectionSheetCode: '',
        status: '',
        startTime: '',
        endTime: ''
      },
      queryList: { current: 1, size: 20 },
      refreshing: false,
      finished: false,
      loading: false,
      total: 0,
      list: []
    })

    onMounted(() => {
      getList()
    })

    // 弹出搜索框
    const showSearch = () => {
      cloneSearchParams = JSON.parse(JSON.stringify(datas.searchParams))
      datas.searchFlag = true
    }
    // 重置搜索
    const handleCancelSearch = (val) => {
      datas.searchParams = val
      datas.searchFlag = false
      onRefresh()
    }
    // 确认搜索
    const handleConfirmSearch = (val) => {
      datas.searchParams = val
      datas.searchFlag = false
      onRefresh()
    }
    // 查询列表
    const getList = async () => {
      datas.loading = true

      const param = {
        ...datas.queryList,
        ...datas.searchParams
      }
      const result = await getCheckUnitList(param)
      datas.loading = false
      datas.refreshing = false
      const { data = {} } = result || {}

      if (datas.queryList.current > 1) {
        datas.list = datas.list.concat(data.records)
      } else {
        datas.list = data.records
      }

      datas.total = data.total
      if (datas.total <= datas.list.length) {
        datas.finished = true
      }
    }
    // 下拉刷新
    const onRefresh = () => {
      // 清空列表数据
      datas.finished = false
      datas.list = []
      datas.queryList.current = 1
      getList()
    }
    // 加载更多
    const loadMore = () => {
      datas.queryList.current += 1
      getList()
    }
    const goEdit = (type, item = {}) => {
      router.push({
        path: `/${type}`,
        query: {
          id: item?.inspectionSheetId
        }
      })
    }

    const clickOutSide = (e) => {
      const target = e.target
      const searchInfo = document.querySelector('#searchInfo')
      const vanSearch = document.querySelector('#vanSearch')

      if (vanSearch.contains(target) || searchInfo.contains(target)) {
        return
      }
      if (datas.searchFlag) {
        datas.searchFlag = false
        datas.searchParams = JSON.parse(JSON.stringify(cloneSearchParams))
      }
    }

    useEventListener('click', clickOutSide)
    const { isRefreshDisable } = useIsDisabledScroll('.van-list')

    return {
      ...toRefs(datas),
      getList,
      showSearch,
      handleConfirmSearch,
      handleCancelSearch,
      onRefresh,
      loadMore,
      goEdit,
      isRefreshDisable
    }
  }
}
</script>

<style lang="scss" scoped>
.common-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  .search-box {
    position: absolute;
    left: 0;
    right: 0;
    height: 46px;
    .van-search {
      height: 100%;
    }
    .van-search__content {
      background: #f7f7f7;
      border-radius: 15px;
      .van-cell {
        height: 30px;
        display: flex;
        align-items: center;
      }
    }
    .scan-box {
      display: flex;
      align-items: center;
      img {
        width: 20px;
      }
    }
  }
  .onshelf-box {
    position: absolute;
    left: calc(100% - 75px);
    top: calc(100% - 75px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 65px;
    height: 65px;
    color: #fff;
    background: rgba(62, 141, 252, 0.99);
    box-shadow: 0px 3px 6px #4693FF;
    border-radius: 50%;
    z-index: 99999;
  }
  .van-pull-refresh {
    height: 100%;
    padding-top: 46px;
    margin: 0 8px;
    :deep(.van-pull-refresh__track) {
      overflow: scroll;
    }
    .van-list {
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    .no-data {
      height: 100%;
      font-size: 14px;
      display: flex;
      justify-content: center;
      color: #c7c6c6;
      padding-top: 30px;
    }
  }
}
</style>
<style lang="scss">
.van-overlay {
  z-index: 2000 !important;
}
</style>
