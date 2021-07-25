
<template>
  <div class="text-center">
    <i class="el-icon-warning"></i>
    <h2>404</h2>
    <el-button class="mt-4" type="danger" @click="delToken">删除 Token</el-button>
  </div>
</template>

<script>
export default {
  name: 'error',
  methods: {
    delToken() {
      let self = this;
      self.$store.commit('storeCookier', {opr: 'del'}) // 删除所有cookie
      self.$message.success('删除成功')
      self.$router.push('/login')
    }
  }
};
</script>

<style>
</style>
