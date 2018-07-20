// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
// 用来测试
import Vue from 'vue'
import App from './App'
import router from './router'

import fastclick from 'fastclick'

import lazyload from 'vue-lazyload'
import store from './store'

// 直接在main里面引入了styl样式,这种方式也可以同时引入CSS基本是所有的预处理器了。
import 'common/stylus/index.styl'


fastclick.attach(document.body)

Vue.use(lazyload,{
   loading:require('common/image/default.png')
})

Vue.config.productionTip = false


// 这里如果需要新的API的话，就需要把babel-polyfill引进来，就是一个编译ES6新API的方法

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
