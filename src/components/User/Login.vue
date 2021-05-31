<template>
  <el-dialog title="用户登录" :visible.sync="visible" width="490px">
    <!-- 表单区 -->
    <el-form ref="user" :model="user" :rules="rules" class="login_form">
      <el-form-item prop="username">
        <el-input placeholder="用户名" v-model="user.username">
          <img class="icon" slot="prefix" src="@/assets/icon_user.svg"/>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input placeholder="密码" v-model="user.password" type="password">
          <img class="icon" slot="prefix" src="@/assets/icon_lock.svg"/>
        </el-input>
      </el-form-item>
      <div style="margin: -15px 0 10px; text-align: right">
        <el-link type="primary" @click="jumpRegister">注册账号</el-link>
      </div>
      <el-form-item>
        <el-button type="primary" class="btns" @click="login">登 录</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import EventBus, {EventName} from "@/utils/EventBus"
import {StoreCommitName} from "@/store/storeDefines"

export default {
  name: "Login",
  data() {
    return {
      visible: false,
      user: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          {min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    jumpRegister() {
      EventBus.$emit(EventName.ChangeLoginDialogVisible, false)
      EventBus.$emit(EventName.ChangeRegisterDialogVisible, true)
    },
    resetUser() {
      if (this.$refs.user !== undefined) {
        this.$refs.user.resetFields()
      }
    },
    login() {
      let doLogin = valid => {
        if (!valid) {
          return
        }
        let data = {
          username: this.user.username,
          password: this.user.password
        }
        this.$http.post('/login/', data)
            .then(({user}) => {
              console.log(user)
              this.$store.commit(StoreCommitName.userUpdate, user)
              this.$message({type: "success", message: "欢迎回来" + data.username + "!", customClass: 'toast-z-index'})
              //关闭登录窗口
              EventBus.$emit(EventName.ChangeLoginDialogVisible, false)
            })
            .catch(errorCode => {
              if (errorCode !== -1) {
                this.$message({type: "error", message: "网络异常，登陆失败！", customClass: 'toast-z-index'})
              }
            })
      }
      this.$refs.user.validate(doLogin)
    }
  },
  created() {
    // this.resetUser()
    EventBus.$on(EventName.ChangeLoginDialogVisible, visible => {
      this.resetUser()
      this.visible = visible
    })
  }
}
</script>

<style scoped>
.login_form {
  bottom: 0;
  width: 100%;
  padding: 10px 20px 0 20px;
  box-sizing: border-box;
}

.icon {
  width: 25px;
  height: 40px;
  float: left;
}

.btns {
  display: flex;
  margin: 0 auto;
}
</style>