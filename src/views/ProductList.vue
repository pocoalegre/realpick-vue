<template>
  <!-- 产品页 -->
  <div class="product-list-container">
    <!-- logo搜索区-->
    <div class="logo-search-container">
      <img class="logo-style" src="../assets/logo.png" alt="">
      <el-input placeholder="服装搜索" v-model="queryInfo" class="search">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <!-- 分类区 -->
    <div class="category-block">
      <el-table border stripe>
        <el-table-column label="一级分类" width="200px"></el-table-column>
        <el-table-column label="二级分类"></el-table-column>
      </el-table>
    </div>
    <!-- 商品列表区 -->
    <div class="product-block">
      <div class="card-block">
        <el-row>
          <el-col v-for="product in productList" :key="product.productId" class="col-style">
            <el-card class="box-card" shadow="never">
              <img :src="productImg + product.productImg" class="image" @click="toProductItem(product.productId)">
              <span class="text-control" @click="toProductItem(product.productId)">{{ product.productName }}</span>
              <div class="money-block">
                <span class="sign-text">￥</span>
                <span class="price-text">{{ product.productPrice }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!-- 分页 -->
      <el-pagination
          class="page-block"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductList",
  created() {
    this.$cookie.set('userActivePath', '/productList')
    this.getProductList()
  },
  data() {
    return {
      //搜索内容
      queryInfo: '',
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 10,
      //列表总数
      total: 0,
      //商品列表
      productList: [],
    }
  },
  methods: {
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
    },
    //商品列表
    getProductList() {
      const that = this
      axios({
        method: 'get',
        url: '/product/listByCategory',
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.productList = res.data.data.list
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    toProductItem(id) {
      this.$router.push({
        path: '/productItem',
        query: {productId: id}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.product-list-container {
  height: 100%;
}

.logo-search-container {
  width: 1200px;
  margin: 10px auto 10px;

  .logo-style {
    width: 80px;
    margin-left: 50px;
    margin-right: 50px;
    vertical-align: middle;
  }

  .search {
    width: 950px;
    margin-top: 20px;
    vertical-align: middle;
  }
}

.category-block {
  width: 1200px;
  margin: auto;

  .el-table {
    margin-top: 20px;
  }
}

.product-block {
  width: 1150px;
  margin: 0 auto;

  .title-style {
    font-size: x-large;
    font-family: 黑体, serif;
    opacity: 0.7;
  }

  .card-block {
    margin-top: 20px;

    .col-style {
      width: 230px;
      height: 320px;
      padding: 0;
    }

    .box-card {
      width: 210px;
      height: 300px;
      border: 0;
      margin-right: 0;
    }

    .text-control {
      height: 38px;
      font-family: 微软雅黑, serif;
      font-size: 14px;
      margin-top: 15px;
      color: #666666;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      cursor: pointer;
    }

    .money-block {
      margin-top: 10px;

      .sign-text {
        font-size: 12px;
        color: #e1251b;
      }

      .price-text {
        font-size: 20px;
        color: #e1251b;
      }
    }
  }
}

.image {
  width: 170px;
  height: 170px;
  cursor: pointer;
}

.page-block {
  margin: auto;
}
</style>