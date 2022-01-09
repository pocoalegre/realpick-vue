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
        <el-button type="primary" @click="showAddDialog" class="add-button">添加地址</el-button>
        <el-table :data="userAddrList" border stripe>
          <el-table-column label="#" type="index" width="50px" fixed="left"></el-table-column>
          <el-table-column label="收件人姓名" prop="receiverName"></el-table-column>
          <el-table-column label="收件人电话" prop="receiverTel"></el-table-column>
          <el-table-column label="收件人地址" prop="receiverAddr"></el-table-column>
          <el-table-column label="是否默认">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.isMain">{{ scope.row.isMain | isMain }}</el-tag>
              <el-tag type="danger" v-else>{{ scope.row.isMain | isMain }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="143px" fixed="right">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="medium"
                         @click="showModifyDialog(scope.row.addrId)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="medium"
                         @click="deleteUserAddrById(scope.row.addrId)"></el-button>
            </template>
          </el-table-column>
        </el-table>
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
      </el-card>
      <!-- 添加地址对话框 -->
      <el-dialog
          title="添加信息"
          :visible.sync="addDialogVisible"
          width="35%"
          @close="addDialogClosed"
          :close-on-click-modal="false">
        <!-- 添加信息 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="el-form-block">
          <!-- 地址信息 -->
          <el-form-item label="收件人姓名" prop="receiverName">
            <el-input v-model="addForm.receiverName"></el-input>
          </el-form-item>
          <el-form-item label="收件人电话" prop="receiverTel">
            <el-input v-model="addForm.receiverTel"></el-input>
          </el-form-item>
          <el-form-item label="收件人地址" prop="receiverAddr">
            <el-input v-model="addForm.receiverAddr"></el-input>
          </el-form-item>
          <el-form-item label="是否默认" prop="isMain">
            <el-radio-group v-model="addForm.isMain">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUserAddr">确 定</el-button>
        <el-button @click="cancelAdd">取 消</el-button>
      </span>
      </el-dialog>
      <!-- 修改地址对话框 -->
      <el-dialog
          title="修改信息"
          :visible.sync="modifyDialogVisible"
          width="35%"
          @close="modifyDialogClosed"
          :close-on-click-modal="false">
        <!-- 信息修改 -->
        <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px"
                 class="el-form-block">
          <!-- 地址信息 -->
          <el-form-item label="收件人姓名" prop="receiverName">
            <el-input v-model="modifyForm.receiverName"></el-input>
          </el-form-item>
          <el-form-item label="收件人电话" prop="receiverTel">
            <el-input v-model="modifyForm.receiverTel"></el-input>
          </el-form-item>
          <el-form-item label="收件人地址" prop="receiverAddr">
            <el-input v-model="modifyForm.receiverAddr"></el-input>
          </el-form-item>
          <el-form-item label="是否默认" prop="isMain">
            <el-radio-group v-model="modifyForm.isMain">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyUserAddr">确 定</el-button>
        <el-button @click="cancelModify">取 消</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserAddr",
  created() {
    this.$cookie.remove('userActivePath')
    this.getUserAddrList()
  },
  data() {
    return {
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 5,
      //列表总数
      total: 0,
      //地址列表
      userAddrList: [],
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //添加对话框显示与隐藏
      addDialogVisible: false,
      //修改表单
      modifyForm: {
        addrId: '',
        receiverName: '',
        receiverTel: '',
        receiverAddr: '',
        isMain: '',
      },
      //添加表单
      addForm: {
        receiverName: '',
        receiverTel: '',
        receiverAddr: '',
        isMain: '',
      },
      //修改规则
      modifyFormRules: {
        receiverName: [
          {required: true, message: '请输入收件人姓名！', trigger: 'blur'},
        ],
        receiverTel: [
          {required: true, message: '请输入收件人电话！', trigger: 'blur'},
        ],
        receiverAddr: [
          {required: true, message: '请输入收件人地址！', trigger: 'blur'},
        ],
        isMain: [
          {required: true, message: '请设置是否默认！'},
        ]
      },
      //添加规则
      addFormRules: {
        receiverName: [
          {required: true, message: '请输入收件人姓名！', trigger: 'blur'},
        ],
        receiverTel: [
          {required: true, message: '请输入收件人电话！', trigger: 'blur'},
        ],
        receiverAddr: [
          {required: true, message: '请输入收件人地址！', trigger: 'blur'},
        ],
        isMain: [
          {required: true, message: '请设置是否默认！'},
        ]
      }
    }
  },
  methods: {
    toIndex() {
      this.$router.push('/index')
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
    },
    //地址列表
    getUserAddrList() {
      const that = this
      axios({
        method: 'get',
        url: '/userAddr/list',
        params: {
          id: this.$cookie.get('userId'),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
        headers: {
          token: this.$cookie.get("userToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.userAddrList = res.data.data.list
          that.total = res.data.data.total
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //单条地址
    getUserAddrById(id) {
      const that = this
      axios({
        method: 'get',
        url: '/userAddr/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("userToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.modifyForm.receiverName = res.data.data.receiverName
          that.modifyForm.receiverTel = res.data.data.receiverTel
          that.modifyForm.receiverAddr = res.data.data.receiverAddr
          that.modifyForm.isMain = res.data.data.isMain
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //删除地址
    deleteUserAddrById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'userAddr/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('userToken')
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getUserAddrList()
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
    //展示添加商品信息对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    //展示修改商品信息对话框
    showModifyDialog(id) {
      this.modifyForm.addrId = id
      this.getUserAddrById(id)
      this.modifyDialogVisible = true
    },
    //监听修改对话框关闭事件
    modifyDialogClosed() {
      this.$refs.modifyFormRef.resetFields()
    },
    //监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addForm.isMain = ''
    },
    //取消添加
    cancelAdd() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.addForm.isMain = ''
    },
    //取消修改
    cancelModify() {
      this.modifyDialogVisible = false
    },
    //添加地址
    addUserAddr() {
      const that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: '/userAddr/add',
            data: {
              userId: this.$cookie.get('userId'),
              receiverName: that.addForm.receiverName,
              receiverTel: that.addForm.receiverTel,
              receiverAddr: that.addForm.receiverAddr,
              isMain: that.addForm.isMain
            },
            headers: {
              token: this.$cookie.get("userToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框重置回显
              that.addDialogVisible = false
              //刷新数据列表
              that.getUserAddrList()
              //提示修改成功
              that.$message.success(res.data.msg)
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    //修改地址
    modifyUserAddr() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'put',
            url: '/userAddr/modify',
            data: {
              addrId: that.modifyForm.addrId,
              userId: this.$cookie.get('userId'),
              receiverName: that.modifyForm.receiverName,
              receiverTel: that.modifyForm.receiverTel,
              receiverAddr: that.modifyForm.receiverAddr,
              isMain: that.modifyForm.isMain
            },
            headers: {
              token: this.$cookie.get("userToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框重置回显
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getUserAddrList()
              //提示修改成功
              that.$message.success(res.data.msg)
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    }
  },
  filters: {
    isMain(data) {
      if (data === 1) {
        return '✔'
      } else if (data === 0) {
        return '✖'
      }
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

.add-button {
  margin-bottom: 20px;
}

.el-form-block {
  margin-top: 20px;
}
</style>