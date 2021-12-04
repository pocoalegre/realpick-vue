<template>
  <!-- 首页 -->
  <div class="index-container">
    <!-- logo搜索区-->
    <div class="logo-search-container">
      <img class="logo-style" src="../assets/logo.png" alt="">
      <el-input placeholder="服装搜索" v-model="queryInfo" class="search">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <!-- banner区-->
    <div class="banner-block">
      <el-carousel :interval="5000" arrow="never" height="480px">
        <el-carousel-item v-for="banner in bannerList" :key="banner.bannerSeq">
          <img :src="bannerImg + banner.bannerImg">
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
              <img :src="categoryImg + category.imgUrl" alt="" class="image">
              <span class="text-control-1">{{category.categoryName}}</span>
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
          <el-col v-for="(o) in 10" :key="o" class="col-style-2">
            <el-card class="box-card-2" shadow="never">
              <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
              <span class="text-control-2">好吃的汉堡好吃的汉堡好吃的汉堡好吃的汉堡好吃的汉堡好吃的汉堡好吃的汉堡好吃的汉堡</span>
              <div class="money-block">
                <span class="sign-text">￥</span>
                <span class="price-text">100</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 页脚 -->
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "@/components/Footer";
export default {
  name: "Index",
  components: {Footer},
  created() {
    this.getBannerList()
    this.getCategoryList()
  },
  data(){
    return {
      //搜索内容
      queryInfo: '',
      //banner展示列表
      bannerList: [],
      //类型展示列表
      categoryList: [],
    }
  },
  methods: {
    getBannerList() {
      const that = this
      axios({
        method: 'get',
        url: '/banner/indexList',
      }).then(res => {
        if (res.data.code === 10000){
          that.bannerList = res.data.data
        } else {
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
        if (res.data.code === 10000){
          that.categoryList = res.data.data
        } else {
          that.$message.error(res.data.msg)
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.index-container {
  height: 100%;
}

.logo-search-container {
  width: 1200px;
  margin: 10px auto 10px;
  .logo-style {
    width: 80px;
    margin-left: 50px;
    margin-right: 50px;
    vertical-align:middle;
  }
  .search {
    width: 950px;
    margin-top: 20px;
    vertical-align:middle;
  }
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
    font-family: 黑体,serif;
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
    }
  }
}

.product-block {
  width: 1150px;
  margin: 0 auto;
  .title-style-2 {
    font-size: x-large;
    font-family: 黑体,serif;
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
      font-family: 微软雅黑, serif;
      font-size: 14px;
      margin-top: 15px;
      color: #666666;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
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
}
</style>