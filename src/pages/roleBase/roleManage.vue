<template>
  <div class="full-content">
    <div class="content-wrapper flex-1">
      <el-row type="flex" class="pb-3" justify="space-between">
        <el-col :span="12"></el-col>
        <el-col :span="12" class="text-right">
          <el-button size="small" type="primary" @click="handleEdit">添加新角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="tag" label="标识"></el-table-column>
        <el-table-column prop="title" label="名称"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{total_status[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="$router.push({name: 'roleEdit', query: {tag: scope.row.tag}})"
            >编辑权限</el-button>
            <el-button size="small" type="text" @click="handleEdit(scope.row)">修改名称</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑框 -->
      <el-dialog :title="'角色' + (isEdit ? '编辑' : '添加')" :visible.sync="showDialog" width="400px">
        <el-form :model="form">
          <el-form-item label="角色标识">
            <el-input v-model="form.tag" autocomplete="off" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "roleManage",
  data() {
    return {
      total_status: {},
      tableData: [],
      showDialog: false,
      isEdit: false,
      form: {
        tag: '',
        title: '',
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let self = this,
        url = "Index/RoleBase/getRoleListByStation";

      self.$http.get(url).then(res => {
        self.total_status = res.data.total_status;
        self.tableData = res.data.data;
      });
    },
    // 编辑
    handleEdit({ tag = '', title = '' }) {
      let self = this
      
      self.isEdit = !!tag
      self.form = { tag, title }
      self.showDialog = true
    },
    // 提交
    handleSubmit() {
      let self = this,
          url = self.isEdit ? 'Index/RoleBase/editRoleByStation' : 'Index/RoleBase/addRoleByStation',
          params = self.form
      
      if (!params.title || !params.tag) {
        self.$message.error('请完整填写信息')
        return
      }

      self.$http
        .post(url, params)
        .then(() => {
          self.$message.success('提交成功')
          self.getList()
          self.showDialog = false
        })
        
    }
  }
};
</script>

<style>
</style>
