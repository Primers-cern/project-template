<template>
  <div class="home-wrapper">
    <el-row :gutter="20">
      <el-col :span="14">
        <!-- 数据总览 -->
        <el-card>
          <div slot="header">
            <span class="card-title">数据总览</span>
            <el-dropdown
              class="float-right pointer text-theme"
              trigger="click"
              @command="filterTimeType"
            >
              <span>
                {{timeObj[timeType.data] + (timeType.data == 0 ? '时间' : '')}}
                <i
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, key) in timeObj"
                  :key="key"
                  :disabled="timeType.data == key"
                  :command="{target: 'data', val: key}"
                >{{key == '0' ? item+'时间' : item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="d-flex justify-around text-center pt-2 pb-3">
            <div v-for="(item, index) in infoObj.data" :key="index">
              <p>{{item.title}}</p>
              <p class="info-data-num">{{item.num}}</p>
              <p class="text-info size-12">今日 {{item.today}}</p>
            </div>
          </div>
        </el-card>

        <!-- 热门发布 -->
        <el-card class="mt-3">
          <div class="center-flex justify-between" slot="header">
            <span class="card-title">热门发布</span>
            <span class="center-flex">
              <el-dropdown
                class="float-right pointer text-theme mr-3"
                trigger="click"
                @command="filterTimeType"
              >
                <span>
                  {{(timeType.hot == 0 ? '所有' : timeObj[timeType.hot]) + '发布'}}
                  <i
                    class="el-icon-arrow-down el-icon--right"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, key) in timeObj"
                    :key="key"
                    :disabled="timeType.hot == key"
                    :command="{target: 'hot', val: key}"
                  >{{item + '发布'}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-radio-group v-model="sortType.hot" size="mini" @change="getInfoHot">
                <el-radio-button v-for="(item, index) in sortObj" :key="index" :label="index">{{item}}</el-radio-button>
              </el-radio-group>
            </span>
          </div>
          <ul v-if="infoObj.hot.length" class="px-3" style="margin-top: -20px;">
            <li class="py-4 border-b" v-for="(item, index) in infoObj.hot" :key="index">
              <div class="d-flex justify-between">
                <p class="flex-1 w-0 line-one-max mr-5 size-16">{{item.title}}</p>
                <span class="text-info">{{$tools.date("yyyy-MM-dd", item.created)}}</span>
              </div>
              <div class="center-flex py-3 pb-2">
                <div class="flex-1 w-0 line-one-max">
                  <el-tag class="mr-2" size="small">{{regionMap[item.region_tag]}}</el-tag>
                  <el-tag
                    class="mr-2"
                    v-for="(item, index) in item.category_tag"
                    :key="index"
                    type="info"
                    size="small"
                  >{{categoryMap[item]}}</el-tag>
                </div>
                <span
                  class="text-info"
                >{{item.hits_num + ' 阅读 ' + item.comment_num + ' 观点 ' + item.praise_num + ' 点赞'}}</span>
              </div>
            </li>
          </ul>
          <p v-else class="text-muted text-center py-5">未有发布的文章</p>
        </el-card>
      </el-col>
      <el-col :span="10">
        <!-- 统计排名 -->
        <el-card>
          <div slot="header">
            <span class="card-title">统计排行</span>
          </div>
          <div class="d-flex justify-around py-2">
            <el-dropdown class="pointer text-theme" trigger="click" @command="filterRoleType">
              <span>
                {{rankRoleRype == 1 ? '镇级' : '村级'}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="rankRoleRype == 1" :command="1">镇级</el-dropdown-item>
                <el-dropdown-item :disabled="rankRoleRype == 2" :command="2">村级</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown
              class="float-right pointer text-theme"
              trigger="click"
              @command="filterSortType"
            >
              <span>
                {{sortObj[sortType.rank]}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, key) in sortObj"
                  :key="key"
                  :disabled="sortType.rank == key"
                  :command="{target: 'rank', val: key}"
                >{{item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown
              class="float-right pointer text-theme mr-3"
              trigger="click"
              @command="filterTimeType"
            >
              <span>
                {{(timeObj[timeType.rank]) + (timeType.rank == 0 ? '时间' : '')}}
                <i
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, key) in timeObj"
                  :key="key"
                  :disabled="timeType.rank == key"
                  :command="{target: 'rank', val: key}"
                >{{key == 0 ? item+'时间' : item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <ul class="px-3 py-2">
            <li
              class="center-flex justify-between py-4"
              v-for="(item, index) in infoObj.rank"
              :key="index"
            >
              <el-tag v-if="index < 3" type="danger" effect="dark">{{ index + 1 }}</el-tag>
              <el-tag v-else type="info">{{ index + 1 }}</el-tag>
              <p class="flex-1 w-0 line-one-max mx-4 size-16">{{item.role_info.title}}</p>
              <span class="text-info">{{item.total_num + ' ' + sortObj[sortType.rank]}}</span>
            </li>
          </ul>
          <p class="text-center text-muted py-3">显示发表过文章的前十名</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      timeObj: {
        "0": "所有",
        "1": "本周",
        "2": "本月",
        "3": "本季度",
        "4": "本年度"
      },
      sortObj: {
        // 热门筛选类型
        "1": "浏览量",
        "2": "评论数",
        "3": "点赞数",
        "4": "分享量"
      },
      rankRoleRype: 1,
      sortType: {
        hot: 1,
        rank: 1
      },
      timeType: {
        data: 0,
        hot: 0,
        rank: 0
      },
      infoObj: {
        data: [],
        rank: [],
        hot: []
      }
    };
  },
  computed: {
    categoryMap() {
      return ''
      // return this.$store.state.categoryStore.categoryMapArt;
    },
    regionMap() {
      return ''
      // return this.$store.state.regionStore.regionMap;
    }
  },
  mounted() {
    this.getInfo();
    // this.$store.dispatch("getRegion");
    // this.$store.dispatch("getCategory", { type: 1 });
  },
  methods: {
    getInfo() {
      let self = this;
      self.getInfoData();
      self.getInfoHot();
      self.getInfoRank();
    },
    // 数据总览
    getInfoData() {
      let self = this,
        url = "Index/ArticleStat/getArticleStat",
        params = { check_type: self.timeType.data };

      self.$http.get(url, { params }).then(res => {
        let data = res.data,
          list = [
            {
              title: "文章数量",
              num: data.article_total,
              today: data.article_today
            },
            {
              title: "阅读用户",
              num: data.read_total,
              today: data.read_today
            },
            {
              title: "用户观点",
              num: data.comment_total,
              today: data.comment_today
            }
          ];

        self.$set(self.infoObj, "data", list);
      });
    },
    // 热门文章
    getInfoHot() {
      let self = this,
        url = "Index/ArticleStat/getArticleRankList",
        params = {
          sort_type: self.sortType.hot,
          check_type: self.timeType.hot
        };

      self.$http.get(url, { params }).then(res => {
        self.$set(self.infoObj, "hot", res.data.data);
      });
    },
    // 排行
    getInfoRank() {
      let self = this,
        url = "Index/ArticleStat/getRankList",
        params = {
          role_type: self.rankRoleRype,
          sort_type: self.sortType.rank,
          check_type: self.timeType.rank
        };

      self.$http.get(url, { params }).then(res => {
        self.$set(self.infoObj, "rank", res.data);
      });
    },

    // 时间筛选
    filterTimeType({ target, val }) {
      let self = this;
      self.$set(self.timeType, target, val);
      self.$nextTick(() => {
        switch (target) {
          case "data":
            self.getInfoData();
            break;
          case "hot":
            self.getInfoHot();
            break;
          case "rank":
            self.getInfoRank();
            break;
        }
      });
    },

    // 类型筛选
    filterSortType({ target, val }) {
      let self = this;
      self.$set(self.sortType, target, val);
      self.$nextTick(() => {
        switch (target) {
          case "data":
            self.getInfoData();
            break;
          case "hot":
            self.getInfoHot();
            break;
          case "rank":
            self.getInfoRank();
            break;
        }
      });
    },

    // 排行村镇筛选
    filterRoleType(val) {
      let self = this;
      self.rankRoleRype = val;
      self.getInfoRank();
    }
  }
};
</script>

<style scoped>
.home-wrapper {
  overflow-x: hidden;
}
.home-wrapper >>> .el-card__header {
  border: none;
}
.card-title {
  color: var(--info-color);
  font-weight: bold;
  padding-left: 12px;
  border-left: 5px solid var(--theme-color);
}

.info-data-num {
  color: var(--theme-color);
  font-size: 28px;
  font-weight: bold;
  padding: 14px 0;
}
</style>
