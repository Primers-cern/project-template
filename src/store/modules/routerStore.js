import { publicRoutes, indexRoutes } from '@/router/Router'

const NODE_ENV = process.env.NODE_ENV

// 构建菜单表方法
const generaMenu = rules => {
  let list = []
  rules.sort((a, b) => b.sort_num - a.sort_num)
  rules.forEach(item => {
    if (item.selected == 0 || item.sort_num == 0) return
    let obj = {
      title: item.title,
      icon: item.icon || 'el-icon-s-help',
      path: item.router_path,
    }

    // 一级菜单没有有路径
    if (!item.router_path && item.children.length) obj.children = generaMenu(Object.values(item.children)) // 没有子项时为数组
    list.push(obj)
  })

  return list
}

// 构建路由表方法
const generaRoutesList = (routesList, rules) => {
  rules.forEach(item => {
    if (item.router_path) {
      // 有路径就添加进路由
      if (item.selected == 0) return
      let obj = {
        path: item.router_path,
        name: item.router_path,
        meta: {
          title: item.title,
        },
        component: resolve => require(['pages/' + item.file_path], resolve),
      }
      routesList.push(obj)
    }

    if (item.children.length) generaRoutesList(routesList, Object.values(item.children)) // 继续遍历添加子级入路由
  })
}

const state = {
  hasGetRules: false,
  activityEdit: {},
  QAEdit: {},
}

const mutations = {
  CONCAT_ROUTES(state, { routesList, menuList }) {
    // 处理包裹页面的路由
    let indexPage = indexRoutes[0]
    indexPage.children = routesList

    if (NODE_ENV === 'development') indexPage.redirect = indexPage.path + '/home'
    // 测试服
    else if (NODE_ENV === 'production') indexPage.redirect = indexPage.path + '/' + routesList[0].path // 生产环境正式服

    state.routers = indexRoutes.concat(publicRoutes)
    state.menu = menuList
    state.hasGetRules = true
  },

  ACTIVITY_CACHE(state, data) {
    state.activityEdit = data || {}
  },

  QA_CACHE(state, data) {
    state.QAEdit = data || {}
  },
}

const actions = {
  concatRoutes({ commit }, rules) {
    return new Promise((resolve, reject) => {
      try {
        let routesList = []
        generaRoutesList(routesList, rules)

        let menuList = generaMenu(rules)

        // 完毕 插入路由并返回
        commit('CONCAT_ROUTES', {
          routesList,
          menuList,
        })

        resolve(state.routers)
      } catch (err) {
        reject(err)
      }
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
