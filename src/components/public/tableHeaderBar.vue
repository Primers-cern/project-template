<template>
  <div class="center-flex pb-3">
    <div v-if="title" class="flex-1 size-16 text-bold">{{ title }}</div>
    <slot v-else name="title"></slot>
    <div class="center-flex">
      <slot name="filter"></slot>
    </div>
    <div v-if="!hideBtn" class="flex-1 text-right">
      <slot name="btn"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tableHeaderBar',
    props: {
      title: String,
      hideBtn: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    mounted() {},
    methods: {},
  }
</script>

<style></style>
