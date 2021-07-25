<template>
  <table-search-bar @search="handleSearch">
    <el-col :span="8">
      <el-form-item label="活动名名称：">
        <el-input></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="活动名称：">
        <el-input></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="活动名称：">
        <el-input></el-input>
      </el-form-item>
    </el-col>
    <template #extra>
      <el-col :span="8">
        <el-form-item label="活动名称：">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发布时间：">
          <time-range-picker v-model:start="form.start_time" v-model:end="form.end_time" shortcuts></time-range-picker>
        </el-form-item>
      </el-col>
    </template>
  </table-search-bar>

  <table-tools-bar
    v-model:keyword="form.keyword"
    v-model:status="form.status"
    :statusMap="statusMap"
    @refresh="reloadList"
  >
    <el-button type="primary" icon="el-icon-plus" size="mini" class="mr-5">默认按钮</el-button>
  </table-tools-bar>
  <el-table :data="tableData">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>

  <table-pagination v-bind="pageInfo" @current-change="getList" />
</template>

<script setup>
import { reactive } from 'vue'
import tools from "js/tools";

const statusMap = {
  1: "有效",
  2: "无效",
  3: "搞事"
}
const pageInfo = reactive({
  total: 10,
  pageSize: 10,
  currentPage: 1
})
const form = reactive({
  keyword: "",
  status: "",
  start_time: "",
  end_time: ""
})

const reloadList = type => {
  console.log(type)
  getList(1)
}

const getList = page => {
  pageInfo.currentPage = page
}

const handleSearch = () => {
  console.log(form)
}

const tableData = [
  {
    date: "2016-05-02",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1518 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
];
</script>

<style>
</style>
