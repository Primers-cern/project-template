<template>
  <div id="table-search-bar" class="mb-5" :class="collapse ? 'collapse' : 'uncollapse'">
    <el-form class="flex-1" size="small" label-width="84px" :class="collapse && 'pr-10'">
      <el-row :gutter="20">
        <slot></slot>
        <slot v-if="!simple && !collapse" name="extra"></slot>
      </el-row>
    </el-form>

    <div class="text-right">
      <el-button type="primary" size="small" icon="el-icon-search" @click="emit('search')">查询</el-button>
      <el-button size="small" @click="emit('clear')">重置</el-button>
      <el-button v-if="!simple" type="text" size="small" @click="handleCollapse">
        <span>{{ collapse ? '展开' : '收起' }}</span>
        <i class="el-icon--right" :class="`el-icon-arrow-${collapse ? 'down' : 'up'}`" />
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { defineEmit, defineProps, ref } from 'vue'
const emit = defineEmit()
const props = defineProps({
  simple: Boolean
})

const collapse = ref(props.simple)
const handleCollapse = () => {
  collapse.value = !collapse.value
  emit('toggle', collapse.value)
}
</script>

<style>
#table-search-bar .el-form-item.el-form-item--small {
  margin-bottom: 0;
}

#table-search-bar .el-form-item__label {
  padding-right: 0;
}

/* 折叠样式 */
#table-search-bar.collapse {
  display: flex;
  align-items: center;
}

#table-search-bar.uncollapse .el-form-item.el-form-item--small {
  margin-bottom: 16px;
}
</style>
