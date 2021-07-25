import Vue from 'vue'

Vue.component("table-header-bar", () => import('components/public/tableHeaderBar'));
Vue.component("table-bottom-bar", () => import('components/public/tableBottomBar'));

Vue.component('time-range-picker', () => import('components/public/timeRangePicker'))

Vue.component('tinymce-editor', () => import('components/tinymceEditor'))

