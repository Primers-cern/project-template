<template>
  <el-footer class="text-center !text-muted leading-20 !h-20">
    {{ copyright }}
    <el-divider direction="vertical" />
    {{ icp }}
  </el-footer>
</template>
  
<script setup>
import tools from "js/tools";
const { copyright, icp } = tools.CONSTANT;
</script>
