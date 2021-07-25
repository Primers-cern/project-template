<template>
  <el-menu
    default-active="2"
    class="pt-2 pb-4"
    router
  >
    <template v-for="(item, index) in list">
      <el-submenu v-if="item.children" :index="index.toString()" :key="index">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <el-menu-item
          v-for="(child, num) in item.children"
          :key="num"
          :index="child.path"
          :route="child.path"
        >
          {{child.title}}
        </el-menu-item>
    </el-submenu>

    <el-menu-item v-else :index="item.path" :key="index">
      <i :class="item.icon"></i>
      <span slot="title">{{item.title}}</span>
    </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
export default {
  name: "com-indexNavMenu",
  data() {
    return {
      list: this.$store.state.routerStore.menu
    };
  }
};
</script>

<style>
.el-menu {
  border-right: 0;
}
.el-submenu .el-menu-item {
  padding-left: 50px !important;
}
.el-submenu__title:hover,
.el-menu-item:hover {
  background-color: rgba(43, 115, 175, .2) !important; 
}
</style>
