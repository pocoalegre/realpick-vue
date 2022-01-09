<template>
  <!-- 个人中心 -->
  <div class="user-center-container">
    <!-- 页头 -->
    <div class="page-head">
      <el-page-header content="个人中心" title="首页" @back="toIndex">
      </el-page-header>
    </div>
    <div class="user-content">
      <el-tabs tab-position="left">
        <el-tab-pane label="用户信息">
          <el-descriptions title="用户信息" direction="vertical" :column="2" border class="user-info">
            <el-descriptions-item label="用户名">{{ userInfo.userName }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ userInfo.userNickname }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ userInfo.userGender | genderFormat }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ userInfo.userAge }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{ userInfo.userTel }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo.userEmail }}</el-descriptions-item>
          </el-descriptions>
          <el-button class="modify-btn" type="primary" @click="showModifyInfoDialog()">修改信息</el-button>
        </el-tab-pane>
        <el-tab-pane label="修改头像">
          <el-descriptions title="修改头像" class="content-transform"></el-descriptions>
          <div class="modify-img">
            <img :src="base64Img?base64Img:totalUserImg" class="avatar">
            <el-upload
                action=""
                :auto-upload="false"
                :show-file-list="false"
                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                :on-change="onChangeFile">
              <el-button class="choose-file-btn" size="small" slot="trigger">选择文件</el-button>
              <el-button class="confirm-change-btn" size="small" type="success" @click="confirmChange">确认修改</el-button>
            </el-upload>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改密码" class="pwd-box">
          <el-descriptions title="修改密码" class="content-transform"></el-descriptions>
          <el-form :model="modifyPwdForm" :rules="modifyPwdFormRules" ref="modifyPwdFormRef" label-width="100px"
                   class="content-transform">
            <el-form-item label="原密码" prop="pwd">
              <el-input v-model="modifyPwdForm.pwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
              <el-input v-model="modifyPwdForm.newPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="reNewPwd">
              <el-input v-model="modifyPwdForm.reNewPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="modifyUserPwd">提交</el-button>
              <el-button @click="resetModifyPwdForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 修改用户对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyInfoDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息修改 -->
      <el-form :model="modifyInfoForm" :rules="modifyInfoFormRules" ref="modifyInfoFormRef" label-width="100px">
        <!-- 信息 -->
        <el-form-item label="用户名">
          <el-input v-model="modifyInfoForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="userNickname">
          <el-input v-model="modifyInfoForm.userNickname"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" prop="userGender">
          <el-select v-model="modifyInfoForm.userGender" placeholder="请选择">
            <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户年龄" prop="userAge">
          <el-input v-model.number="modifyInfoForm.userAge"></el-input>
        </el-form-item>
        <el-form-item label="用户电话" prop="userTel">
          <el-input v-model="modifyInfoForm.userTel"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="userEmail">
          <el-input v-model="modifyInfoForm.userEmail"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userModify">确 定</el-button>
        <el-button @click="cancelModify">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserCenter",
  created() {
    this.$cookie.remove('userActivePath')
    this.userId = this.$cookie.get('userId')
    this.getUser()
  },
  data() {
    //确认新密码规则
    let confirmNewPwd = (rule, value, callback) => {
      if (value !== this.modifyPwdForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      userId: '',
      //用户信息
      userInfo: {
        userName: '',
        userNickname: '',
        userImg: '',
        userGender: '',
        userAge: '',
        userTel: '',
        userEmail: ''
      },
      //完整头像链接
      totalUserImg: '',
      //性别选项
      genderOptions: [
        {
          label: '保密',
          value: ''
        },
        {
          label: '男',
          value: 'male'
        },
        {
          label: '女',
          value: 'female'
        }
      ],
      //修改对话框显示与隐藏
      modifyInfoDialogVisible: false,
      //修改信息表单
      modifyInfoForm: {
        userId: '',
        userName: '',
        userNickname: '',
        userGender: '',
        userAge: '',
        userTel: '',
        userEmail: ''
      },
      //修改密码表单
      modifyPwdForm: {
        pwd: '',
        newPwd: '',
        reNewPwd: ''
      },
      //表单验证规则对象
      modifyPwdFormRules: {
        //验证密码是否合法
        pwd: [
          {required: true, message: '请输入原密码！', trigger: 'blur'},
          {validator: this.checkRules.checkPwd, trigger: 'blur'}
        ],
        newPwd: [
          {required: true, message: '请输入新密码！', trigger: 'blur'},
          {validator: this.checkRules.checkPwd, trigger: 'blur'}
        ],
        reNewPwd: [
          {required: true, message: '请确认新密码！', trigger: 'blur'},
          {validator: confirmNewPwd, trigger: 'blur'}
        ],
      },
      //修改表单验证规则
      modifyInfoFormRules: {
        userNickname: [
          {required: true, message: '请输入用户昵称！', trigger: 'blur'},
          {validator: this.checkRules.checkNickname, trigger: 'blur'}
        ],
        userAge: [
          {validator: this.checkRules.checkAge, trigger: 'blur'}
        ],
        userTel: [
          {validator: this.checkRules.checkTel, trigger: 'blur'}
        ],
        userEmail: [
          {validator: this.checkRules.checkEmail, trigger: 'blur'}
        ],
      },
      //上传的文件
      file: {},
      //回显base64编码图片
      base64Img: '',
    }
  },
  methods: {
    //当前用户信息
    getUser() {
      const that = this
      axios({
        method: 'get',
        url: '/user/byId',
        params: {
          id: this.$cookie.get('userId')
        },
        headers: {
          token: that.$cookie.get('userToken')
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.userInfo.userName = res.data.data.userName
          that.userInfo.userNickname = res.data.data.userNickname
          that.userInfo.userImg = res.data.data.userImg
          that.userInfo.userGender = res.data.data.userGender
          that.userInfo.userAge = res.data.data.userAge
          that.userInfo.userTel = res.data.data.userTel
          that.userInfo.userEmail = res.data.data.userEmail
          that.totalUserImg = that.userHeadImg + that.userInfo.userImg
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //展示修改用户信息对话框
    showModifyInfoDialog() {
      this.modifyInfoForm.userId = this.userId
      this.modifyInfoForm.userName = this.userInfo.userName
      this.modifyInfoForm.userNickname = this.userInfo.userNickname
      this.modifyInfoForm.userGender = this.userInfo.userGender
      this.modifyInfoForm.userAge = this.userInfo.userAge
      this.modifyInfoForm.userTel = this.userInfo.userTel
      this.modifyInfoForm.userEmail = this.userInfo.userEmail
      this.modifyInfoDialogVisible = true
    },
    //监听修改对话框关闭事件
    modifyDialogClosed() {
      this.$refs.modifyInfoFormRef.resetFields()
    },
    //修改取消按钮
    cancelModify() {
      this.modifyInfoDialogVisible = false
      this.$refs.modifyInfoFormRef.resetFields()
    },
    //用户修改
    userModify() {
      const that = this
      this.$refs.modifyInfoFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'put',
            url: '/user/modify',
            data: {
              userId: this.modifyInfoForm.userId,
              userNickname: this.modifyInfoForm.userNickname,
              userGender: this.modifyInfoForm.userGender,
              userAge: this.modifyInfoForm.userAge,
              userTel: this.modifyInfoForm.userTel,
              userEmail: this.modifyInfoForm.userEmail,
            },
            headers: {
              token: this.$cookie.get("userToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框，重置回显
              that.modifyInfoDialogVisible = false
              //提示修改成功
              that.getUser()
              that.$cookie.set('userId', res.data.data.userId, {expires: 1})
              that.$cookie.set('userNickname', res.data.data.userNickname, {expires: 1})
              that.$message.success(res.data.msg)
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    //选择文件后
    onChangeFile(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return isLt2M;
      }
      this.base64Encoding(file.raw)
      //文件
      this.file = file.raw
    },
    //得到base64图片
    base64Encoding(file) {
      const that = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        that.base64Img = reader.result
      }
    },
    //确认修改图片
    confirmChange() {
      if (Object.keys(this.file).length === 0) {
        this.$message.error('请选择文件！')
      } else {
        const that = this
        //formData对象
        let formData = new FormData
        formData.append('file', this.file)
        formData.append('id', this.userId)
        axios({
          method: 'put',
          url: '/user/uploadImg',
          data: formData,
          headers: {
            'ContentType': 'multipart/form-data',
            token: this.$cookie.get("userToken")
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getUser()
            that.$cookie.set('userImg', res.data.data, {expires: 1})
            that.file = null
            setTimeout(function () {
              that.base64Img = null
            }, 200)
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }
    },
    //点击重置按钮，重置表单
    resetModifyPwdForm() {
      this.$refs.modifyPwdFormRef.resetFields()
    },
    //修改密码
    modifyUserPwd() {
      const that = this
      this.$refs.modifyPwdFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'put',
            url: '/user/pwdModify',
            params: {
              id: that.$cookie.get('userId'),
              pwd: that.modifyPwdForm.pwd,
              newPwd: that.modifyPwdForm.newPwd
            },
            headers: {
              token: that.$cookie.get('userToken')
            }
          }).then(res => {
            if (res.data.code === 10000) {
              that.$message.success(res.data.msg)
              that.logout()
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    toIndex() {
      this.$router.push('/index')
    }
  }
}
</script>

<style lang="less" scoped>
.user-center-container {
  height: 100%;
}

.page-head {
  width: 1200px;
  margin: 20px auto auto;
  opacity: 0.8;
  transform: translate(20px);
}

.user-content {
  width: 1200px;
  margin: 50px auto auto;

  .pwd-box {
    width: 400px;
  }
}

.modify-btn {
  margin-top: 20px;
  margin-left: 20px;
}

.modify-img {
  transform: translate(15px);

  .avatar {
    width: 180px;
    height: 180px;
  }

  .choose-file-btn {
    margin-top: 10px;
    margin-right: 10px;
  }

  .confirm-change-btn {
    margin-top: 10px;
  }
}

.user-info {
  transform: translate(15px);
  width: 50%;
}

.content-transform {
  transform: translate(15px);
}
</style>