import Tools from 'js/tools'

const recursion = (map, list) => {
  for (let item of list) {
    if (+item.sort_num > 0 && item.router_path) map.set(item.router_path, item.title)
    if (item.children.length) recursion(map, item.children)
  }
}

const state = {
  tabMap: new Map(),
  scrollMap: new Map(),
  activeTab: '',
  tabList: [],
}

const mutations = {
  buildTabMap(state, rules) {
    let map = new Map()
    recursion(map, rules)
    state.tabMap = map
  },

  add_tab(state, name) {
    if (state.tabList.length >= 12) state.tabList.shift()
    state.tabList.push(name)
    state.activeTab = name
  },

  del_tab(state, name) {
    let index = state.tabList.findIndex(item => item == name)
    state.tabList.splice(index, 1)
  },

  active_tab(state, name) {
    state.activeTab = name
  },

  reset_tab(state) {
    state.tabList = []
    state.activeTab = ''
  },

  save_scroll(state, name) {
    let scrollTop = Tools.getScrollTop()
    state.scrollMap.set(name, scrollTop)
  },
}

const actions = {}

export default {
  state,
  mutations,
  actions,
}
