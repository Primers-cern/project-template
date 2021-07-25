<template>
  <div class="center-flex justify-between mb-4">
    <div :class="!alignLeft && 'mr-auto'">
      <slot></slot>
    </div>

    <div class="center-flex" :class="alignLeft && 'mr-auto'">
      <slot name="status">
        <el-radio-group
          v-if="statusMap"
          v-model="status"
          :size="size"
          @change="val => { emit('update:status', val); emit('refresh', 'status') }"
        >
          <el-radio-button :label="statusDefault.key">{{ statusDefault.name }}</el-radio-button>
          <el-radio-button v-for="(item, key) in statusMap" :key="key" :label="key + ''">{{ item }}</el-radio-button>
        </el-radio-group>
      </slot>

      <slot name="filter">
        <el-input
          v-if="showSearch"
          v-model="keyword"
          class="!w-50 ml-5"
          :size="size"
          suffix-icon="el-icon-search"
          placeholder="请输入关键词"
          clearable
          @input="val => emit('update:keyword', val)"
          @clear="emit('update:keyword', ''); emit('refresh', 'clear')"
          @keyup.enter="emit('refresh', 'search')"
        />
      </slot>
    </div>

    <slot name="refresh">
      <el-tooltip v-if="showRefresh" effect="light" content="刷新表格" placement="bottom">
        <el-button
          class="!ml-5 mr-1"
          icon="el-icon-refresh-right"
          :size="size"
          circle
          @click="emit('refresh', 'refresh')"
        />
      </el-tooltip>
    </slot>
  </div>
</template>

<script setup>
import { defineProps, defineEmit } from 'vue'
const emit = defineEmit()
const props = defineProps({
  keyword: String,
  status: [String, Number],
  statusMap: Object,
  alignLeft: Boolean,
  statusDefault: {
    type: Object,
    default: () => ({ name: '全部', key: "" })
  },
  size: {
    type: String,
    default: 'mini',
    validator: val => ~['medium', 'small', 'mini'].indexOf(val)
  },
  showRefresh: {
    type: Boolean,
    default: true
  },
  showSearch: {
    type: Boolean,
    default: true
  }
})
</script>

<style>
</style>
