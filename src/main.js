import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import publicComponents from 'js/publicCompnents'

import 'css/reset.css'
import 'element-plus/lib/theme-chalk/index.css';
import 'virtual:windi.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus, { locale })
for (let key in publicComponents) app.component(key, publicComponents[key])
app.mount('#app')
