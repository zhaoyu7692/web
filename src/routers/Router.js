import Vue from 'vue'
import VueRouter from 'vue-router'

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}


Vue.use(VueRouter)
import Main from "@/components/Main"
import Home from "@/components/Home";
import Problems from "@/components/Problem/Problems";
import SubmitStatus from "@/components/Problem/SubmitStatus";
import Problem from "@/components/Problem/Problem";
import Contest from "@/components/Contest/Contest";
import Contests from "@/components/Contest/Contests";
import ContestStatus from "@/components/Contest/ContestStatus";
import ContestManager from "@/components/Edit/ContestManager";
import ProblemManager from "@/components/Edit/ProblemManager";

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
    path: '/contestManager',
    component: ContestManager,
  },
  {
    path: '/problemManager',
    component: ProblemManager,
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