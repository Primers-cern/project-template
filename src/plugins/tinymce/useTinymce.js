import Vue from 'vue'

import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'

//主题
import 'tinymce/themes/silver'

//插件
import 'tinymce/plugins/image' //图片插件
import 'tinymce/plugins/fullscreen' //全屏插件
import 'tinymce/plugins/link' //全屏插件

/**
 * 注：
 * 5.3.x版本需要额外引进图标，没有所有按钮就会显示not found
 */
import 'tinymce/icons/default/icons'

//本地化
import './langs/zh_CN.js'

Vue.prototype.$tinymce = tinymce
Vue.use(VueTinymce)


