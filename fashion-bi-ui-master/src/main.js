import Vue from 'vue'
import echarts from 'echarts'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import store from './store'
import './mixi'
Vue.config.productionTip = false

Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
