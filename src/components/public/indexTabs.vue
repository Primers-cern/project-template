<template>
  <div class="router-tab-wrapper flex-1 w-0 pr-5">
    <el-tabs v-model="active" class="router-tab" type="card" :closable="list.length > 1" @tab-remove="closeTab">
      <el-tab-pane v-for="item in list" :key="item" :label="tabMap.get(item)" :name="item"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'indexTabs',
    data() {
      return {}
    },
    computed: {
      tabStore() {
        return this.$store.state.tabStore
      },
      active: {
        set(val) {
          if (!val) return
          this.$router.push(val)
        },
        get() {
          return this.tabStore.activeTab
        },
      },
      list() {
        return this.tabStore.tabList
      },
      tabMap() {
        return this.tabStore.tabMap || {}
      },
    },
    mounted() {},
    methods: {
      closeTab(name) {
        let self = this,
          currentIndex = self.list.findIndex(item => item == name)
          
        self.$store.commit('del_tab', name)

        if (name === self.active) {
          let takePlace = self.list[currentIndex - 1] || self.list[currentIndex]
          self.$router.push(takePlace)
        }
      },
    },
  }
</script>

<style>
  .router-tab-wrapper {
    align-self: flex-end;
  }
  .router-tab .el-tabs__header {
    border: none;
    margin: 0;
  }
  .router-tab .el-tabs__nav {
    border-color: var(--background-color) !important;
  }
  .router-tab .el-tabs__item {
    padding: 0 18px !important;
    border-bottom: none !important;
    border-color: var(--background-color) !important;
    color: var(--info-color);
    transition: all 0.2s;
  }

  .router-tab .el-tabs__item:hover {
    color: var(--theme-color);
  }

  .router-tab .is-active {
    color: var(--theme-color);
    font-weight: bold;
    background-color: var(--background-color);
  }

  .router-tab .el-icon-close {
    position: relative;
    left: 8px;
    margin: 0;
  }
</style>
