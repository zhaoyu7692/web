<template>
  <el-dialog
      title="用户注册"
      :visible.sync="visible"
      width="490px"
      @closed="resetUser"
  >
    <!-- 表单区 -->
    <el-form ref="user" :model="user" :rules="rules" class="register_form">
      <el-form-item prop="username">
        <el-input placeholder="用户名" v-model="user.username" auto-complete="new-password">
          <img class="icon" slot="prefix" src="@/assets/icon_user.svg"/>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
            placeholder="密码"
            v-model="user.password"
            type="password"
            auto-complete="new-password"
        >
          <img class="icon" slot="prefix" src="@/assets/icon_lock.svg"/>
        </el-input>
      </el-form-item>

      <el-form-item prop="repeatPassword">
        <el-input
            placeholder="重复密码"
            v-model="user.repeatPassword"
            type="password"
            auto-complete="new-password"
        >
          <img class="icon" slot="prefix" src="@/assets/icon_lock.svg"/>
        </el-input>
      </el-form-item>
      <div style="margin: -15px 0 10px; text-align: right">
        <el-link type="primary" @click="jumpLogin">注册账号</el-link>
      </div>
      <!-- <el-form-item prop="email">
        <el-input
          placeholder="邮箱"
          v-model="user.email"
          type="text"
          auto-complete="new-password"
        >
          <img class="icon" slot="prefix" src="~assets/img/icon_mail.svg" />
        </el-input>
      </el-form-item>-->

      <el-form-item>
        <el-button type="primary" class="btns" @click="register">注 册</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import EventBus, {EventName} from "@/utils/EventBus";

export default {
  name: "Register",
  data() {
    //检测用户名是否含有非法字符
    const checkUsernameLegal = (rule, value, callback) => {
      let reg = /^[0-9a-zA-z]*$/;
      if (reg.test(value)) return callback();
      return callback(new Error("用户名只能包含大小写字母或数字"));
    };
    //检测用户名是否可用
    const checkUsernameUsed = (rule, value, callback) => {
      this.$http.post('/checkUsername/', {username: value})
          .then(() => {
            callback()
          })
          .catch((errorCode) => {
            if (errorCode !== -1) {
              callback(new Error('用户名校验失败'))
            }
          });
    };
    //检测重复输入的密码和原密码是否相同
    const checkRepeatPassword = (rule, value, callback) => {
      if (value === "") return callback(new Error("请输入重复密码"))
      if (value === this.user.password) {
        return callback();
      }
      return callback(new Error("密码不匹配"))
    }
    return {
      visible: false,
      user: {
        username: "",
        password: "",
        repeatPassword: "",
        email: ""
      },
      rules: {
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"},
          {validator: checkUsernameLegal, trigger: "blur"},
          {validator: checkUsernameUsed, trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"}
        ],
        repeatPassword: [{validator: checkRepeatPassword, trigger: "blur"}]
        // email: [
        //   { required: true, message: "请输入邮箱地址", trigger: "blur" },
        //   {
        //     type: "email",
        //     message: "请输入正确的邮箱地址",
        //     trigger: ["blur", "change"]
        //   }
        // ]
      }
    };
  },
  methods: {
    jumpLogin() {
      EventBus.$emit(EventName.ChangeRegisterDialogVisible, false)
      EventBus.$emit(EventName.ChangeLoginDialogVisible, true)
    },
    //关闭注册窗口时重置注册表单
    resetUser() {
      if (this.$refs.user !== undefined) {
        this.$refs.user.resetFields()
      }
    },
    register() {
      let doRegister = valid => {
        if (!valid) {
          return
        }
        //发送注册请求
        let data = {
          username: this.user.username,
          password: this.user.password,
        }
        this.$http.post('/register/', data)
            .then(() => {
              //注册成功
              this.$message({type: 'success', message: this.user.username + '，注册成功!', customClass: 'toast-z-index'})
              this.jumpLogin()
            })
            .catch((errorCode) => {
              if (errorCode !== -1) {
                this.$message({type: 'error', message: '网络异常，登陆失败！', customClass: 'toast-z-index'})
              }
            })
      }
      this.$refs.user.validate(doRegister)
    },
  },
  created() {
    EventBus.$on(EventName.ChangeRegisterDialogVisible, visible => {
      this.resetUser()
      this.visible = visible
    })
  }
};
</script>

<style scoped>
.register_form {
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