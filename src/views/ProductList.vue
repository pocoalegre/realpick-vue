<template>
  <!-- 产品页 -->
  <div class="product-list-container">
    <!-- 分类区 -->
    <div class="category-block">
      <el-table :data="categoryList" stripe>
        <el-table-column label="一级分类" prop="categoryName" width="200px"></el-table-column>
        <el-table-column label="二级分类">
          <template slot-scope="scope">
            <el-tag @click="chooseCategoryId(category.categoryId)" v-for="category in scope.row.categoryList" :type="tagType(category.categoryId)">{{category.categoryName}}</el-tag>
          </template>
        </el-table-column>
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
          :page-sizes="[10, 20, 30]"
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
    this.getCategoryList()
    this.initProductList(parseInt(this.$route.query.categoryId))
  },
  data() {
    return {
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 20,
      //列表总数
      total: 0,
      //商品列表
      productList: [],
      //类型展示
      categoryList: [],
      //选中的类型
      chooseCategory: 0,
    }
  },
  methods: {
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getProductList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getProductList()
    },
    //获取类型列表
    getCategoryList() {
      const that = this
      axios({
        method: 'get',
        url: '/category/showList',
      }).then(res => {
        if (res.data.code === 10000){
          that.categoryList = res.data.data
        }else if (res.data.code === 10001){
          that.$message.error(res.data.msg)
        }
      })
    },
    //商品列表
    getProductList() {
      const that = this
      if (!isNaN(this.chooseCategory)) {
        axios({
          method: 'get',
          url: '/product/listByCategory',
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            categoryId: this.chooseCategory
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.productList = res.data.data.list
            that.total = res.data.data.total
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }else {
        axios({
          method: 'get',
          url: '/product/listByCategory',
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            categoryId: 0
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.productList = res.data.data.list
            that.total = res.data.data.total
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }
    },
    //初始化商品
    initProductList(categoryId) {
      const that = this
      this.chooseCategory = categoryId
      if (!isNaN(categoryId)){
        axios({
          method: 'get',
          url: '/product/listByCategory',
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            categoryId: categoryId
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.productList = res.data.data.list
            that.total = res.data.data.total
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }else {
        axios({
          method: 'get',
          url: '/product/listByCategory',
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            categoryId: 0
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.productList = res.data.data.list
            that.total = res.data.data.total
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }
    },
    //选中类型
    chooseCategoryId(id){
      this.chooseCategory = id
      this.getProductList()
    },
    toProductItem(id) {
      this.$router.push({
        path: '/productItem',
        query: {productId: id}
      })
    },
    //标签颜色
    tagType(data) {
      if (data === this.chooseCategory){
        return ''
      }else if (data !== this.chooseCategory){
        return 'info'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.product-list-container {
  height: 100%;
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

.el-tag+.el-tag {
  margin-left: 10px;
}

.el-tag {
  cursor: pointer;
}
</style>