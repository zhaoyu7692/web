import Vue from 'vue'
import Vuex from "vuex";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    userUpdate(state, user) {
      //存用户信息
      window.sessionStorage.setItem("token", user.token);
      window.sessionStorage.setItem("username", user.username);
      window.sessionStorage.setItem("uid", user.id);
      state.user = user
    }
  },
  getters: {
    isAdmin(state) {
      return state.user !== null && state.user.user_type === 1;
    }
  }
})