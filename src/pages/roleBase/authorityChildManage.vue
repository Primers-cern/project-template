<template>
  <div class="full-content">
    <div class="content-wrapper flex-1">
      <el-row type="flex" class="pb-3" justify="sapce-between">
        <el-col :span="12">
          <el-tag type="warning">{{parentName}} - 子权限</el-tag>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-button size="small" type="primary" @click="$router.push({name: 'authorityEdit', query: {ptag}})">添加权限</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="tag" label="标识"></el-table-column>
        <el-table-column prop="title" label="名称"></el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <span v-if="scope.row.sort_num == 0" class="text-muted">隐藏</span>
            <span v-else>{{scope.row.sort_num}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="$router.push({name: 'authorityEdit', query: {tag: scope.row.tag}})">编辑</el-button>
            <el-popconfirm title="确认删除该条权限" class="pl-2" @confirm="handleDelete(scope.row.tag)">
              <el-button slot="reference" size="small" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "authorityChildManage",
  data() {
    return {
      ptag: this.$route.query.ptag || '',
      parentName: this.$route.query.name || '',
      tableData: []
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let self = this,
          url = 'Index/RolePower/getPowerListByStation',
          params = { ptag: self.ptag }
      
      self.$http.get(url, { params }).then(res => { this.tableData = res.data.data})
    },
    // 删除
    handleDelete(tag) {
      let self = this,
          url = 'Index/RolePower/delPowerByStation',
          params = { power_tag: tag }
          
      self.$http
        .get(url, { params })
        .then(() => {
          self.$message.success('删除成功')
          self.getList()
        })
    }
  }
};
</script>

<style>
</style>
