<template>
  <div class="content-wrapper">
    <el-input placeholder="关键字搜索" v-model="filterText" clearable class="w-50 mb-3"></el-input>
    <div class="w-50 pt-3 pb-4">
      <el-tree
        ref="tree"
        node-key="tag"
        show-checkbox
        :data="list"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        :filter-node-method="filterNode"
      ></el-tree>
    </div>
    <!-- default-expand-all -->
    <div class="page-opr-btn-box pt-4">
      <el-button type="primary" @click="handleSubmit">提交保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "roleEdit",
  data() {
    return {
      tag: this.$route.query.tag || "a002",
      expandedKeys: [],
      checkedKeys: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      list: [],
      filterText: "",
    };
  },
  mounted() {
    let self = this;
    self.getInfo();
  },
  methods: {
    getInfo() {
      let self = this,
        url = "Index/RolePower/getRolePowersByStation",
        params = { role_tag: self.tag };

      self.$http.get(url, { params }).then((res) => {
        self.list = self.formatData(res.data);
      });
    },
    // 格式化数据
    formatData(data) {
      let self = this,
        resultList = [];

      for (let i in data) {
        let item = data[i],
          obj = {
            tag: item.tag,
            title: item.title + " (" + item.tag + ")",
          };
        if (item.selected === 1) self.checkedKeys.push(item.tag);
        if (!Object.prototype.hasOwnProperty.call(item.children, "length"))
          obj.children = self.formatData(item.children);

        resultList.push(obj);
      }
      return resultList;
    },
    // 筛选方法
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    //
    handleSubmit() {
      let self = this,
        checked = self.$refs.tree.getCheckedKeys(),
        url = "Index/RolePower/editRolePowersByStation",
        params = {
          role_tag: self.tag,
          role_powers: checked.join(","),
        };

      self.$http.post(url, params).then(() => {
        self.$message({
          type: "success",
          message: "保存成功",
          duration: 1200,
          onClose() {
            self.$router.go(-1);
          },
        });
      });
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>

<style>
</style>
