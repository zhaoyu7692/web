import axios from "axios";
import EventBus, {EventName} from "@/utils/EventBus";
import Vue from 'vue'

export const ResponseCode =
  {
    UnknownFail: 0,
    Success: 1,
    JumpLogin: 2

  };

axios.defaults.baseURL = '/api'
axios.interceptors.response.use(response => {
  let data = response.data
  console.log('response ', response)
  switch (data.code) {
    case ResponseCode.Success: {
      return data
    }
    case ResponseCode.JumpLogin: {
      Vue.prototype.$message({type: 'warning', message: '请先登陆账号', customClass: 'toast-z-index'})
      EventBus.$emit(EventName.ChangeLoginDialogVisible, true)
      break
    }
    case ResponseCode.UnknownFail: {
      Vue.prototype.$message({type: 'error', message: data.message === undefined ? '未知错误，稍后重试！' : data.message})
      break
    }
  }
  switch (data.code) {
    case ResponseCode.Success: {
      break
    }
    case ResponseCode.JumpLogin:
    case ResponseCode.UnknownFail: {
      data.code = -1
    }
  }
  return Promise.reject(data.code)
}, error => {
  console.log('response error', error)
  return Promise.reject(-1)
})

Vue.prototype.$http = axios