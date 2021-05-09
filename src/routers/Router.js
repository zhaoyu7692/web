import Vue from 'vue'
import VueRouter from 'vue-router'

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}


Vue.use(VueRouter)
import Main from "@/components/Main"
import Home from "@/components/Home";
import Problems from "@/components/Problems";
import SubmitStatus from "@/components/SubmitStatus";
import Problem from "@/components/Problem";
import Contest from "@/components/Contest";
import Contests from "@/components/Contests";
import ContestStatus from "@/components/ContestStatus";

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: Home,
  },
  {
    path: '/problems',
    component: Problems,
  },
  {
    path: '/problemStatus',
    component: SubmitStatus,
  },
  {
    path: '/problem/:index',
    component: Problem,
  },
  {
    path: '/contests',
    component: Contests,
  },
  {
    path: '/contest/:cid',
    component: Contest,
  },
  {
    path: '/contest/:cid/:index',
    component: Problem,
  },
  {
    path: '/submitStatus/:cid',
    component: SubmitStatus,
  },
  {
    path: '/contestStatus/:cid',
    component: ContestStatus,
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/404',
    component: Main
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router