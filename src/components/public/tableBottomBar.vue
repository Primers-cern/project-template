<template>
  <div>
    <div id="table-bottom-fill" :class="{ 'fill-shrink': !visiable }"></div>
    <div v-if="visiable" id="table-bottom-bar">
      <div class="flex-1">
        <div v-if="select || showOptions" style="padding-left: 14px; padding-right: 24px">
          <el-checkbox v-model="checked" @change="val => $emit('check-all', val)">全选</el-checkbox>
          <span class="text-info mx-3">已选 {{ count || 0 }} 项</span>
          <el-button size="small" type="primary" @click="$emit('confirm-select')">完成选择</el-button>
        </div>

        <template v-if="multiple && showOptions">
          <el-button size="small" plain @click="showOptions = false">取消批量</el-button>
          <slot></slot>
        </template>
        <el-button v-else-if="multiple" size="small" type="primary" plain @click="showOptions = true">批量操作</el-button>
      </div>
      <el-pagination
        v-if="pageInfo"
        class="table-pagination"
        layout="total, prev, pager, next"
        :total="pageInfo.total || 0"
        :page-size="pageInfo.limit"
        :current-page="pageInfo.current"
        @current-change="page => $emit('page-change', page)"
        background
        hide-on-single-page
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tableBottomBar',
    props: {
      pageInfo: Object,
      select: {
        type: Boolean,
        default: false,
      },
      count: Number,
      multiple: Boolean,
    },
    data() {
      return {
        checked: false,
        showOptions: false,
      }
    },
    computed: {
      visiable() {
        let self = this,
          pageInfo = self.pageInfo,
          singlePage = pageInfo.total / pageInfo.limit < 1

        return !singlePage || self.select || self.multiple
      },
    },
    mounted() {},
    methods: {
      checkAll(status) {
        this.checked = status
      },
    },
  }
</script>

<style>
  #table-bottom-fill {
    height: 60px;
    margin-top: 10px;
  }

  #table-bottom-fill.fill-shrink {
    height: 10px;
  }

  #table-bottom-bar {
    position: fixed;
    bottom: 20px;
    left: 250px;
    right: 20px;
    z-index: 9;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 0 0 4px 4px;
    height: 60px;
    padding: 6px 30px;
    /* border-top: 1px solid var(--border-color); */
  }
</style>
