import Vue from 'vue'

Vue.component("table-header-bar", () => import('components/public/tableHeaderBar'));
Vue.component("table-bottom-bar", () => import('components/public/tableBottomBar'));

Vue.component('time-range-picker', () => import('components/public/timeRangePicker'))

Vue.component('tinymce-editor', () => import('components/tinymceEditor'))
Vue.component('tinymce-preview', () => import('components/tinymcePreview'))
Vue.component('detail-checker', () => import('components/detailChecker'))
Vue.component('page-editor-template', () => import('components/pageEditorTemplate'))

