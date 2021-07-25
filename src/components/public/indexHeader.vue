<template>
  <div id="index-header" class="center-flex justify-between">
    <index-tabs></index-tabs>
    <!-- <el-page-header @back="$router.go(-1)" :content="$route.meta.title" title></el-page-header> -->
    <div>
      <!-- <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
          <el-dropdown-item>新增</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
      <span class="text-info">{{ $tools.CONSTANT.role_name[userInfo.role_tag] }} - {{ userInfo.nickname }}</span>
      <el-button class="ml-3" size="mini" type="info" plain icon="el-icon-refresh" title="重载后台" @click="window.location.reload()"></el-button>
      <el-popconfirm title="确认退出登录" @confirm="loadOut" confirmButtonType="danger">
        <el-button slot="reference" style="margin-left: -2px" size="mini" type="info" plain icon="el-icon-switch-button" title="退出登录"></el-button>
      </el-popconfirm>
    </div>
  </div>
</template>

<script>
  import indexTabs from 'components/public/indexTabs'
  
  export default {
    name: 'indexHeader',
    components: { indexTabs },
    computed: {
      userInfo() {
        return this.$store.state.user_info
      },
    },
    methods: {
      loadOut() {
        let self = this
        self.$store.commit('storeCookier', { opr: 'del' }) // 删除所有cookie
        self.$store.commit('setUserInfoStatus', false) // 清除用户信息
        self.$router.push('/login')
      },
    },
  }
</script>

<style>
  #index-header {
    height: 100%;
  }
</style>
