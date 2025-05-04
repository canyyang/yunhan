<script setup>
import { ref } from 'vue'
import { ElCard, ElInput, ElButton, ElMessage } from 'element-plus'
import { login } from '../services'
import { useRouter } from 'vue-router'

const router = useRouter()

const password = ref('')

const submit = async () => {
  const res = await login(password.value)
  if (res.code === 500) {
    ElMessage({
      message: res.msg,
      type: 'error',
    })
    return
  }
  if (res.code === 200) {
    ElMessage({
      message: res.msg,
      type: 'success',
    })
    const { token } =  res.data
    localStorage.setItem('token', token)
    setTimeout(() => {
      router.push({
        path: '/admin'
      })
    }, 500)
  }
}
</script>

<template>
  <div class="container">
    <el-card class="card">
      <h2 class="title">云汉教育</h2>
      <el-input v-model="password" type="password" class="input" placeholder="请输入密码" />
      <el-button type="primary"  class="button" @click="submit()">确认</el-button>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
}
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 7px 30px;
  width: 320px;
  height: 220px;
}
.title {
  width: 260px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  color: #409eff;
}
.input {
  width: 260px;
  margin-top: 18px;
}
.button {
  width: 260px;
  margin-top: 26px;
}
</style>