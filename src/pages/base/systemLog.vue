<template>
  <div class="full-content">
    <div class="content-wrapper filter-wrapper">
      <div class="px-4 pt-3">
        <el-form label-position="left" label-width="96px" :model="filterInfo" size="medium">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="用户ID：">
                <el-input v-model="filterInfo.user_id" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="记录时间：">
                <el-date-picker
                  v-model="C_timeRange"
                  :editable="false"
                  type="datetimerange"
                  value-format="timestamp"
                  format="yyyy-MM-dd HH:mm"
                  align="center"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="$tools.timeRangeOpt(2)"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="text-right">
              <el-button size="small" @click="handleFilter(true)">重置</el-button>
              <el-button type="primary" size="small" @click="handleFilter(false)">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 内容 -->
    <div class="content-wrapper mt-3 flex-1">
      <table-header-bar hide-btn>
        <template #filter>
          <el-radio-group v-model="filterInfo.search_type" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button :label="1">管理员</el-radio-button>
            <el-radio-button :label="2">用户</el-radio-button>
          </el-radio-group>
        </template>
      </table-header-bar>

      <el-table :data="list" stripe style="width: 100%" header-cell-class-name="bg-gray">
        <el-table-column label="时间" width="180">
          <template slot-scope="scope">
            <div class="text-info">{{ $tools.date('yyyy-MM-dd HH:mm:ss', scope.row.created) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="编号" width="120"></el-table-column>
        <el-table-column label="角色信息">
          <template slot-scope="{ row }">
            <div v-if="row.role == 'user'" class="center-flex">
              <el-tag size="small" class="mr-2">用户</el-tag>
              <el-popover placement="bottom-start" trigger="hover" :content="row.user_id">
                <div slot="reference" class="text-one-line pr-3">{{ row.user_info.nickname }}</div>
              </el-popover>
            </div>
            <el-tag v-if="row.role == 'admin'" type="warning">管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="option_action" label="记录类型"></el-table-column>
        <el-table-column prop="option_result" label="记录结果"></el-table-column>
        <el-table-column prop="remark" label="记录内容"></el-table-column>
      </el-table>
      <table-bottom-bar :page-info="pageInfo" @page-change="getList">
        <el-button size="small" type="primary" plain>批量导出</el-button>
      </table-bottom-bar>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'systemLog',
    data() {
      return {
        pageInfo: {
          current: 1,
          limit: 30,
          total: '',
        },
        filterInfo: {
          search_type: '',
          start_time: '',
          end_time: '',
        },

        list: [],
      }
    },
    computed: {
      C_timeRange: {
        get() {
          let self = this,
            start = self.filterInfo.start_time,
            end = self.filterInfo.end_time
          return start && end ? [start + '000', end + '000'] : '' // 补充000成标准时间戳
        },
        set(arr) {
          let self = this
          if (arr) {
            self.filterInfo.start_time = arr[0].toString().substring(0, 10) // 秒为单位，10位时间戳
            self.filterInfo.end_time = arr[1].toString().substring(0, 10)
          } else {
            self.filterInfo.start_time = ''
            self.filterInfo.end_time = ''
          }
        },
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      handleFilter(reset) {
        let self = this
        if (reset)
          self.filterInfo = {
            search_type: '',
            start_time: '',
            end_time: '',
          }

        // 重置分页
        self.getList(1)
      },
      // 获取列表
      getList(page) {
        let self = this,
          url = 'Index/EsBase/getOptionList',
          params = self.$tools.handleParams(self.filterInfo, self.pageInfo, {
            page,
          })

        self.$http(url, { params }).then(data => {
          let res = data.data,
            list = res.data

          list.map(item => {
            item.role = item.user_info.role_tag == 'a001' ? 'user' : 'admin'
          })

          self.list = list

          for (let i in self.pageInfo) self.$set(self.pageInfo, i, +res[i])
        })
      },
    },
  }
</script>

<style></style>
