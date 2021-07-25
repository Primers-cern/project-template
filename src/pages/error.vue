<template>
  <div class="h-screen w-screen bg-hero-i-like-food-muted center-flex justify-center text-center bg-white">
    <el-empty class="mb-60" description="404" :image-size="300">
      <div class="text-xl font-bold text-info">抱歉，页面失踪了</div>
    </el-empty>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<style>
</style>
