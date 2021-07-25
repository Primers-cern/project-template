<template>
  <el-affix v-if="show" position="bottom" class="mt-5">
    <div class="bg-white bg-opacity-90 p-5 -mx-5 py-3 -mb-3 text-right center-flex">
      <slot></slot>
      <el-pagination class="ml-auto" v-bind="props" hide-on-single-page></el-pagination>
    </div>
  </el-affix>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps({
  currentPage: {
    type: Number,
    require: true
  },
  total: {
    type: Number,
    require: true
  },
  pageSize: {
    type: Number,
    require: true
  },
  layout: {
    type: String,
    default: "prev, pager, next, jumper"
  },
  background: {
    type: Boolean,
    default: true
  },
  keep: Boolean,
  onCurrentChange: Function,
})

const show = computed(() => {
  const { keep, total, pageSize } = props
  return (keep || total / pageSize > 1)
})
</script>

<style>
</style>
