<template>
  <!-- 首页 -->
  <div class="index-container">
    <!-- banner区-->
    <div class="banner-block">
      <el-carousel :interval="5000" arrow="never" height="480px">
        <el-carousel-item v-for="banner in bannerList" :key="banner.bannerSeq">
          <img @click="toProductOrCategory(banner.bannerType, banner.productId, banner.categoryId)" :src="bannerImg + banner.bannerImg">
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 爆款类型 -->
    <div class="category-block">
      <a class="title-style-1">优选类型</a>
      <div class="card-block-1">
        <el-row>
          <el-col v-for="category in categoryList" :key="category.categoryId" class="col-style-1">
            <el-card class="box-card-1" shadow="never">
              <img @click="toProductList" :src="categoryImg + category.imgUrl" alt="" class="image">
              <span @click="toProductList" class="text-control-1">{{ category.categoryName }}</span>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 时尚达人 -->
    <div class="product-block">
      <a class="title-style-2">时尚达人</a>
      <div class="card-block-2">
        <el-row>
          <el-col v-for="product in productList" :key="product.productId" class="col-style-2">
            <el-card class="box-card-2" shadow="never">
              <img :src="productImg + product.productImg" class="image" @click="toProductItem(product.productId)">
              <span class="text-control-2" @click="toProductItem(product.productId)">{{ product.productName }}</span>
              <div class="money-block">
                <span class="sign-text">￥</span>
                <span class="price-text">{{ product.productPrice }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  created() {
    this.$cookie.set('userActivePath', '/index')
    this.getBannerList()
    this.getCategoryList()
    this.getProductList()
  },
  data() {
    return {
      //搜索内容
      queryInfo: '',
      //banner展示列表
      bannerList: [],
      //类型展示列表
      categoryList: [],
      //商品列表
      productList: []
    }
  },
  methods: {
    getBannerList() {
      const that = this
      axios({
        method: 'get',
        url: '/banner/indexList',
      }).then(res => {
        if (res.data.code === 10000) {
          that.bannerList = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    getCategoryList() {
      const that = this
      axios({
        method: 'get',
        url: '/category/indexList',
      }).then(res => {
        if (res.data.code === 10000) {
          that.categoryList = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    getProductList() {
      const that = this
      axios({
        method: 'get',
        url: '/product/indexList',
      }).then(res => {
        if (res.data.code === 10000) {
          that.productList = res.data.data
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
    },
    toProductList() {
      this.$router.push('/productList')
    },
    toProductOrCategory(bannerType, productId, categoryId) {
      if (bannerType === 1){
        this.$router.push({
          path: '/productItem',
          query: {productId: productId}
        })
      }else if (bannerType === 2){
        this.$router.push({
          path: '/productList',
          query: {categoryId: categoryId}
        })
      }
    }
  },
}
</script>

<style lang="less" scoped>
.index-container {
  height: 100%;
}

.banner-block {
  width: 1200px;
  margin: 20px auto 20px;
}

.category-block {
  width: 1150px;
  margin: 0 auto;

  .title-style-1 {
    font-size: x-large;
    font-family: 黑体, serif;
    opacity: 0.7;
  }

  .card-block-1 {
    margin-top: 20px;

    .col-style-1 {
      width: 230px;
      height: 280px;
      padding: 0;
    }

    .box-card-1 {
      width: 210px;
      height: 260px;
      border: 0;
      margin-right: 0;
    }

    .text-control-1 {
      font-family: 微软雅黑, serif;
      text-align: center;
      font-size: 18px;
      margin-top: 15px;
      color: #666666;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
  }
}

.product-block {
  width: 1150px;
  margin: 0 auto;

  .title-style-2 {
    font-size: x-large;
    font-family: 黑体, serif;
    opacity: 0.7;
  }

  .card-block-2 {
    margin-top: 20px;

    .col-style-2 {
      width: 230px;
      height: 320px;
      padding: 0;
    }

    .box-card-2 {
      width: 210px;
      height: 300px;
      border: 0;
      margin-right: 0;
    }

    .text-control-2 {
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
</style>