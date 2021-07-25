<template>
  <div class="login-wrapper">
    <el-card class="box-card">
      <h1 class="title">
        <el-image
          style="width: 40px; height: 40px"
          :src="require('../assets/img/logo.png')"
          fit="cover"
        ></el-image>
        <span class="ml-2">五华惠企管理平台</span>
      </h1>
      <div class="input-group">
        <el-input
          class="mt-5"
          v-model="user_account"
          placeholder="请输入账号"
          prefix-icon="el-icon-user"
          @keyup.enter.native="handleLogin"
        ></el-input>
        <el-input
          class="mt-3"
          v-model="user_pwd"
          placeholder="请输入密码"
          prefix-icon="el-icon-key"
          @keyup.enter.native="handleLogin"
          show-password
        ></el-input>
        <el-button
          class="w-100 mt-5"
          type="primary"
          :loading="loading"
          @click="handleLogin"
        >{{loading ? '正在登录' : '登录'}}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      user_account: "",
      user_pwd: "",
      loading: false
    };
  },
  methods: {
    handleLogin() {
      let self = this,
        url = "Index/Login/login",
        params = {
          login_type: "a002",
          user_account: self.user_account,
          user_pwd: self.user_pwd
        };

      self.loading = true;
      self.$http
        .post(url, params)
        .then(res => {
          let $store = self.$store,
            data = res.data;

          $store.commit("storeCookier", {
            opr: "set",
            name: self.$tools.CONSTANT.token_name,
            value: data.session_id
          });

          $store.commit("storeCookier", {
            opr: "set",
            name: "user_id",
            value: data.id
          });

          $store.commit("storeCookier", {
            opr: "set",
            name: "user_role",
            value: data.user_role
          });

          self.loading = false;

          $store.dispatch("getUserInfo", data.id).then(() => {
            self.$message.success("登陆成功");
            self.$store.commit("reset_tab");
            self.$router.push({ name: "index" });
          });
        })
        .catch(() => (self.loading = false));
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: linear-gradient(to top right, #3c95df, var(--theme-color));
}
.box-card {
  padding: 30px 20px;
  width: 400px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--theme-color);
}

.input-group {
  width: 80%;
  margin: 0 auto;
}
</style>
