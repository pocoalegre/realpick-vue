<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <!-- 头部外壳 -->
      <div class="header-out-box">
        <!-- 头部内壳 -->
        <div class="header-in-box">
          <!-- 菜单 -->
          <el-menu
              :default-active="activePath"
              mode="horizontal"
              background-color="#444444"
              text-color="#fff"
              active-text-color="#ffd04b">
            <el-menu-item index="a" @click.native="toIndex">首页</el-menu-item>
            <el-menu-item index="b" @click.native="toProductList">服装优选</el-menu-item>
            <el-menu-item index="c" @click.native="toShoppingCart">购物车</el-menu-item>
            <el-menu-item index="d" @click.native="toUserOrder">我的订单</el-menu-item>
            <div v-if="userId">
              <el-dropdown placement="bottom-end" trigger="click">
                <!-- 用户信息 -->
                <div class="user-info">
                  <el-avatar shape="circle" :size="40" :src="userImg"></el-avatar>
                  <span class="user-nickname">{{userNickname}}</span>
                </div>
                <el-dropdown-menu slot="dropdown" class="dropdown-menu-user">
                  <el-dropdown-item @click.native="toUserCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item @click.native="toUserAddr">我的地址</el-dropdown-item>
                  <el-dropdown-item @click.native="userLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div v-else>
              <!-- 未登录 -->
              <el-button type="info" size="mini" class="please-login" @click="toLogin">请登录！</el-button>
            </div>
          </el-menu>
        </div>
      </div>
    </el-header>
    <!-- 主体区 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return {
      //活动页面
      activePath: 'a',
      //服装搜索
      queryInfo: '',
      //用户信息
      userId: this.$cookie.get('userId'),
      userNickname: this.$cookie.get('userNickname'),
      userImg: this.userHeadImg + this.$cookie.get('userImg'),
    }
  },
  methods: {
    toLogin() {
      this.$router.push('/login')
    },
    toUserCenter() {
      this.$router.push('/userCenter')
    },
    toUserAddr() {
      this.$router.push('/userAddr')
    },
    userLogout() {
      this.logout()
    },
    toIndex() {
      this.$router.push('/index')
    },
    toProductList() {
      this.$router.push('/productList')
    },
    toShoppingCart() {
      this.$router.push('/shoppingCart')
    },
    toUserOrder() {
      this.$router.push('/userOrder')
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  padding: 0;
}

.header-out-box {
  width: 100%;
  height: 60px;
  background-color: #444444;
  .header-in-box {
    width: 1140px;
    height: 60px;
    margin: auto;
    position: relative;
    .el-menu {
      width: 342px;
      display: flex;
      justify-content: left;
      .user-info {
        cursor:pointer;
        display: flex;
        align-items: center;
        margin-top: 10px;
        margin-left: 640px;
        .user-nickname {
          font-size: 15px;
          color: #fff;
          margin-left: 8px;
        }
      }
      .please-login {
        transform: translate(680px, 60%);
      }
    }
  }
}

.dropdown-menu-user {
  transform: translate(50%);
}

.el-main {
  background-color: #f7f7f7;
  padding: 0;
}
</style>
