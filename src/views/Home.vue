<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <!-- 头部外壳 -->
      <div class="header-out-box">
        <img class="logo-style" src="../assets/logo.png" alt="">
        <!-- 头部内壳 -->
        <div class="header-in-box">
          <!-- 菜单 -->
          <el-menu
              :default-active="activePath"
              mode="horizontal"
              background-color="#444444"
              text-color="#fff"
              active-text-color="#ffd04b">
            <el-menu-item index="/index" @click.native="toIndex('/index')">首页</el-menu-item>
            <el-menu-item index="/productList" @click.native="toProductList('/productList')">服装优选</el-menu-item>
            <el-menu-item index="/shoppingCart" @click.native="toShoppingCart('/shoppingCart')">购物车</el-menu-item>
            <el-menu-item index="/userOrder" @click.native="toUserOrder('/userOrder')">我的订单</el-menu-item>
            <div v-if="userId">
              <el-dropdown placement="bottom-end" trigger="click">
                <!-- 用户信息 -->
                <div class="user-info">
                  <el-avatar shape="circle" :size="40" :src="userImg"></el-avatar>
                  <span class="user-nickname">{{ userNickname }}</span>
                </div>
                <el-dropdown-menu slot="dropdown" class="dropdown-menu-user">
                  <el-dropdown-item @click.native="toUserCenter('/userCenter')">个人中心</el-dropdown-item>
                  <el-dropdown-item @click.native="toUserAddr('/userAddr')">我的地址</el-dropdown-item>
                  <el-dropdown-item @click.native="userLogout()">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div v-else>
              <!-- 未登录 -->
              <el-button type="info" size="mini" class="please-login" @click="toLogin('/login')">请登录！</el-button>
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
  created() {
    this.activePath = this.$cookie.get('userActivePath')
  },
  data() {
    return {
      //用户信息
      userId: this.$cookie.get('userId'),
      userNickname: this.$cookie.get('userNickname'),
      userImg: this.userHeadImg + this.$cookie.get('userImg'),
      //选中路径
      activePath: '',
    }
  },
  methods: {
    toLogin(path) {
      this.$router.push(path)
    },
    toUserCenter(path) {
      this.$router.push(path)
    },
    toUserAddr(path) {
      this.$router.push(path)
    },
    userLogout() {
      this.logout()
    },
    toIndex(path) {
      this.$router.push(path)
    },
    toProductList(path) {
      this.$router.push(path)
    },
    toShoppingCart(path) {
      this.$router.push(path)
    },
    toUserOrder(path) {
      this.$router.push(path)
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
  display: flex;
  justify-content: center;
  align-items: center;

  .logo-style {
    width: 45px;
    height: 45px;
  }

  .header-in-box {
    width: 1140px;
    height: 60px;

    .el-menu {
      display: flex;
      justify-content: center;
      align-items: center;

      .user-info {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-left: 650px;

        .user-nickname {
          font-size: 15px;
          color: #fff;
          margin-left: 10px;
        }
      }

      .please-login {
        margin-left: 650px;
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
