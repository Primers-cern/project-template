<template>
  <el-container class="h-screen">
    <aside-menu />

    <el-container>
      <el-header class="!h-16 bg-white shadow-sm z-10">
        <index-header />
      </el-header>

      <el-main id="content-wrapper" class="!pb-0">
        <div class="router-view-wrapper">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="route.fullPath"></component>
            </keep-alive>
          </router-view>
        </div>

        <index-footer />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import asideMenu from "components/global/asideMenu.vue";
import indexHeader from "components/global/indexHeader.vue";
import indexFooter from "components/global/indexFooter.vue";
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style>
.router-view-wrapper {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 64px - 20px - 80px);
}
</style>
