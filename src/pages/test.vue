<template>
  <tinymce-editor ref="editor" v-model="content" />
</template>

<script setup>
import { defineProps, defineEmit, ref } from 'vue'
import tinymceEditor from "components/tinymceEditor.vue";

const content = ref('')
</script>

<style>
</style>
