<template>
  <el-aside
    class="h-screen bg-blue-gray-800 transition-all duration-300 ease-in-out !overflow-x-hidden"
    :class="collapse ? '!w-16' : '!w-50'"
  >
    <el-affix>
      <div class="center-flex h-16 overflow-hidden cursor-pointer bg-blue-gray-800">
        <el-tooltip
          :content="`${collapse ? projectName + ' , ' : ''} version: ${version}`"
          :placement="collapse ? 'right' : 'bottom-start'"
          :effect="collapse ? 'dark' : 'light'"
        >
          <img class="w-6 h-6 mx-5" src="~img/logo.png" object-fit="cover" />
        </el-tooltip>
        <h1 class="font-bold text-white whitespace-nowrap">{{ projectName }}</h1>
      </div>
    </el-affix>

    <el-menu
      :uniqueOpened="true"
      router
      class="!border-0"
      :collapse="collapse"
      text-color="#fff"
      background-color="#1e293b"
      active-text-color="#409eff"
    >
      <template v-for="item in menuList" :key="item.tag">
        <el-submenu v-if="item.children.length" :index="item.tag">
          <template #title>
            <i :class="item.icon || 'el-icon-location'"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :index="child.router_path"
            :key="child.id"
            class="!pl-12"
          >{{ child.title }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="item.router_path">
          <i :class="item.icon || 'el-icon-location'"></i>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>

    <div
      class="fixed bottom-0 left-0 text-info text-2xl text-center py-1 cursor-pointer transition-all duration-300 ease-in-out bg-blue-gray-800 hover:(text-theme bg-gray-900)"
      @click="toggleCollapse"
      :class="collapse ? '!w-16' : '!w-50'"
      :title="collapse ? '展开' : '收起'"
    >
      <i :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
    </div>
  </el-aside>
</template>
 
<script setup>
import { inject } from "vue";
import { CONSTANT } from 'js/tools'

const { projectName, version } = CONSTANT;
const collapse = inject("menuCollapse");
const toggleCollapse = inject("toggleMenuCollapse")
const userInfo = inject("userInfo");
const menuList = recursionFilter(userInfo.value.authority)

function recursionFilter(list) {
  return list.filter(item => {
    if (item.sort_num == 0) return false
    if (item.children.length) item.children = recursionFilter(item.children)
    return true
  })
}
</script>

<style></style>
