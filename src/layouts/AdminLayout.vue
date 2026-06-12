<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStage } from '@/utils'
import { hydrateAdminDatasetFromStorage, useAdminDataset } from '@/composables/useAdminDataset'
import '@/styles/tokens-magic.css'

const route = useRoute()
const router = useRouter()
const { stage: datasetStage } = useAdminDataset()

onMounted(() => {
  hydrateAdminDatasetFromStorage()
})

const stage = computed(() => datasetStage.value || getStage())

const navItems = [
  { label: '数据概览', path: '/admin', mark: '01' },
  { label: '学员中心', path: '/admin/students', mark: '02' },
  { label: '教员中心', path: '/admin/teachers', mark: '03' },
]

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path === path || route.path.startsWith(`${path}/`)
}

const goPath = (path) => {
  router.push({ path })
}
</script>

<template>
  <div class="admin-layout">
    <header class="admin-topbar">
      <div class="topbar-glow topbar-glow-left" aria-hidden="true"></div>
      <div class="topbar-glow topbar-glow-right" aria-hidden="true"></div>
      <div class="topbar-accent" aria-hidden="true"></div>
      <div class="topbar-inner">
        <button type="button" class="brand" @click="goPath('/admin')">
          <span class="crest">
            <span class="crest-ring" aria-hidden="true"></span>
            YH
          </span>
          <span class="brand-text">
            <strong>云汉教育</strong>
            <small>Admin Console</small>
          </span>
        </button>
        <span class="topbar-divider" aria-hidden="true"></span>
        <span class="stage-tag">
          <span class="stage-dot" aria-hidden="true"></span>
          第 {{ stage }} 期
        </span>
      </div>
    </header>

    <div class="admin-body">
      <aside class="sidebar">
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
        <main class="content">
          <slot></slot>
        </main>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: var(--yh-admin-page);
}

.admin-topbar {
  position: sticky;
  top: 0;
  z-index: var(--yh-admin-topbar-z);
  isolation: isolate;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(244, 249, 255, 0.98) 48%, rgba(236, 245, 255, 0.96) 100%);
  border-bottom: 1px solid rgba(64, 158, 255, 0.14);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.95) inset,
    0 10px 30px rgba(64, 158, 255, 0.1);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
}

.admin-topbar::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(64, 158, 255, 0.07) 0.6px, transparent 0.6px);
  background-size: 14px 14px;
  opacity: 0.45;
  pointer-events: none;
}

.topbar-glow {
  position: absolute;
  top: -40px;
  width: 280px;
  height: 120px;
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
}

.topbar-glow-left {
  left: -40px;
  background: rgba(121, 187, 255, 0.35);
}

.topbar-glow-right {
  right: 8%;
  background: rgba(64, 158, 255, 0.22);
}

.topbar-accent {
  position: absolute;
  inset: auto 0 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(121, 187, 255, 0.5) 12%,
    #409eff 50%,
    rgba(51, 126, 204, 0.85) 88%,
    transparent 100%
  );
}

.topbar-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  width: min(1280px, calc(100% - 40px));
  height: var(--yh-admin-topbar-height);
  margin: 0 auto;
  padding: 0 6px;
  box-sizing: border-box;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 4px 8px 4px 0;
  border: 0;
  border-radius: 14px;
  background: transparent;
  cursor: pointer;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.brand:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.crest {
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(64, 158, 255, 0.22);
  border-radius: 12px;
  background:
    linear-gradient(155deg, rgba(255, 255, 255, 0.98) 0%, rgba(236, 245, 255, 0.92) 100%);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.95) inset,
    0 6px 16px rgba(64, 158, 255, 0.16);
  color: var(--yh-admin-accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.crest-ring {
  position: absolute;
  inset: -3px;
  border: 1px solid rgba(64, 158, 255, 0.12);
  border-radius: 14px;
}

.brand-text {
  display: grid;
  gap: 3px;
  text-align: left;
}

.brand-text strong {
  color: #2b5ea8;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.03em;
}

.brand-text small {
  color: #79bbff;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.topbar-divider {
  flex-shrink: 0;
  width: 1px;
  height: 30px;
  background: linear-gradient(180deg, transparent, rgba(64, 158, 255, 0.28), transparent);
}

.stage-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 6px 14px 6px 12px;
  border: 1px solid rgba(64, 158, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 4px 12px rgba(64, 158, 255, 0.08);
  color: var(--yh-admin-accent-dark);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.stage-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(180deg, #79bbff 0%, #409eff 100%);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.14);
}

.admin-body {
  display: flex;
  min-height: calc(100vh - var(--yh-admin-topbar-height) - 1px);
}

.sidebar {
  position: sticky;
  top: var(--yh-admin-topbar-height);
  z-index: calc(var(--yh-admin-topbar-z) - 100);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 210px;
  height: calc(100vh - var(--yh-admin-topbar-height));
  padding: 16px 12px;
  box-sizing: border-box;
  border-right: 1px solid var(--yh-admin-border);
  background: #fff;
}

.nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.nav button {
  display: flex;
  flex: 1;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 52px;
  padding: 11px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #606266;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.nav button:hover {
  background: #f5f9ff;
  color: var(--yh-admin-accent);
}

.nav button.active {
  background: var(--yh-admin-header-bg);
  color: var(--yh-admin-accent);
  font-weight: 600;
}

.nav span {
  color: var(--yh-admin-accent);
  font-size: 11px;
  font-weight: 800;
  opacity: 0.85;
}

.workspace {
  flex: 1;
  min-width: 0;
}

.content {
  width: min(1280px, calc(100% - 40px));
  margin: 0 auto;
  padding: 20px 0 40px;
}

@media (max-width: 900px) {
  .topbar-inner {
    width: calc(100% - 24px);
  }

  .admin-body {
    display: block;
  }

  .sidebar {
    top: var(--yh-admin-topbar-height);
    width: 100%;
    height: auto;
    padding: 10px 12px;
    border-right: 0;
    border-bottom: 1px solid var(--yh-admin-border);
  }

  .nav {
    display: grid;
    flex: none;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
  }

  .nav button {
    flex: none;
    justify-content: center;
    min-height: 44px;
    padding: 10px 8px;
    white-space: nowrap;
  }

  .nav span {
    display: none;
  }

  .content {
    width: calc(100% - 24px);
    padding: 14px 0 28px;
  }
}

@media (max-width: 768px) {
  .admin-layout {
    --yh-admin-topbar-height: 52px;
  }

  .topbar-inner {
    gap: 10px;
    padding: 0 2px;
  }

  .brand-text strong {
    font-size: 16px;
  }

  .brand-text small {
    display: none;
  }

  .topbar-divider {
    display: none;
  }

  .stage-tag {
    padding: 5px 10px 5px 9px;
    font-size: 12px;
  }

  .crest {
    width: 34px;
    height: 34px;
  }

  .topbar-glow {
    display: none;
  }
}
</style>
