<template>
  <router-view></router-view>
</template>

<script setup>
import { provide } from 'vue'
import store from "@/store"
 
for (let key in store) provide(key, store[key])
</script>

<style>
</style>
