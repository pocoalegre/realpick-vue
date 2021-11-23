import Cookies from 'js-cookie'
import that from '../../main'

//注销登录
export default function logout() {
    Cookies.remove('userToken')
    Cookies.remove('userId')
    Cookies.remove('userImg')
    Cookies.remove('userNickname')
    that.$router.push('/login')
}
