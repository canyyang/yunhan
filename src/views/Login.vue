<script setup>
import { ref } from 'vue'
import { ElButton, ElCard, ElInput, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { login } from '@/services'

const router = useRouter()
const password = ref('')
const loading = ref(false)

const submit = async () => {
  if (!password.value) {
    ElMessage({ message: '请输入密码', type: 'warning' })
    return
  }

  loading.value = true
  try {
    const res = await login(password.value)
    if (res.code === 500) {
      ElMessage({ message: res.msg, type: 'error' })
      return
    }
    if (res.code === 200) {
      const { token } = res.data
      localStorage.setItem('token', token)
      ElMessage({ message: res.msg, type: 'success' })
      router.push({ path: '/admin' })
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="intro">
      <p>YUNHAN ADMIN</p>
      <h1>欢迎回到云汉魔法管理台</h1>
      <span>分院、匹配与公开流程，都从这里开始。</span>
    </section>

    <el-card class="login-card" shadow="never">
      <h2>管理员门禁</h2>
      <p>请输入管理密码以进入工作台。</p>
      <el-input
        v-model="password"
        type="password"
        show-password
        class="input"
        placeholder="请输入密码"
        @keyup.enter="submit()"
      />
      <el-button type="primary" class="button" :loading="loading" @click="submit()">进入数据概览</el-button>
    </el-card>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 42px;
  align-items: center;
  min-height: 100vh;
  padding: 48px clamp(20px, 8vw, 120px);
  box-sizing: border-box;
  background:
    radial-gradient(circle at 20% 15%, rgba(250, 204, 21, 0.18), transparent 28%),
    radial-gradient(circle at 75% 18%, rgba(37, 99, 235, 0.18), transparent 26%),
    linear-gradient(145deg, #0f172a 0%, #111827 55%, #1f2937 100%);
  color: #f8fafc;
}

.intro p {
  color: #facc15;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.intro h1 {
  max-width: 620px;
  margin: 0;
  font-size: clamp(36px, 6vw, 64px);
  line-height: 1.08;
}

.intro span {
  display: block;
  margin-top: 22px;
  color: #cbd5e1;
  font-size: 18px;
}

.login-card {
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
}

.login-card h2 {
  margin: 0;
  color: #0f172a;
}

.login-card p {
  margin: 10px 0 24px;
  color: #64748b;
}

.input,
.button {
  width: 100%;
}

.button {
  margin-top: 18px;
}

@media (max-width: 820px) {
  .login-page {
    grid-template-columns: 1fr;
  }
}
</style>
