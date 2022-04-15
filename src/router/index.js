import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "@/views/Login";
import Regist from "@/views/Regist";
import Index from "@/views/Index";
import ProductList from "@/views/ProductList";
import UserCenter from "@/views/UserCenter";
import UserAddr from "@/views/UserAddr";
import ShoppingCart from "@/views/ShoppingCart";
import UserOrder from "@/views/UserOrder";
import ProductItem from "@/views/ProductItem";
import Cookies from 'js-cookie'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/regist',
        name: 'Regist',
        component: Regist,
    },
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: Index,
        children: [
            {
                path: '/index',
                name: 'Index',
                component: Index,
            },
            {
                path: '/productList',
                name: ProductList,
                component: ProductList
            },
            {
                path: '/userCenter',
                name: UserCenter,
                component: UserCenter
            },
            {
                path: '/userAddr',
                name: UserAddr,
                component: UserAddr
            },
            {
                path: '/shoppingCart',
                name: ShoppingCart,
                component: ShoppingCart
            },
            {
                path: '/userOrder',
                name: UserOrder,
                component: UserOrder
            },
            {
                path: '/productItem',
                name: ProductItem,
                component: ProductItem
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to：要访问的路径
    //from：从哪个路径来
    //next：放行函数
    //访问非登录页如果没有token强制跳转登录，有token时访问登录页强制跳转home页
    if (to.path === '/login') {
        if (Cookies.get('userToken')) {
            next({
                path: '/'
            })
        } else {
            next()
        }
    } else if (to.path === '/regist') {
        next()
    } else {
        if (Cookies.get('userToken')) {
            next()
        } else {
            if (to.path === '/index') {
                next()
            } else if (to.path === '/productList') {
                next()
            } else if (to.path === '/productItem') {
                next()
            } else {
                next({
                    path: '/login'
                })
            }
        }
    }

})

//解决重复点击路由异常
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router
