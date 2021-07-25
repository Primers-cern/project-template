<template>
  <el-container id="page-container">
    <el-aside class="position-relative bg-white" width="230px">
      <el-tooltip :content="'版本：' + info.version_admin" placement="bottom">
        <h1 class="aside-title">管理平台</h1>
      </el-tooltip>
      <div class="aside-menu-wrapper">
        <el-scrollbar>
          <index-nav-menu></index-nav-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header class="bg-white" height="60px" style="margin-left: 1px;">
        <index-header></index-header>
      </el-header>
      <el-main>
        <el-scrollbar id="mainScrollbar" ref="mainContentScrollbar">
          <keep-alive v-if="isRouterAlive" :include="aliveList">
            <router-view :key="$route.fullPath"></router-view>
          </keep-alive>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import indexNavMenu from "components/public/indexNavMenu";
import indexHeader from "components/public/indexHeader";

export default {
  name: "index",
  components: {
    indexNavMenu,
    indexHeader
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  computed: {
    info() {
      return this.$store.state.projectInfo;
    },
    aliveList() {
      let list = this.$store.state.tabStore.tabList || [];
      return list.join(",");
    }
  },
  mounted() {
    let self = this;
    // 禁止F5刷新并刷新内页
    document.onkeydown = function(e) {
      var ev = window.event || e;
      var code = ev.keyCode || ev.which;
      if (code == 116) {
        if (ev.preventDefault) {
          ev.preventDefault();
        } else {
          ev.keyCode = 0;
          ev.returnValue = false;
        }
        self.reloadRouterView();
      }
    };
  },
  methods: {
    reloadRouterView() {
      let self = this;
      self.isRouterAlive = false;
      self.$nextTick(() => (self.isRouterAlive = true));
    }
  }
};
</script>

<style>
#page-container {
  height: 100vh;
}
.aside-menu-wrapper {
  position: absolute;
  top: 60px;
  bottom: 0;
  width: 100%;
}
.aside-title {
  padding-left: 26px;
  line-height: 60px;
  color: var(--theme-color);
  font-size: 23px;
  font-weight: bold;
  overflow: hidden;
  word-break: break-all;
}
#mainScrollbar {
  border-radius: 3px;
}
</style>
