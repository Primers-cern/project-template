<template>
  <img-uploader v-model:list="imgList" :limit="1" :size="[400, 300]" :ratio="[200, 150]" />
</template>

<script setup>
import imgUploader from 'components/imgUploader.vue'
import { ref, reactive } from 'vue'
import tools from "js/tools";

const bbb = ref()
const imgList = [{
  name: '12#13',
  url: 'https://iczer.gitee.io/vue-antd-admin/static/img/logo.9652507e.png'
},
{
  name: '12#13',
  url: 'https://iczer.gitee.io/vue-antd-admin/static/img/logo.9652507e.png'
}]

</script>

<style>
.test {
  margin: 0;
}
</style>
