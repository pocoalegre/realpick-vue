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
        <div class="product-title">
          <span class="product-title-1">商品名</span>
          <span class="product-title-2">单价</span>
          <span class="product-title-3">数量</span>
          <span class="product-title-4">金额</span>
          <span class="product-title-5">操作</span>
        </div>
        <el-card v-for="shoppingCart in shoppingCartList" class="card-box">
          <div class="cart-content">
            <img :src="productImg + shoppingCart.product.productImg">
            <div class="product-info-box">
              <div class="product-name-box">
                <div class="product-name">
                  <span>{{ shoppingCart.product.productName }}<br></span>
                  <span class="product-name-sku">尺寸：{{ shoppingCart.productSku.skuSize }}</span>
                  <span class="product-name-sku">颜色：{{ shoppingCart.productSku.skuColor }}</span>
                </div>
              </div>
              <div class="product-price-box">
                <span class="product-price">￥{{ shoppingCart.product.productPrice }}</span>
              </div>
              <div class="product-number-box">
                <el-input-number size="mini" v-model="shoppingCart.cartNumber"
                                 @change="modifyShoppingCart(shoppingCart.cartId, shoppingCart.cartNumber)"
                                 :min="1"></el-input-number>
              </div>
              <div class="product-price-box">
                <span class="product-price">￥{{ shoppingCart.product.productPrice * shoppingCart.cartNumber }}</span>
              </div>
              <div class="delete-button-box">
                <el-button size="mini" @click="deleteShoppingCartById(shoppingCart.cartId)">删除</el-button>
              </div>
            </div>
          </div>
        </el-card>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[3]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <div class="to-orders" v-if="total !== 0">
          <div class="to-orders-addr">
            <el-select v-model="chooseAddrId" placeholder="请选择收货地址" class="to-orders-addr-select" size="small"
                       @change="getUserAddrById">
              <el-option
                  v-for="item in userAddrList"
                  :key="item.addrId"
                  :label="item.receiverName + ' ' + item.receiverTel + ' ' + item.receiverAddr"
                  :value="item.addrId">
              </el-option>
            </el-select>
          </div>
          <div class="total-price">
            <span class="total-price-text-1">总价：</span>
            <span class="total-price-text-2">￥{{ totalPrice }}</span>
          </div>
          <el-button type="danger" @click="placeOrder">提交订单</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShoppingCart",
  created() {
    this.$cookie.set('userActivePath', '/shoppingCart')
    this.getShoppingCartList()
    this.getUserAddr()
  },
  data() {
    return {
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 3,
      //列表总数
      total: 0,
      //购物车列表
      shoppingCartList: [],
      //用户地址
      userAddrList: [],
      //选中地址id
      chooseAddrId: '',
      //地址表单
      addrForm: {
        receiverName: '',
        receiverTel: '',
        receiverAddr: '',
      },
      //总价
      totalPrice: '',
    }
  },
  methods: {
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getShoppingCartList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getShoppingCartList()
    },
    toIndex() {
      this.$router.push('/index')
    },
    //获取购物车列表
    getShoppingCartList() {
      const that = this
      axios({
        method: 'get',
        url: '/shoppingCart/list',
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.$cookie.get('userId')
        },
        headers: {
          token: this.$cookie.get('userToken')
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.shoppingCartList = res.data.data.list
          that.totalPrice = that.getTotalPrice
          that.total = res.data.data.total
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //删除单条购物车信息
    deleteShoppingCartById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条购物车记录, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: '/shoppingCart/delete',
          params: {
            id: id
          },
          headers: {
            token: this.$cookie.get('userToken')
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getShoppingCartList()
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
    //修改购物车
    modifyShoppingCart(id, number) {
      const that = this
      axios({
        method: 'put',
        url: '/shoppingCart/modify',
        params: {
          id: id,
          number: number
        },
        headers: {
          token: this.$cookie.get('userToken')
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.getShoppingCartList()
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //获取地址
    getUserAddr() {
      const that = this
      axios({
        method: 'get',
        url: '/userAddr/allList',
        params: {
          id: this.$cookie.get('userId'),
        },
        headers: {
          token: this.$cookie.get("userToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.userAddrList = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //单条地址
    getUserAddrById() {
      const that = this
      axios({
        method: 'get',
        url: '/userAddr/byId',
        params: {
          id: this.chooseAddrId
        },
        headers: {
          token: this.$cookie.get("userToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.addrForm.receiverName = res.data.data.receiverName
          that.addrForm.receiverTel = res.data.data.receiverTel
          that.addrForm.receiverAddr = res.data.data.receiverAddr
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //提交订单
    placeOrder() {
      const that = this
      if (this.chooseAddrId !== '') {
        for (let i = 0; i < this.shoppingCartList.length; i++) {
          //订单
          axios({
            method: 'post',
            url: '/order/add',
            data: {
              userId: that.$cookie.get('userId'),
              receiverName: that.addrForm.receiverName,
              receiverTel: that.addrForm.receiverTel,
              receiverAddr: that.addrForm.receiverAddr,
              totalAmount: that.shoppingCartList[i].product.productPrice * that.shoppingCartList[i].cartNumber,
              status: 1
            },
            headers: {
              token: this.$cookie.get("userToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //订单细节
              axios({
                method: 'post',
                url: '/orderDetail/add',
                data: {
                  orderId: res.data.data["orderId"],
                  productId: that.shoppingCartList[i].product.productId,
                  productName: that.shoppingCartList[i].product.productName,
                  productImg: that.shoppingCartList[i].product.productImg,
                  skuId: that.shoppingCartList[i].productSku.skuId,
                  skuSize: that.shoppingCartList[i].productSku.skuSize,
                  skuColor: that.shoppingCartList[i].productSku.skuColor,
                  buyNumber: that.shoppingCartList[i].cartNumber,
                  sellPrice: that.shoppingCartList[i].cartPrice,
                  totalAmount: that.shoppingCartList[i].cartNumber * that.shoppingCartList[i].cartPrice
                },
                headers: {
                  token: that.$cookie.get("userToken")
                }
              }).then(res => {
                if (res.data.code === 10001) {
                  that.$message.error(res.data.msg)
                }
              })
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
        that.$message.success('提交成功！')
        //清空购物车
        that.deleteShoppingCart()
        setTimeout(function () {
          that.getShoppingCartList()
        }, 100)
      } else {
        that.$message.error('请选择收货地址！')
      }
    },
    //删除购物车
    deleteShoppingCart(){
      const that = this
      let idList = []
      for (let i = 0; i < this.shoppingCartList.length; i++){
        idList.push(this.shoppingCartList[i].cartId)
      }
      axios({
        method: 'delete',
        url: '/shoppingCart/deleteByUser',
        params: {
          idList: idList.toString()
        },
        headers: {
          token: this.$cookie.get("userToken")
        }
      }).then(res => {
        if (res.data.code === 10001){
          that.$message.error(res.data.msg)
        }
      })
    },
  },
  computed: {
    //计算总价
    getTotalPrice() {
      let totalPrice = 0
      let i = 0
      for (i; i < this.shoppingCartList.length; i++) {
        totalPrice += this.shoppingCartList[i].product.productPrice * this.shoppingCartList[i].cartNumber
      }
      return totalPrice
    }
  }
}
</script>

<style lang="less" scoped>
.shopping-cart-container {
  width: 100%;
}

.page-head {
  width: 1200px;
  margin: 20px auto auto;
  opacity: 0.8;
}

.product-title {
  margin-left: 220px;
  font-size: 16px;
  color: #666666;

  .product-title-2 {
    margin-left: 275px;
  }

  .product-title-3 {
    margin-left: 105px;
  }

  .product-title-4 {
    margin-left: 150px;
  }

  .product-title-5 {
    margin-left: 122px;
  }
}

.card-container {
  width: 1200px;
  margin: 20px auto auto;

  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }

  .el-pagination {
    margin-left: 20px;
  }
}

.card-box {
  width: 1100px;
  height: 150px;
  margin: 20px auto;
}

.cart-content {
  img {
    margin-left: 25px;
    margin-top: 6px;
    width: 100px;
    height: 100px;
  }
}

.product-info-box {
  margin-top: 6px;
  float: right;
  width: 900px;
  height: 100px;
  display: flex;
}

.product-name-box {
  float: left;
  margin-left: 10px;
  width: 300px;
  height: 100px;
  display: table;

  .product-name {
    display: table-cell;
    vertical-align: middle;
    font-family: 微软雅黑, serif;
    font-size: 16px;
    color: #555555;

    .product-name-sku {
      display: block;
      margin-top: 3px;
      font-size: 14px;
      color: #888888;
    }
  }
}

.product-price-box {
  float: left;
  margin-left: 20px;
  width: 140px;
  height: 100px;
  display: flex;
  justify-items: center;
  align-items: center;

  .product-price {
    font-size: 20px;
    color: #e1251b;
  }
}

.product-number-box {
  display: flex;
  justify-items: center;
  align-items: center;
  margin-right: 30px;
}

.delete-button-box {
  display: flex;
  justify-items: center;
  align-items: center;

  .el-button {
    margin-left: 15px;
  }
}

.to-orders {
  width: 1100px;
  height: 50px;
  margin: 25px auto;
  display: flex;
  justify-items: center;
  align-items: center;

  .to-orders-addr {
    display: table;
    width: 500px;
    height: 50px;

    .to-orders-addr-select {
      display: table-cell;
      vertical-align: middle;
    }
  }

  .total-price {
    width: 200px;
    height: 50px;
    transform: translate(278px);
    color: #666666;
    display: table;

    .total-price-text-1 {
      display: table-cell;
      vertical-align: middle;
      font-size: 16px;
      color: #666666;
      width: 50px;
    }

    .total-price-text-2 {
      display: table-cell;
      vertical-align: middle;
      font-size: 20px;
      color: #e1251b;
    }
  }

  .el-button {
    transform: translate(270px);
  }
}
</style>