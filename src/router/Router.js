export const indexRoutes = [ // 获取权限后一些默认共有的页面
  {
    path: '/index',
    name: 'index',
    meta: {
      title: '后台主页'
    },
    component: () => import('pages/index'),
    children: []
  },

]
export const publicRoutes = [ // 未登陆前可用的页面
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('pages/login')
  }, {
    path: '*',
    name: 'error',
    mata: {
      title: '出错拉'
    },
    component: () => import('pages/error')
  }
]
