import Vue from 'vue'
import Vuex from 'vuex'
import routerStore from './modules/routerStore'
import tabStore from './modules/tabStore'

Vue.use(Vuex)
let vue = Vue.prototype
let $tools = vue.$tools,
  token_name = $tools.CONSTANT.token_name

const store = new Vuex.Store({
  state: {
    [token_name]: $tools.handleCookie.get(token_name),
    user_role: $tools.handleCookie.get('user_role'),
    user_id: $tools.handleCookie.get('user_id'),
    user_info: {},
    hasInfo: false,

    projectInfo: {
      needLoad: true,
    }
  },
  modules: {
    routerStore,
    tabStore
  },
  mutations: {
    // 设置cookie {操作类型， 名称， 设置时的参数}
    storeCookier(state, {
      opr,
      name,
      value,
      time,
      timeType
    }) {
      switch (opr) {
        case 'set': {
          $tools.handleCookie.set(name, value, time, timeType) // 设置 cookie 并获取过期时间戳
          state[name] = value
          break;
        }
        case 'del': {
          let delList = $tools.handleCookie.delete(name) // 清除 cookie 并获取删除了的键名
          for (let i in delList) state[delList[i]] = null;
          break;
        }
      }
    },
    // 保存用户信息
    setUserInfo(state, data) {
      state.user_info = data
    },
    setUserInfoStatus(state, status) {
      state.hasInfo = status
    },
    setProjectInfo(state, info) {
      state.projectInfo = info
    }
  },
  getters: {
    // 获取cookie
    getCookie: (state) => (name) => {
      let val = state[name],
        cookieVal = $tools.handleCookie.get(name)
      // 同时验证state和cookie，如果都存在且相等，即有效
      if (val && cookieVal && val == cookieVal) return val
      else return null
    },
  },
  actions: {
    // 登录成功后获取信息
    afterLogined(context) {
      let rolePowers = context.dispatch('authorization')
      let userInfo = context.dispatch('getUserInfo')
      // 两个都执行完毕后请求
      return Promise.all([rolePowers, userInfo])
    },

    // 验证角色获取权限表
    authorization({
      getters
    }) {
      return new Promise((resolve, reject) => {
        let
          url = 'getRolePowers',
          params = {
            role_tag: getters.getCookie('user_role')
          }
        vue.$http
          .get(url, { params })
          .then(res => {
            resolve(res.data)
          })
          .catch(res => {
            reject(res)
          })
      })
    },
    // 获取用户信息
    getUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        let id = state.user_id
        if (Number(id) === 0) { // 总管理员
          commit('setUserInfo', {
            title: '超级管理员',
            user_info: {}
          })
          return resolve()
        }

        let
          url = 'getBaseInfo',
          params = {
            id
          }

        vue.$http
          .get(url, {
            params
          })
          .then(res => {
            commit('setUserInfo', res.data)
            resolve(res.data)
          })
          .catch(res => {
            reject(res)
          })
      })
    },

    getProjectInfo({ commit, state }, reload) {
      return new Promise(resolve => {
        if (!reload && !state.projectInfo.needLoad) return resolve(state.projectInfo)

        let url = 'getProjectInfo'
        vue.$http(url)
          .then(data => {
            let res = data.data,
              info = JSON.parse(res.content || "{}")
            
            commit('setProjectInfo', info)
            resolve(info)
            document.title = info.title
          })
      })
    },
  }
})

export default store
