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

//导入全局样式表
import './assets/css/global.css'

//配置请求根路径
axios.defaults.baseURL = 'http://localhost:8080'

// 定义全局时间戳过滤器
Vue.filter('dateFormat', function (value) {
    if (value !== null) {
        return Moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
})
//定义全局性别过滤器
Vue.filter('genderFormat', function (value) {
    if (value === 'male') {
        return '男'
    } else if (value === 'female') {
        return '女'
    } else if (value === '' || value === null) {
        return ''
    }
})

Vue.prototype.logout = logout
Vue.prototype.checkRules = checkRules
Vue.prototype.$cookie = Cookies;
Vue.config.productionTip = false

//图片地址
Vue.prototype.baseUrl = 'http://localhost:8080'
Vue.prototype.adminHeadImg = Vue.prototype.baseUrl + '/uploadImg/adminHead/'
Vue.prototype.userHeadImg = Vue.prototype.baseUrl + '/uploadImg/userHead/'
Vue.prototype.bannerImg = Vue.prototype.baseUrl + '/uploadImg/banner/'
Vue.prototype.categoryImg = Vue.prototype.baseUrl + '/uploadImg/category/'
Vue.prototype.productImg = Vue.prototype.baseUrl + '/uploadImg/product/img/'
Vue.prototype.orderDetailImg = Vue.prototype.baseUrl + '/uploadImg/orderDetail/'

let vm = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

export default vm
