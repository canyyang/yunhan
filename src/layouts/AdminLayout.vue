<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { getStage } from '@/utils'
import '@/styles/tokens-magic.css'

const route = useRoute()
const router = useRouter()
const stage = getStage()

const navItems = [
  { label: '工作台', path: '/admin', mark: '01' },
  { label: '学员中心', path: '/admin/students', mark: '02' },
  { label: '教员中心', path: '/admin/teachers', mark: '03' },
  { label: '公开预览', path: '/public', mark: '04' },
]

const currentTitle = computed(() => {
  const match = navItems.find((item) => route.path === item.path || route.path.startsWith(`${item.path}/`))
  return match?.label || '云汉管理'
})

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path === path || route.path.startsWith(`${path}/`)
}

const goPath = (path) => {
  router.push({ path })
}

const logout = () => {
  localStorage.removeItem('token')
  router.push({ path: '/login' })
}
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="crest">YH</span>
        <div>
          <strong>云汉教育</strong>
          <small>魔法管理台</small>
        </div>
      </div>
      <nav class="nav">
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          :class="{ active: isActive(item.path) }"
          @click="goPath(item.path)"
        >
          <span>{{ item.mark }}</span>
          {{ item.label }}
        </button>
      </nav>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div>
          <span>第 {{ stage }} 期</span>
          <h2>{{ currentTitle }}</h2>
        </div>
        <el-button plain @click="logout()">退出登录</el-button>
      </header>
      <main class="content">
        <slot></slot>
      </main>
    </section>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.16), transparent 30%),
    var(--yh-admin-page);
}

.sidebar {
  position: sticky;
  top: 0;
  width: 238px;
  height: 100vh;
  padding: 22px 18px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
  color: #e5e7eb;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 32px;
}

.crest {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  font-weight: 800;
}

.brand strong,
.brand small {
  display: block;
}

.brand small {
  margin-top: 4px;
  color: #94a3b8;
}

.nav {
  display: grid;
  gap: 8px;
}

.nav button {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: #cbd5e1;
  text-align: left;
  cursor: pointer;
}

.nav button:hover,
.nav button.active {
  background: rgba(37, 99, 235, 0.18);
  color: #ffffff;
}

.nav span {
  color: #60a5fa;
  font-size: 12px;
  font-weight: 800;
}

.workspace {
  flex: 1;
  min-width: 0;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(241, 245, 249, 0.86);
  backdrop-filter: blur(14px);
}

.topbar span {
  color: var(--yh-admin-muted);
  font-size: 13px;
}

.topbar h2 {
  margin: 4px 0 0;
  color: #0f172a;
}

.content {
  width: min(1280px, calc(100% - 48px));
  margin: 0 auto;
  padding: 28px 0 46px;
}

@media (max-width: 900px) {
  .admin-layout {
    display: block;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 20;
    width: 100%;
    height: auto;
    padding: 12px 12px 10px;
  }

  .brand {
    margin-bottom: 10px;
  }

  .crest {
    width: 36px;
    height: 36px;
    border-radius: 12px;
  }

  .brand small {
    display: none;
  }

  .nav {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: none;
  }

  .nav::-webkit-scrollbar {
    display: none;
  }

  .nav button {
    flex: 0 0 auto;
    width: auto;
    min-width: 104px;
    justify-content: center;
    padding: 10px 12px;
    white-space: nowrap;
  }

  .nav span {
    display: none;
  }

  .topbar {
    padding: 12px 14px;
  }

  .topbar h2 {
    font-size: 18px;
  }

  .topbar .el-button {
    padding: 8px 12px;
  }

  .content {
    width: calc(100% - 20px);
    padding: 16px 0 28px;
  }
}

@media (max-width: 480px) {
  .topbar {
    align-items: flex-start;
  }

  .topbar .el-button {
    min-width: 78px;
  }
}
</style>
