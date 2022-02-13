<template>
  <!-- 单件商品页 -->
  <div class="product-container">
    <div class="product-container-box">
      <!-- 图片区域 -->
      <div class="product-img">
        <img :src="totalProductImg">
      </div>
      <!-- 选择区域 -->
      <div class="product-select">
        <span class="product-name-text">{{ showProductItem.productName }}</span>
        <div class="product-price-text-box">
          <span class="product-price-text-box-1">价格：</span>
          <span class="product-price-text-box-2">￥{{ showProductItem.productPrice }}</span>
        </div>
        <span class="product-type-text">类型：{{ showProductItem.categoryName }}</span>
        <span class="product-brand-text">品牌：{{ showProductItem.productBrand }}</span>
        <span class="product-stock-text">库存：{{ showProductItem.productStock }}</span>
        <span class="product-sale-text">销量：{{ showProductItem.productSales }}</span>
        <div class="choose-size">
          <span class="choose-size-text">尺码：</span>
          <el-radio-group v-model="chooseSize" size="small" @change="reChooseColor">
            <el-radio-button :disabled="sizeDisabled(size)" v-for="size in skuSizeList" :label="size"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="choose-color">
          <span class="choose-color-text">颜色：</span>
          <el-radio-group v-model="chooseColor" size="small" @change="reChooseSize">
            <el-radio-button :disabled="colorDisabled(color)" v-for="color in skuColorList" :label="color"></el-radio-button>
          </el-radio-group>
        </div>

      </div>
      <!-- 加入购物车区域 -->
      <div class="add-cart">
        <div class="add-cart-box">
          <el-input-number size="small" v-model="add_num" :min="0"
                           :max="showProductItem.productStock - 0"></el-input-number>
          <el-button type="danger" @click="addShoppingCart">加入购物车</el-button>
        </div>
      </div>
    </div>
    <!-- 商品参数区域 -->
    <div class="product-param-box">
      <el-card class="desc-box">
        <el-descriptions title="商品参数">
          <el-descriptions-item v-for="param in paramList" :label="param.paramKey">{{ param.paramValue }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductItem",
  created() {
    this.$cookie.remove('userActivePath')
    this.showProductItem.productId = this.$route.query.productId
    this.getProduct(this.$route.query.productId)
    this.getSkuSizeList(this.$route.query.productId)
    this.getSkuColorList(this.$route.query.productId)
    this.getProductParam(this.$route.query.productId)
  },
  data() {
    return {
      //展示信息
      showProductItem: {
        productId: '',
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
      //skuSize列表
      skuSizeList: [],
      //skuColor列表
      skuColorList: [],
      //参数列表
      paramList: [],
      //加入购物车数量
      add_num: 0,
      //选中的sku尺码
      chooseSize: '',
      //选中的sku颜色
      chooseColor: '',
    }
  },
  methods: {
    //获取商品信息
    getProduct(id) {
      const that = this
      axios({
        method: 'get',
        url: '/product/voById',
        params: {
          id: id
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.showProductItem.productImg = res.data.data.productImg
          that.showProductItem.productName = res.data.data.productName
          that.showProductItem.productPrice = res.data.data.productPrice
          that.showProductItem.categoryId = res.data.data.category.categoryId
          that.showProductItem.categoryName = res.data.data.category.categoryName
          that.showProductItem.productBrand = res.data.data.productBrand
          that.showProductItem.productStock = res.data.data.productStock
          that.showProductItem.productSales = res.data.data.productSales
          that.totalProductImg = that.productImg + res.data.data.productImg
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //获取单条商品sku_size
    getSkuSizeList(id) {
      const that = this
      axios({
        method: 'get',
        url: '/productSku/skuSizeList',
        params: {
          id: id
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.skuSizeList = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //获取单条商品sku_color
    getSkuColorList(id) {
      const that = this
      axios({
        method: 'get',
        url: '/productSku/skuColorList',
        params: {
          id: id
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.skuColorList = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //获取单条商品参数
    getProductParam(id) {
      const that = this
      axios({
        method: 'get',
        url: '/productParam/byProductId',
        params: {
          id: id
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.paramList = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //添加购物车
    addShoppingCart() {
      const that = this
      if (this.$cookie.get('userToken')) {
        if (this.add_num === 0) {
          this.$message.error('添加购物车数目不能为0！')
        } else {
          if (this.chooseSize === '' || this.chooseColor === ''){
            this.$message.error('请选择尺寸或者颜色！')
          }else {
            axios({
              method: 'post',
              url: '/productSku/selectId',
              data: {
                productId: this.showProductItem.productId,
                skuSize: this.chooseSize,
                skuColor: this.chooseColor
              }
            }).then(res => {
              if (res.data.code === 10000) {
                axios({
                  method: 'post',
                  url: '/shoppingCart/add',
                  data: {
                    userId: this.$cookie.get('userId'),
                    productId: this.showProductItem.productId,
                    skuId: res.data.data,
                    cartNumber: this.add_num,
                    cartPrice: this.showProductItem.productPrice
                  },
                  headers: {
                    token: this.$cookie.get('userToken')
                  }
                }).then(res => {
                  if (res.data.code === 10000) {
                    //提示添加成功
                    that.$message.success(res.data.msg)
                  } else if (res.data.code === 10001) {
                    that.$message.error(res.data.msg)
                  }
                })
              } else if (res.data.code === 10001) {
                that.$message.error(res.data.msg)
              }
            })
          }
        }
      } else {
        this.$router.push('/login')
      }
    },
    //先选尺寸后刷新颜色列表
    reChooseColor() {
      const that = this
      if (this.chooseColor === ''){
        axios({
          method: 'get',
          url: '/productSku/reSkuColorList',
          params: {
            id: that.showProductItem.productId,
            skuSize: that.chooseSize
          }
        }).then( res => {
          if (res.data.code === 10000) {
            that.skuColorList = res.data.data
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }
    },
    //先选颜色后刷新尺寸列表
    reChooseSize() {
      const that = this
      if (this.chooseSize === ''){
        axios({
          method: 'get',
          url: '/productSku/reSkuSizeList',
          params: {
            id: that.showProductItem.productId,
            skuColor: that.chooseColor
          }
        }).then( res => {
          if (res.data.code === 10000) {
            that.skuSizeList = res.data.data
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }
    },
    //尺寸禁用
    sizeDisabled(size) {
      if (this.chooseSize === ''){
        return false
      }else if (this.chooseSize !== ''){
        return this.chooseSize !== size;
      }
    },
    //颜色禁用
    colorDisabled(color) {
      if (this.chooseColor === ''){
        return false
      }else if (this.chooseColor !== ''){
        return this.chooseColor !== color;
      }
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
  margin-top: 100px;

  img {
    width: 400px;
    height: 400px;
  }
}

.product-select {
  float: right;
  width: 500px;
  margin-top: 100px;
  margin-right: 120px;
  display: flex;
  flex-direction: column;

  .product-name-text {
    font-size: 22px;
    font-weight: bold;
    color: #444444;
  }

  .product-price-text-box {
    margin-top: 20px;
    height: 46px;
    background-color: #e5e5e5;
    display: flex;
    align-items: center;

    .product-price-text-box-1 {
      margin-left: 10px;
      font-size: 16px;
      color: #555555;
    }

    .product-price-text-box-2 {
      font-size: 20px;
      color: #e1251b;
    }
  }

  .product-type-text {
    margin-left: 10px;
    margin-top: 20px;
    font-size: 16px;
    color: #555555;
  }

  .product-brand-text {
    margin-left: 10px;
    margin-top: 15px;
    font-size: 16px;
    color: #555555;
  }

  .product-stock-text {
    margin-left: 10px;
    margin-top: 15px;
    font-size: 16px;
    color: #555555;
  }

  .product-sale-text {
    margin-left: 10px;
    margin-top: 15px;
    font-size: 16px;
    color: #555555;
  }

  .choose-size {
    margin-top: 15px;
    margin-left: 10px;

    .choose-size-text {
      font-size: 16px;
      color: #555555;
    }
  }

  .choose-color {
    margin-top: 15px;
    margin-left: 10px;

    .choose-color-text {
      font-size: 16px;
      color: #555555;
    }
  }
}

.add-cart {
  width: 500px;
  float: right;
  margin-right: 120px;
  margin-top: 30px;
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

.product-param-box {

  width: 1000px;
  margin: auto;

  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }

  .desc-box {
    width: 1000px;
    margin: auto;
    transform: translate(0, 70px);
  }
}
</style>