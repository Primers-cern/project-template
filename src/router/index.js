import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { publicRoutes } from './Router'
import Tools from 'js/tools'

Vue.use(Router)

// 处理两次跳转相同时的报错
const routerPush = Router.prototype.push
Router.prototype.push = function (location) {
  return routerPush.call(this, location).catch(error => error)
}

const router = new Router({ routes: publicRoutes })

router.beforeEach((to, from, next) => {
  // 判断是否需要登录
  const needLogin = store.getters.getCookie(Tools.CONSTANT.token_name) ? false : true
  if (needLogin) return to.name === 'login' ? next() : next({ name: 'login' })

  // 判断是否已经获得了用户信息
  const hasInfo = store.state.hasInfo
  if (hasInfo) return next()
  // 前面未能跳转，则进行权限获取
  store
    .dispatch('afterLogined')
    .then(res => {
      // 后台验证角色，返回 rules 权限表
      let rules = res[0]
      store.commit('setUserInfoStatus', true)
      store.commit('buildTabMap', rules)
      store
        .dispatch('concatRoutes', rules)
        .then(routers => {
          // 对权限表进行处理，返回路由表
          router.matcher = new Router().matcher // 防止重复的路由项
          router.addRoutes(routers)
          next({ name: 'index' })
        })
        .catch(() => {
          next({ name: 'error' })
        })
    })
    .catch(() => {
      store.commit('storeCookier', { opr: 'del' }) // 身份验证失败，清空 token 等信息
      next({ name: 'login' })
    })
})

router.afterEach((to, from) => {
  let tabStore = store.state.tabStore,
    keepAlive = !!tabStore.tabMap.get(to.name),
    keepScroll = !!tabStore.tabMap.get(from.name)

  if (keepScroll) store.commit('save_scroll', from.name)

  if (keepAlive) {
    let exist = tabStore.tabList.includes(to.name),
      scrollVal = tabStore.scrollMap.get(to.name)

    store.commit(exist ? 'active_tab' : 'add_tab', to.name)
    if (scrollVal > 0) setTimeout(() => Tools.setScrollTop({ value: scrollVal }), 0)
  } else store.commit('active_tab', '')
})

export default router
