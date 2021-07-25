import { createRouter, createWebHistory } from 'vue-router'
import tools, { CONSTANT } from 'js/tools'
import store from '@/store'

const routes = [
  { path: "/", name: 'index', component: () => import('pages/index.vue') },
  { path: '/login', name: 'login', component: () => import('pages/login.vue') },
  { path: '/test', name: 'test', component: () => import('pages/test.vue') },
  { path: '/:pathMatch(.*)*', name: '404', component: () => import('pages/error.vue') },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to, from) => {
  const { name, fullPath } = to
  if (!store[CONSTANT.tokenName].value) return name === 'login' || { name: 'login', replace: true }

  // 判断是否已经获得了用户信息
  if (!store.userInfo.value.need) return true

  // 构建路由表
  const { authority } = await store.getUserInfo()
  extendRoutes(authority)

  return fullPath == '/' ? authority[0].router_path : fullPath
})

router.afterEach((to, from) => {
  const
    tabInfo = store.tabInfo,
    keepAlive = !!tabInfo.map.get(to.name),
    keepScroll = !!tabInfo.map.get(from.name)

  const { save_scroll, active_tab, add_tab } = store.tabTools

  if (keepScroll) save_scroll(from.name)

  if (keepAlive) {
    let
      exist = tabInfo.list.includes(to.name),
      scrollVal = tabInfo.scroll.get(to.name);

    (exist ? active_tab : add_tab)(to.name)
    if (scrollVal > 0) setTimeout(() => tools.setScrollTop({ value: scrollVal }), 0)
  } else active_tab('')
})


function extendRoutes(rules) {
  rules.forEach(item => {
    item.file_path && router.addRoute('index', {
      path: item.router_path,
      name: item.router_path,
      meta: { title: item.title },
      component: () => import(`./pages/${item.file_path}.vue`),
    })

    item.children.length && extendRoutes(item.children) // 继续遍历添加子级入路由
  })
}

export default router
