<template>
  <!-- 单件商品页 -->
  <div class="product-container">
    <div class="product-container-box">
      <!-- 图片区域 -->
      <div class="product-img">
        <img :src="totalProductImg" >
      </div>
      <!-- 选择区域 -->
      <div class="product-select">
        <h1>{{showProductItem.productName}}</h1>
        <h3>价格：{{showProductItem.productPrice}}￥</h3>
        <h4>类型：{{showProductItem.categoryName}}</h4>
        <h4>品牌：{{showProductItem.productBrand}}</h4>
        <h4>库存：{{showProductItem.productStock}}</h4>
        <h4>销量：{{showProductItem.productSales}}</h4>
        <hr>
        <h4>选择尺码：</h4>
        <h4>选择颜色：</h4>
      </div>
      <!-- 加入购物车区域 -->
      <div class="add-cart">
        <div class="add-cart-box">
          <el-input-number size="small" v-model="add_num"></el-input-number>
          <el-button type="danger">加入购物车</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductItem",
  created() {
    this.$cookie.remove('userActivePath')
    this.getProduct(this.$route.query.productId)
    this.getProductSku(this.$route.query.productId)
    this.getProductParam(this.$route.query.productId)
  },
  data(){
    return {
      //展示信息
      showProductItem: {
        productImg: '',
        productName: '',
        productPrice: '',
        categoryId: '',
        categoryName: '',
        productBrand: '',
        productStock: '',
        productSales: ''
      },
      //完整商品图片
      totalProductImg: '',
      //sku列表
      skuList: [],
      //参数列表
      paramList:[],
      //加入购物车数量
      add_num: ''
    }
  },
  methods: {
    //获取商品信息
    getProduct(id){
      const that = this
      axios({
        method: 'get',
        url: '/product/voById',
        params: {
          id : id
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.showProductItem.productImg = res.data.data.productImg
          that.showProductItem.productName = res.data.data.productName
          that.showProductItem.productPrice = res.data.data.productPrice
          that.showProductItem.categoryId = res.data.data.category.categoryId
          that.showProductItem.categoryName = res.data.data.category.categoryName
          that.showProductItem.productBrand = res.data.data.productBrand
          that.showProductItem.productStock = res.data.data.productStock
          that.showProductItem.productSales = res.data.data.productSales
          that.totalProductImg = that.productImg + res.data.data.productImg
        } else {
          that.$message.error(that.showProductItem.categoryId)
        }
      })
    },
    //获取单条商品sku
    getProductSku(id){
      const that = this
      axios({
        method: 'get',
        url: '/productSku/byProductId',
        params: {
          id : id
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.skuList = res.data.data
          console.log(that.skuList)
        } else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //获取单条商品参数
    getProductParam(id){
      const that = this
      axios({
        method: 'get',
        url: '/productParam/byProductId',
        params: {
          id : id
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.paramList = res.data.data
          console.log(that.paramList)
        } else {
          that.$message.error(res.data.msg)
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.product-container {
  height: 100%;
}

.product-container-box {
  width: 1200px;
  margin: auto;
}

.product-img {
  float: left;
  margin-left: 120px;
  margin-top: 150px;
}

.product-select {
  float: right;
  width: 500px;
  margin-top: 100px;
  margin-right: 120px;
  background-color: #999999;
}

.add-cart {
  width: 500px;
  float: right;
  margin-right: 120px;
  margin-top: 10px;
}

.add-cart-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 400px;
  .el-input-number {
    margin-right: 15px;
  }
  .el-button {
    margin-left: 15px;
  }
}
</style>