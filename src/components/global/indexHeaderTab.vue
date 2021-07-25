<template>
  <el-tabs
    v-model="currentTag"
    id="router-tab"
    type="card"
    :closable="tabInfo.list.length > 1"
    @tab-remove="closeTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="item in tabInfo.list"
      :key="item"
      :label="tabInfo.map.get(item)"
      :name="item"
    ></el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { inject, toRef, customRef } from "vue";
import { useRouter } from "vue-router";
const tabInfo = inject('tabInfo')
const tabTools = inject('tabTools')

const router = useRouter();
const currentTag = toRef(tabInfo, 'active');
const clickTab = info => router.push(info.props.name)
const closeTab = name => {
  const
    list = tabInfo.list,
    currentIndex = list.findIndex(item => item == name)

  tabTools.del_tab(name)

  if (name === tabInfo.active) {
    const takePlace = list[currentIndex - 1] || list[currentIndex]
    router.replace(takePlace)
  }
}
</script>

<style>
#router-tab {
  align-self: flex-end;
}

#router-tab .el-tabs__header {
  border: none;
  margin: 0;
}

#router-tab .el-tabs__nav-wrap {
  margin-bottom: -2px;
}

#router-tab .el-tabs__nav {
  border-color: var(--background-color) !important;
}

#router-tab .el-tabs__item {
  padding: 0 18px !important;
  border-bottom: none !important;
  border-color: var(--background-color) !important;
  color: var(--info-color);
  transition: all 0.2s;
}

#router-tab .el-tabs__item:hover {
  @apply text-theme;
}

#router-tab .is-active {
  @apply text-theme;
  font-weight: bold;
  background-color: var(--background-color);
}

#router-tab .el-icon-close {
  position: relative;
  left: 8px;
  margin: 0;
}
</style>
