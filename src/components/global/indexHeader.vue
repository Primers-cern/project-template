<template>
  <div class="h-16 center-flex justify-between">
    <index-header-tab />

    <div class="text-right center-flex">
      <div class="pr-8 text-lg cursor-pointer center-flex">
        <el-badge :value="2" class="mt-1">
          <i title="通知" class="el-icon-bell ml-4 hover:(text-theme font-bold)"></i>
        </el-badge>
        <i
          title="重载"
          class="el-icon-refresh-right ml-4 hover:(text-theme font-bold)"
          @click="handleReload"
        ></i>
        <i
          title="切换全屏"
          class="el-icon-full-screen ml-4 hover:(text-theme font-bold)"
          :class="fullScreen && '!font-bold text-theme'"
          @click="toggleScreenFull"
        ></i>
      </div>
      <el-avatar
        class="mr-2"
        size="small"
        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      />
      <el-dropdown class="cursor-pointer">
        <span class="el-dropdown-link">
          {{ userInfo.nickname }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-setting">账号设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" @click="handleLogOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import indexHeaderTab from 'components/global/indexHeaderTab.vue'
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import tools from "js/tools";
const router = useRouter();
const updateToken = inject("updateToken");
const userInfo = inject("userInfo");
const collapse = inject("menuCollapse");

const handleReload = () => location.reload();

// 全屏
import screenfull from "screenfull";
const fullScreen = ref(false);
const toggleScreenFull = () => {
  if (!screenfull.isEnabled) return tools.message.warning("浏览器不支持");
  screenfull.toggle();
};
window.onresize = () => {
  let isFull =
    window.fullScreen ||
    document.webkitIsFullScreen ||
    document.msFullscreenEnabled;

  fullScreen.value = !!isFull;
};

const handleLogOut = () => {
  tools.msgBox
    .confirm("确认退出登录", "提示", {
      confirmButtonText: "确认退出",
      cancelButtonText: "取消",
    })
    .then(() => {
      updateToken("", -1);
      router.push("login");
    });
};
</script>

<style>
</style>
