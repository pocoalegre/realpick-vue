<template>
  <!-- 订单 -->
  <div class="order-container">
    <!-- 页头 -->
    <div class="page-head">
      <el-page-header content="我的订单" title="首页" @back="toIndex">
      </el-page-header>
    </div>
    <div class="card-container">
      <el-card>
        <el-card v-for="order in orderList" class="card-box">
          <div class="order-content">
            <span>订单号：{{ order.orderNumber }}</span><br>
            <img :src="productImg + order.orderDetail.productImg" width="100px" height="100px"><br>
            <span>{{ order.orderDetail.productName }}</span><br>
            <span>尺寸：{{ order.orderDetail.skuSize }}</span><br>
            <span>颜色：{{ order.orderDetail.skuColor }}</span><br>
            <span>数量：{{ order.orderDetail.buyNumber }}</span><br>
            <span>订单金额：{{ order.totalAmount }}</span><br>
            <span>实际付款：{{ order.actualAmount }}</span><br>
            <span>收货人：{{ order.receiverName }}</span><br>
            <span>收货电话：{{ order.receiverTel }}</span><br>
            <span>收货地址：{{ order.receiverAddr }}</span><br>
            <span>订单状态：{{ order.status | orderStatus }}</span><br>
            <el-tag v-if="order.status === 0" type="info">订单已取消</el-tag>
            <el-button v-if="order.status === 1" size="small" @click="cancelOrder(order.orderId)">取消订单</el-button>
            <br>
            <el-button v-if="order.status === 1" size="small" type="danger"
                       @click="alipay(order.orderNumber, order.totalAmount, order.orderDetail.productName, order.orderRemark)">
              付款
            </el-button>
            <br>
            <el-tag v-if="order.status === 2" type="info">等待卖家发货...</el-tag>
            <br>
            <el-button v-if="order.status === 3 || order.status === 4" size="small" type="primary" @click="selectDelivery(order.orderId)">查询快递</el-button>
            <br>
            <el-button v-if="order.status === 3" size="small" type="success" @click="confirmOrder(order.orderId)">确认收货</el-button>
            <el-tag v-if="order.status === 4" type="info">订单已完成</el-tag>
          </div>
        </el-card>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[2]"
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
  name: "UserOrder",
  created() {
    this.$cookie.set('userActivePath', '/userOrder')
    this.getOrderList()
  },
  data() {
    return {
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 2,
      //列表总数
      total: 0,
      //订单列表
      orderList: [],
    }
  },
  methods: {
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getOrderList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getOrderList()
    },
    toIndex() {
      this.$router.push('/index')
    },
    //订单列表
    getOrderList() {
      const that = this
      axios({
        method: 'get',
        url: '/order/voList',
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.$cookie.get('userId')
        },
        headers: {
          token: this.$cookie.get("userToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.orderList = res.data.data.list
          console.log(that.orderList = res.data.data.list)
          that.total = res.data.data.total
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //取消订单
    cancelOrder(orderId) {
      const that = this
      //弹框询问是否删除
      this.$confirm('确定取消订单?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'put',
          url: '/order/cancel',
          params: {
            id: orderId
          },
          headers: {
            token: this.$cookie.get("userToken")
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getOrderList()
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
    //支付宝支付
    alipay(orderNumber, totalPrice, productName, orderRemark) {
      axios({
        method: 'post',
        url: '/pay/alipay',
        data: {
          orderNumber: orderNumber,
          totalPrice: totalPrice,
          productName: productName,
          orderRemark: orderRemark
        },
        headers: {
          token: this.$cookie.get("userToken")
        }
      }).then(res => {
        //查找到当前页面的body，将后台返回的form替换掉他的内容
        document.querySelector('body').innerHTML = res.data;
        //执行submit表单提交，让页面重定向，跳转到支付宝页面
        document.forms[0].submit();
      })
    },
    //查询快递
    selectDelivery(orderId) {
      const that = this
      axios({
        method: 'get',
        url: '/delivery/byUser',
        params: {
          orderId: orderId
        },
        headers: {
          token: this.$cookie.get("userToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          let nu = res.data.data.nu
          let com = res.data.data.com
          window.open('https://www.kuaidi100.com/chaxun?com=' + com + '&nu=' + nu);
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //确认收货
    confirmOrder(orderId) {
      const that = this
      //弹框询问是否删除
      this.$confirm('确认本人已收到货物?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'put',
          url: '/order/confirm',
          params: {
            id: orderId
          },
          headers: {
            token: this.$cookie.get("userToken")
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getOrderList()
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
  },
  filters: {
    orderStatus(data) {
      if (data === 0) {
        return '已取消'
      } else if (data === 1) {
        return '待支付'
      } else if (data === 2) {
        return '待发货'
      } else if (data === 3) {
        return '待收货'
      } else if (data === 4) {
        return '已完成'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order-container {
  width: 100%;
}

.page-head {
  width: 1200px;
  margin: 20px auto auto;
  opacity: 0.8;
}

.card-container {
  width: 1200px;
  margin: 20px auto auto;
}
</style>