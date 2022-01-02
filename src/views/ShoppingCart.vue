<template>
  <!-- 购物车 -->
  <div class="shopping-cart-container">
    <!-- 页头 -->
    <div class="page-head">
      <el-page-header content="购物车" title="首页" @back="toIndex">
      </el-page-header>
    </div>
    <div class="card-container">
      <el-card>
        <el-card v-for="(o) in 4" class="card-box">

        </el-card>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[4]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShoppingCart",
  created() {
    this.$cookie.set('userActivePath', '/shoppingCart')
  },
  data() {
    return {
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 10,
      //列表总数
      total: 0,
    }
  },
  methods: {
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
    },
    //监听页码值改变事件
    handleCurrentChange(newPage){
      this.pageNum = newPage
    },
    toIndex() {
      this.$router.push('/index')
    }
  }
}
</script>

<style lang="less" scoped>
.shopping-cart-container {
  width: 100%;
}

.page-head {
  width: 1000px;
  margin: 20px auto auto;
  opacity: 0.8;
}

.card-container {
  width: 1000px;
  margin: 20px auto auto;
  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15)
  }
  .el-pagination {
    margin-left: 20px;
  }
}

.card-box {
  width: 900px;
  height: 150px;
  margin: 20px auto;
}
</style>