//从下载的vue-router中导入createRouter
import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"

//配置映射关系
const routes = [
  {
    path:"/",
    component: Home
  },
  {
    path: "/public",
    component: () => import("@/views/Public.vue")
  },
  {
    path: "/teacher",
    component: () => import("@/views/Teacher.vue")
  },
  {
    path: "/student",
    component: () => import("@/views/Student.vue")
  },
  {
    path: "/detail/:id",
    component: () => import("@/views/Detail.vue")
  },
  {
    path: "/teachers",
    component: () => import("@/views/Teachers.vue")
  },
  {
    path: "/login",
    component: () => import("@/views/Login.vue")
  },
]

//创建路由对象
const router = createRouter({
  routes,
  history:createWebHistory()
})

export default router
