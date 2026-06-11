import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/admin",
    component: () => import("@/views/admin/Dashboard.vue"),
  },
  {
    path: "/admin/students",
    component: () => import("@/views/admin/Students.vue"),
  },
  {
    path: "/admin/students/:id",
    component: () => import("@/views/admin/StudentDetail.vue"),
  },
  {
    path: "/admin/teachers",
    component: () => import("@/views/admin/Teachers.vue"),
  },
  {
    path: "/public",
    component: () => import("@/views/Public.vue"),
  },
  {
    path: "/teacher",
    component: () => import("@/views/Teacher.vue"),
  },
  {
    path: "/student",
    component: () => import("@/views/Student.vue"),
  },
  {
    path: "/detail/:id",
    redirect: (to) => `/admin/students/${to.params.id}`,
  },
  {
    path: "/teachers",
    redirect: "/admin/teachers",
  },
  {
    path: "/login",
    component: () => import("@/views/Login.vue"),
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router
