import { ref, reactive } from "vue";
import tools from "js/tools";

const tokenName = tools.CONSTANT.tokenName

// 登录相关
const cookieSession = ref(tools.handleCookie.get(tokenName) || "");
const updateToken = (token, day) => {
  tools.handleCookie.set(tokenName, token, day);
  cookieSession.value = token;
}

// 用户信息
const userInfo = ref({ need: true })
const getUserInfo = async () => {
  const
    { data: info } = await tools.http.get('getBaseInfoByUser'),
    { data: authority } = await tools.http.get('getRolePowers', { params: { role_tag: info.role_tag } })

  info.authority = authority
  userInfo.value = info
  tabTools.buildTabMap(authority)
  return Promise.resolve(info)
}

// 标签相关
const tabInfo = reactive({
  map: new Map(),
  scroll: new Map(),
  list: [],
  active: ''
})
const tabTools = {
  buildTabMap(rules) {
    rules.forEach(item => {
      if (item.sort_num == 0) return
      tabInfo.map.set(item.router_path, item.title)
      item.children.length && tabTools.buildTabMap(item.children)
    });
  },

  add_tab(name) {
    if (tabInfo.list.length >= 12) tabInfo.list.shift()
    tabInfo.list.push(name)
    tabInfo.active = name
  },

  del_tab(name) {
    let index = tabInfo.list.findIndex(item => item == name)
    tabInfo.list.splice(index, 1)
  },

  active_tab(name) {
    tabInfo.active = name
  },

  save_scroll(name) {
    let scrollTop = tools.getScrollTop()
    tabInfo.scroll.set(name, scrollTop)
  },
}

// 配置相关
const menuCollapse = ref(!!tools.handleCookie.get('menuCollapse'));
const toggleMenuCollapse = () => {
  const status = !menuCollapse.value
  menuCollapse.value = status
  tools.handleCookie.set('menuCollapse', status, status ? 1 : -1)
}


// 公共参数
const ossOptions = ref({})
const getOssOptions = () => {
  if (ossOptions.value.policy) return Promise.resolve(ossOptions.value)
  const
    url = "getBaseInfoByUser",
    params = { upload_type: "image" }

  return tools.http
    .get(url, { params })
    .then(data => {
      const res = data.data
      ossOptions.value = res
      return res
    })
}

export default {
  userInfo,
  getUserInfo,
  [tokenName]: cookieSession,
  updateToken,
  tabInfo,
  tabTools,
  menuCollapse,
  toggleMenuCollapse,
  getOssOptions
}

