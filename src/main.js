import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store'
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
import ElementUI from 'element-ui'
import '@/assets/scss/element-variables.scss'
import '@/assets/scss/reset.scss'
Vue.use(ElementUI)

// echarts
import echarts from "echarts"
Vue.prototype.$echarts = echarts

// 自定义组件--弹框
import PopOver from '@/components/PopOver/index.js'
Vue.use(PopOver)

// 防抖
import debounce from '@/utils/debounce.js'
Vue.use(debounce)

import axios from 'axios';
Vue.prototype.$axios = axios;

import https from '@/https/https.js'
Vue.prototype.$https = https;

// 校准数值运算方法的精确度
import calculate from '@/utils/calculate'
Vue.prototype.$calculate = calculate

// 阻止显示生产模式的消息
Vue.config.productionTip = false

// 环境配置
// console.log('当前环境', process.env);

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth == true) {
    if (to.meta.title) {
      const title = to.meta.title + "-俪凝美聚"
      document.title = title
    } else {
      document.title = "俪凝美聚"
    }

    if (localStorage.getItem('isLogin') == 'false' || localStorage.getItem('isLogin') == '' || localStorage.getItem('isLogin') == null || localStorage.getItem('isLogin') == 'undefined') {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
