<template>
  <!-- 订单 -->
  <div class="order-container">
    <!-- 页头 -->
    <div class="page-head">
      <el-page-header content="我的订单" title="首页" @back="toIndex">
      </el-page-header>
    </div>
    <!-- 页脚 -->
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "@/components/Footer";
export default {
  name: "UserOrder",
  components: {Footer},
  methods: {
    toIndex() {
      this.$router.push('/index')
    }
  }
}
</script>

<style lang="less" scoped>
.order-container {
  width: 100%;
}

.page-head {
  width: 1000px;
  margin: 20px auto auto;
  opacity: 0.8;
}
</style>