<script setup>
import { computed, onMounted } from 'vue'
import { ElButton, ElSkeleton, ElMessage } from 'element-plus'
import AdminLayout from '@/layouts/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { useStudentStats } from '@/composables/useStudentStats'
import emailIcon from '@/assets/email.png'
import wechatIcon from '@/assets/wechat.webp'

const { loading, stats, refresh } = useStudentStats()

const GRADE_ITEMS = [
  { label: '小学', key: '小学', tone: 'green' },
  { label: '初中', key: '初中', tone: 'amber' },
  { label: '高中', key: '高中', tone: 'blue' },
  { label: '其他', key: '其他', tone: 'purple' },
]

const SUBJECT_TONES = ['blue', 'green', 'amber', 'purple']
const SUBJECT_LIMIT = 4

const hotSubjects = computed(() =>
  Object.entries(stats.value.subjectCounts)
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, SUBJECT_LIMIT)
    .map((item, index) => ({
      ...item,
      tone: SUBJECT_TONES[index % SUBJECT_TONES.length],
    })),
)

const loadStats = async (force = true) => {
  try {
    await refresh(force)
  } catch (error) {
    ElMessage({ message: '数据加载失败，请稍后重试', type: 'error' })
  }
}

const CONTACT = {
  email: 'canyangchen@126.com',
  wechat: 'canyang_0124',
}

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

const copyContact = async (label, value) => {
  try {
    await copyText(value)
    ElMessage({ message: `已复制${label}`, type: 'success' })
  } catch (error) {
    ElMessage({ message: '复制失败，请手动复制', type: 'error' })
  }
}

onMounted(() => loadStats(true))
</script>

<template>
  <AdminLayout>
    <PageHeader :title="`第 ${stats.stage} 期数据概览`" description="汇总本期学员状态与分布情况。">
      <template #actions>
        <el-button :loading="loading" type="primary" @click="loadStats(true)">刷新数据</el-button>
      </template>
    </PageHeader>

    <el-skeleton v-if="loading && stats.total === 0" :rows="8" animated />

    <template v-else>
      <section class="stats-grid">
        <StatCard label="全部学员" :value="stats.total" hint="本期学员" />
        <StatCard label="等待分院" :value="stats.waitingHouse" hint="优先处理" tone="amber" />
        <StatCard label="待分配教员" :value="stats.waitingTeacher" hint="需要匹配导师" tone="green" />
        <StatCard label="已公开" :value="stats.public" hint="公开信息栏可见" tone="purple" />
      </section>

      <section class="distribution-grid admin-section">
        <div class="distribution-panel admin-card">
          <div class="panel-head">
            <h3>学段分布</h3>
            <p>按小学、初中、高中与其他统计本期学员人数。</p>
          </div>
          <div class="grade-grid">
            <StatCard
              v-for="item in GRADE_ITEMS"
              :key="item.key"
              :label="item.label"
              :value="stats.gradeCounts[item.key]"
              :tone="item.tone"
              class="distribution-stat"
            />
          </div>
        </div>

        <div class="distribution-panel admin-card">
          <div class="panel-head">
            <h3>热门科目</h3>
            <p>展示本期需求人数最多的科目，最多显示四项。</p>
          </div>
          <div v-if="hotSubjects.length" class="subject-grid">
            <StatCard
              v-for="item in hotSubjects"
              :key="item.name"
              :label="item.name"
              :value="item.value"
              :tone="item.tone"
              class="distribution-stat"
            />
          </div>
          <p v-else class="panel-empty">暂无科目需求数据</p>
        </div>
      </section>
    </template>

    <section class="contact-section admin-section">
      <article class="contact-card admin-card">
        <div class="contact-glow contact-glow-left" aria-hidden="true"></div>
        <div class="contact-glow contact-glow-right" aria-hidden="true"></div>

        <div class="contact-main">
          <span class="contact-badge">Support</span>
          <h3>联系梅林</h3>
          <p class="contact-desc">
            Hi我是七期的灿阳师兄，任何异常或建议随时联系我。
          </p>
        </div>

        <div class="contact-channels">
          <button type="button" class="contact-item" @click="copyContact('邮箱', CONTACT.email)">
            <span class="contact-icon" aria-hidden="true">
              <img :src="emailIcon" alt="" class="contact-icon-img" />
            </span>
            <span class="contact-meta">
              <span class="contact-label">邮箱</span>
              <span class="contact-value">{{ CONTACT.email }}</span>
            </span>
            <span class="contact-action">复制</span>
          </button>

          <button type="button" class="contact-item" @click="copyContact('微信号', CONTACT.wechat)">
            <span class="contact-icon" aria-hidden="true">
              <img :src="wechatIcon" alt="" class="contact-icon-img" />
            </span>
            <span class="contact-meta">
              <span class="contact-label">微信</span>
              <span class="contact-value">{{ CONTACT.wechat }}</span>
            </span>
            <span class="contact-action">复制</span>
          </button>
        </div>
      </article>
    </section>
  </AdminLayout>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.distribution-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
}

.distribution-panel {
  padding: 20px;
}

.panel-head h3 {
  margin: 0;
  color: var(--yh-admin-text);
  font-size: 18px;
  font-weight: 700;
}

.panel-head p {
  margin: 8px 0 0;
  color: var(--yh-admin-muted);
  font-size: 14px;
  line-height: 1.6;
}

.grade-grid,
.subject-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.grade-grid :deep(.distribution-stat),
.subject-grid :deep(.distribution-stat) {
  padding: 16px 20px;
}

.grade-grid :deep(.distribution-stat strong),
.subject-grid :deep(.distribution-stat strong) {
  margin-top: 8px;
}

.panel-empty {
  margin: 18px 0 0;
  padding: 28px 16px;
  border: 1px dashed var(--yh-admin-border);
  border-radius: var(--yh-admin-radius);
  background: rgba(255, 255, 255, 0.72);
  color: var(--yh-admin-muted);
  text-align: center;
  line-height: 1.7;
}

.contact-section {
  margin-top: 16px;
}

.contact-card {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 28px;
  align-items: center;
  overflow: hidden;
  padding: 28px 30px;
  border: 1px solid rgba(64, 158, 255, 0.16);
  background:
    linear-gradient(135deg, rgba(236, 245, 255, 0.92) 0%, rgba(255, 255, 255, 0.98) 42%, rgba(248, 250, 252, 1) 100%);
}

.contact-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);
  pointer-events: none;
}

.contact-glow-left {
  top: -40px;
  left: -20px;
  width: 180px;
  height: 180px;
  background: rgba(64, 158, 255, 0.18);
}

.contact-glow-right {
  right: -30px;
  bottom: -50px;
  width: 220px;
  height: 220px;
  background: rgba(121, 187, 255, 0.14);
}

.contact-main {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
}

.contact-badge {
  display: inline-flex;
  padding: 4px 10px;
  border: 1px solid rgba(64, 158, 255, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--yh-admin-accent-dark);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.contact-main h3 {
  margin: 14px 0 0;
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.contact-desc {
  max-width: 420px;
  margin: 10px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.75;
}

.contact-channels {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 12px;
  flex-shrink: 0;
  width: min(100%, 360px);
}

.contact-item {
  display: flex;
  gap: 14px;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.contact-item:hover {
  transform: translateY(-1px);
  border-color: rgba(64, 158, 255, 0.32);
  box-shadow: 0 14px 30px rgba(64, 158, 255, 0.12);
}

.contact-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.1);
}

.contact-icon-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-meta {
  display: grid;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.contact-label {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.contact-value {
  color: #0f172a;
  font-size: 15px;
  font-weight: 600;
  word-break: break-all;
}

.contact-action {
  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ecf5ff;
  color: var(--yh-admin-accent-dark);
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 1000px) {
  .stats-grid,
  .distribution-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 700px) {
  .distribution-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .distribution-panel {
    padding: 14px;
  }

  .grade-grid,
  .subject-grid {
    gap: 10px;
    margin-top: 14px;
  }

  .contact-card {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    padding: 20px 18px;
  }

  .contact-main h3 {
    font-size: 22px;
  }

  .contact-channels {
    width: 100%;
  }

  .contact-item {
    padding: 12px 14px;
  }
}
</style>
