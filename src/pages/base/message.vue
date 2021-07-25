<template>
  <div class="full-content">
    <div class="content-wrapper filter-wrapper">
      <div class="px-4">
        <el-form label-position="left" label-width="96px" :model="filterInfo" size="medium">
          <el-row :gutter="100">
            <el-col :span="8">
              <el-form-item label="用户ID：">
                <el-input v-model="filterInfo.user_id" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发送时间：">
                <time-range-picker
                  :start.sync="filterInfo.start_time"
                  :end.sync="filterInfo.end_time"
                ></time-range-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="text-right pt-2">
        <el-button size="small" @click="handleFilter(true)">重置</el-button>
        <el-button type="primary" size="small" @click="handleFilter(false)">查询</el-button>
      </div>
    </div>

    <!-- 内容 -->
    <div class="content-wrapper mt-3 flex-1">
      <el-table :data="list" stripe style="width: 100%" header-cell-class-name="bg-gray">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column label="用户">
          <template slot-scope="{row: {user_info}}">
            <div class="center-flex">
              <div class="size-0">
                <el-avatar
                  shape="square"
                  size="large"
                  fit="cover"
                  :src="user_info.profile_picture"
                ></el-avatar>
              </div>
              <div class="flex-1 pl-2">
                <p class>{{user_info.nickname}}</p>
                <el-popover placement="bottom-start" trigger="hover" :content="user_info.uid">
                  <div
                    slot="reference"
                    class="text-one-line pr-3 size-12 text-info"
                  >{{ user_info.uid }}</div>
                </el-popover>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="{row}">
            <p class>{{row.title}}</p>
            <el-popover placement="bottom-start" trigger="hover" :content="row.content">
              <div slot="reference" class="text-one-line pr-3 size-12 text-info">{{ row.content }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="{ row: {status} }">
            <span v-if="status == 1" class="text-info">未读</span>
            <span v-else class="text-success">已读</span>
          </template>
        </el-table-column>

        <el-table-column label="时间" width="180">
          <template slot-scope="{ row }">
            <p class="size-12 text-info">发送：{{row.created | date}}</p>
            <p class="size-12 text-info">已读：{{(row.status == 2 ? row.updated : '-') | date}}</p>
          </template>
        </el-table-column>
      </el-table>
      <table-bottom-bar :page-info="pageInfo" @page-change="getList" />
    </div>

    <detail-checker
      :detail="detail.data"
      :time="detail.showTime"
      :author="detail.showAuthor"
      @closed="detail.data = {}"
    />
  </div>
</template>

<script>
export default {
  name: "message",
  data() {
    return {
      pageInfo: {
        current: 1,
        limit: 10,
        total: ""
      },

      filterInfo: {
        user_id: "",
        start_time: "",
        end_time: ""
      },

      list: [],

      detail: {
        data: {}
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleFilter(reset) {
      let self = this;
      if (reset)
        self.filterInfo = {
          id: "",
          title: "",
          data_content: "",
          type: "",
          start_time: "",
          end_time: ""
        };

      // 重置分页
      self.getList(1);
    },

    // 获取列表
    getList(page) {
      let self = this,
        url = "Index/UserMessage/getMessageListByStation",
        params = self.$tools.handleParams(self.filterInfo, self.pageInfo, {
          page
        });

      self.$http.get(url, { params }).then(data => {
        let res = data.data;

        self.list = res.data;

        for (let i in self.pageInfo) self.$set(self.pageInfo, i, +res[i]);
      });
    }
  }
};
</script>

<style></style>
