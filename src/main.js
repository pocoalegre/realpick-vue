import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import Cookies from 'js-cookie'
import Moment from 'moment'
import './plugins/element.js'
import logout from './assets/js/logout'
import checkRules from './assets/js/checkRules'
import VueParticles from 'vue-particles'

//登录注册粒子特效
Vue.use(VueParticles)

//配置请求根路径
axios.defaults.baseURL = 'http://localhost:8080'

// 定义全局时间戳过滤器
Vue.filter('dateFormat', function (value) {
  if (value !== null){
    return Moment(value).format('YYYY-MM-DD HH:mm:ss')
  }
})

Vue.prototype.logout = logout
Vue.prototype.checkRules = checkRules
Vue.prototype.$cookie = Cookies;
Vue.config.productionTip = false

let vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export default vm
