import Vue from 'vue'
import App from '@/App.vue'

import 'js/tools' // 引入公共方法库
import 'js/http' // 异步请求封装
import 'js/filter' // 引入filter
import 'js/useComponents' // 引入公共组件
import 'plugins/tinymce/useTinymce'
import 'plugins/element/element.js'

import store from '@/store'
import router from '@/router'

import '@css/reset.css'
import '@css/public.css'
import '@css/style.css'

Vue.prototype.window = window

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app')
