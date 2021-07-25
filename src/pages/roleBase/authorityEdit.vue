<template>
  <el-row class="content-wrapper">
    <el-col :span="12" class="mt-3">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="父级标识" v-if="ptag">
          <el-input disabled :value="ptag"></el-input>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="tag" :disabled="C_isEdit"></el-input>
        </el-form-item>
        <el-form-item label="权限名称">
          <el-input v-model="form.title" placeholder="填写中文名称"></el-input>
        </el-form-item>
        <el-form-item label="路由名称">
          <el-input v-model="form.router_path"></el-input>
        </el-form-item>
        <el-form-item label="文件路径">
          <el-input v-model="form.file_path"></el-input>
        </el-form-item>
        <el-form-item label="菜单展示">
          <el-switch v-model="showInMenu"></el-switch>
        </el-form-item>
        <el-collapse-transition>
          <div v-show="showInMenu">
            <el-form-item label="菜单图标">
              <el-input v-model="form.icon" placeholder="选填，默认为 el-icon-s-help"></el-input>
            </el-form-item>
            <el-form-item label="排序值">
              <el-input v-model="form.sort_num" placeholder="按顺序排序，必须大于0"></el-input>
            </el-form-item>
          </div>
        </el-collapse-transition>
        <el-form-item class="pt-3">
          <el-button type="primary" @click="handleSubmit">提交保存</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "authorityEdit",
  data() {
    return {
      ptag: this.$route.query.ptag || "",
      tag: "",
      showInMenu: true,
      form: {
        title: "",
        icon: "",
        router_path: "",
        file_path: "",
        sort_num: 1
      }
    };
  },
  computed: {
    C_tag: {
      // 被引用
      get() {
        return this.ptag + this.tag;
      },
      // 被赋值
      set(val) {
        if (val.length > 3) {
          this.ptag = val.slice(0, 3);
          this.tag = val.slice(3, 6);
        } else this.tag = val;
      }
    },
    C_isEdit() {
      return !!this.$route.query.tag;
    }
  },
  mounted() {
    let self = this;
    self.C_tag = self.$route.query.tag || "";
    self.C_isEdit && self.getInfo()
  },
  methods: {
    getInfo() {
      let self = this,
          url = 'Index/RolePower/getPowerInfoByStation',
          params = { power_tag: self.C_tag }
          
      self.$http
        .get(url, { params })
        .then(res => {
          let obj = {}
          for (let i in self.form) obj[i] = res.data[i]
          if (res.data.sort_num == 0) self.showInMenu = false
          self.form = obj
        })
    },
    handleSubmit() {
      let self = this,
          params = self.form,
          url
      
      if (self.C_isEdit) {
        url = 'Index/RolePower/editPowerByStation'
        params.power_tag = self.C_tag
      } else {
        url = 'Index/RolePower/addPowerByStation'
        params.ptag = self.ptag
        params.tag = self.tag
      }

      self.$http
        .post(url, params)
        .then(() => {
          self.$message({
            type: 'success',
            message: '提交成功',
            duration: 1200,
            onClose() {
              self.$router.go(-1)
            }
          })
        })
    }
  },
  watch: {
    showInMenu(val) {
      this.$set(this.form, 'sort_num', val ? 1 : 0)
    }
  }
};
</script>

<style>
</style>
