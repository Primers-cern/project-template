<template>
  <el-date-picker
    v-model="value"
    class="!w-full"
    :editable="false"
    size="small"
    type="datetimerange"
    format="YYYY-MM-DD HH:mm"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :shortcuts="buildShortcuts()"
    :default-time="setDefaultTime()"
  ></el-date-picker>
</template>

<script setup>
import { defineEmit, defineProps, computed } from 'vue'
const emit = defineEmit()
const props = defineProps({
  start: [String, Number],
  end: [String, Number],
  shortcuts: [Boolean, String]
})

const setDefaultTime = () => {
  const
    now = new Date(),
    dateList = ['getFullYear', 'getMonth', 'getDate'].map(way => now[way]())

  return [new Date(...dateList), new Date(...dateList, 23, 59, 59)]
}

const buildShortcuts = () => {
  let flag = props.shortcuts
  if (!flag) return []

  const shortcutsMap = [{
    name: 'week',
    text: '最近一周',
    day: 7
  }, {
    name: 'month',
    text: '最近一个月',
    day: 30
  }, {
    name: 'three-months',
    text: '最近三个月',
    day: 90
  }, {
    name: 'half-year',
    text: '最近半年',
    day: 180
  }, {
    name: 'year',
    text: '最近一年',
    day: 365
  },]

  flag = typeof flag === 'boolean' ? ['week', 'month', 'three-months', 'half-year', 'year'] : flag.split(',')
  const cutEnd = new Date();
  return shortcutsMap.filter(item => {
    if (!~flag.indexOf(item.name)) return false
    item.value = [new Date(cutEnd.getTime() - 3600 * 1000 * 24 * item.day), cutEnd]
    return true
  })
}

const value = computed({
  get: () => props.start && props.end ? [new Date(props.start * 1000), new Date(props.end * 1000)] : "", // 转毫秒转数字
  set(arr) {
    let
      startVal = "",
      endVal = ""

    if (arr) {
      startVal = Math.floor(arr[0].getTime() / 1000) // 装秒转时间戳
      endVal = Math.floor(arr[1].getTime() / 1000)
    }

    emit("update:start", startVal);
    emit("update:end", endVal);
  }
})
</script>

<style>
</style>
