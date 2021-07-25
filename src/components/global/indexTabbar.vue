<template>
  <div class="h-12 border-t-1 center-flex">
    <el-tag
      v-for="item in tabInfo.list"
      :key="item"
      class="cursor-pointer mr-3"
      size="small"
      :effect="currentTag == item ? 'dark' : 'plain'"
      :type="currentTag == item ? 'primary' : 'info'"
      :closable="currentTag == item"
      @click="currentTag = item; router.push(item)"
    >{{ tabInfo.map.get(item) }}</el-tag>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";
const tabInfo = inject('tabInfo')
const tabTools = inject('tabTools')

const router = useRouter();
const currentTag = tabInfo.active;
</script>

<style>
</style>
