<template>
  <div class="h-screen w-screen bg-hero-circuit-board center-flex justify-center text-center">
    <el-card class="w-100 mb-40 !bg-background !overflow-visible">
      <div class="center-flex flex-col">
        <div class="center-flex justify-center h-16">
          <img class="w-8 h-8 mr-5" src="~img/logo.png" object-fit="cover" />
          <h1 class="text-2xl font-bold">{{ projectName }}</h1>
        </div>
        <div class="text-small text-info mt-2 pb-16">全广西最具影响力的网红直播平台</div>
        <div class="w-70">
          <el-form :model="form" ref="formNode" :rules="formRules">
            <el-form-item prop="user_account">
              <el-input
                v-model="form.user_account"
                prefix-icon="el-icon-user"
                placeholder="请输入登录账号"
                @keypress.enter="handleLogin"
              />
            </el-form-item>
            <el-form-item prop="user_pwd">
              <el-input
                v-model="form.user_pwd"
                prefix-icon="el-icon-lock"
                placeholder="请输入登录密码"
                show-password
                @keypress.enter="handleLogin"
              />
            </el-form-item>
          </el-form>
          <el-button
            class="w-full !mt-10"
            type="primary"
            :loading="isLogin"
            @click="handleLogin"
            :disabled="forbidLogin"
          >登 录</el-button>
        </div>
        <div class="text-xs text-muted relative top-16">{{ copyright }} | {{ icp }}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { inject, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import tools from "js/tools";
const updateToken = inject("updateToken");
const router = useRouter();
const { projectName, copyright, icp } = tools.CONSTANT;

const form = reactive({
  user_account: "",
  user_pwd: "",
});
const formNode = ref();
const formRules = {
  user_account: [{ required: true, message: "账号必须填写" }],
  user_pwd: [{ required: true, message: "密码必须填写" }],
};

const forbidLogin = computed(() => Object.values(form).some((val) => !val));
const isLogin = ref(false);
const handleLogin = async () => {
  const result = await formNode.value.validate().catch(() => { });
  if (typeof result !== "boolean") return;
  isLogin.value = true;

  const url = "Login/login",
    params = {
      login_type: "a002",
      ...form,
    };

  tools.http
    .post(url, params)
    .finally(() => (isLogin.value = false))
    .then((data) => {
      const res = data.data;
      tools.message.success("登录成功");
      updateToken(res.session_id);
      router.replace("home");
    });
};
</script>

<style>
</style>
