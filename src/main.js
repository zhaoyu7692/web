import Vue from 'vue'
import App from './App.vue'
// import {Main, Container, Aside, Footer} from 'element-ui';
// import {Menu, Submenu, MenuItem, MenuItemGroup, Col} from "element-ui";
import ElementUI from 'element-ui'

Vue.use(ElementUI)
Vue.config.productionTip = false

import store from "@/store/store";

import router from "@/routers/Router";

import "@/network/network"

const app = new Vue({
  router,
  render: h => h(App),
  store,
  methods: {}
})
// debug
Vue.prototype.$toast = app.$message
app.$mount('#app')


// Vue.component(Main.name, Main)
// Vue.component(Container.name, Container)
// Vue.component(Aside.name, Aside)
// Vue.component(Footer.name, Footer)
// Vue.component(Menu.name, Menu)
// Vue.component(MenuItem.name, MenuItem)
// Vue.component(MenuItemGroup.name, MenuItemGroup)
// Vue.component(Submenu.name, Submenu)
// Vue.component(Col.name, Col)
// window.MonacoEnvironment = {
//   getWorkerUrl: function (workerId, label) {
//     return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
//               self.MonacoEnvironment = { baseUrl: '${window.location.origin}/' };
//               importScripts('${window.location.origin}/vs/base/worker/workerMain.js');
//           `)}`;
//   }
// }
// window.MonacoEnvironment = {
//   getWorkerUrl: function (moduleId, label) {
//     console.log('load file')
//     return './' + label + '.worker.bundle/js'
//   }
// }
// window.MonacoEnvironment = {
//   getWorkerUrl: function () {
//     return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
//               self.MonacoEnvironment = { baseUrl: '${window.location.origin}/' };
//               importScripts('${window.location.origin}/vs/base/worker/workerMain.js');
//           `)}`;
//   }
// }