<template>
  <!-- 地址管理 -->
  <div class="addr-container">
    <!-- 页头 -->
    <div class="page-head">
      <el-page-header content="我的地址" title="首页" @back="toIndex">
      </el-page-header>
    </div>
    <div class="addr-box">
      <el-card shadow="never">
        <el-table>
          <el-table-column label="收货人姓名"></el-table-column>
          <el-table-column label="收货人电话"></el-table-column>
          <el-table-column label="收货人地址"></el-table-column>
          <el-table-column label="是否默认"></el-table-column>
          <el-table-column label="操作" width="143px" fixed="right">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="medium"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="medium"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 页脚 -->
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "@/components/Footer";
export default {
  name: "UserAddr",
  components: {Footer},
  methods: {
    toIndex() {
      this.$router.push('/index')
    }
  }
}
</script>

<style lang="less" scoped>
.addr-container {
  height: 100%;
}

.page-head {
  width: 1200px;
  margin: 20px auto auto;
  opacity: 0.8;
}

.addr-box {
  width: 1200px;
  margin: 20px auto auto;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15)
}
</style>