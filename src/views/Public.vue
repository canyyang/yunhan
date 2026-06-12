<script setup>
import { ElButton, ElEmpty, ElMessage, ElTag } from 'element-plus'
import { getPublicStudent } from '@/services'
import { sortByCurrentStageFirst } from '@/utils'
import { reactive, ref } from 'vue'

const publicList = reactive([])
const loading = ref(false)

const normalizeList = (value) => {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value)
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const fetchData = async () => {
  loading.value = true
  try {
    const data = await getPublicStudent()
    publicList.splice(0, publicList.length, ...sortByCurrentStageFirst(data))
  } catch (err) {
    ElMessage({
      message: '加载失败，请稍后重试',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
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

const copyId = async (id) => {
  try {
    await copyText(String(id))
    ElMessage({
      message: `已复制学员编号 ${id}`,
      type: 'success',
    })
  } catch (error) {
    ElMessage({
      message: '复制失败，请手动复制编号',
      type: 'error',
    })
  }
}

const formatList = (value) => normalizeList(value).join('、') || '暂未填写'

fetchData()
</script>

<template>
  <main class="public-board" v-loading="loading">
    <section class="board-hero">
      <p class="eyebrow">云汉教育</p>
      <h1>待接学员信息栏</h1>
      <p>如有合适学员，请复制学员编号后私聊编委对接。</p>
    </section>

    <el-empty v-if="!loading && publicList.length === 0" description="暂无待接学员" />

    <section v-else class="student-grid">
      <article v-for="item in publicList" :key="item.id" class="student-card">
        <header class="card-header">
          <div>
            <span class="id-label">学员编号</span>
            <h2>#{{ item.id }}</h2>
          </div>
          <el-button type="primary" plain size="small" @click="copyId(item.id)">复制编号</el-button>
        </header>

        <div class="tag-row">
          <el-tag type="primary" effect="plain">{{ item.grade }}</el-tag>
          <el-tag type="info" effect="plain">{{ item.sex }}</el-tag>
          <el-tag v-if="item.area" type="success" effect="plain">{{ item.area }}</el-tag>
          <el-tag v-for="subject in normalizeList(item.need)" :key="subject" effect="plain">
            {{ subject }}
          </el-tag>
        </div>

        <dl class="info-list">
          <dt>补习时间</dt>
          <dd>{{ item.period }}</dd>
          <dt v-if="item.subject">选科方向</dt>
          <dd v-if="item.subject">{{ item.subject }}</dd>
          <dt>所在区域</dt>
          <dd>{{ item.area || item.address || '暂未填写' }}</dd>
          <dt v-if="item.score">当前水平</dt>
          <dd v-if="item.score">{{ item.score }}</dd>
          <dt v-if="item.remark">教员要求</dt>
          <dd v-if="item.remark">{{ item.remark }}</dd>
        </dl>

        <footer class="card-footer">
          <span>科目：{{ formatList(item.need) }}</span>
        </footer>
      </article>
    </section>
  </main>
</template>

<style scoped>
.public-board {
  min-height: 100vh;
  padding: 42px 18px 56px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 12% 0%, rgba(37, 99, 235, 0.09), transparent 30%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  color: #0f172a;
}

.board-hero {
  max-width: 860px;
  margin: 0 auto 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.board-hero h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.board-hero p {
  max-width: 640px;
  color: #64748b;
  line-height: 1.7;
}

.student-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 18px;
  max-width: 1120px;
  margin: 0 auto;
}

.student-card {
  padding: 22px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.id-label {
  color: #64748b;
  font-size: 13px;
}

.card-header h2 {
  margin: 4px 0 0;
  font-size: 26px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0;
}

.info-list {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px 14px;
  margin: 0;
}

.info-list dt {
  color: #64748b;
}

.info-list dd {
  margin: 0;
  color: #1e293b;
  line-height: 1.6;
  word-break: break-word;
}

.card-footer {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 768px) {
  .public-board {
    padding-top: 28px;
  }

  .board-hero h1 {
    font-size: 30px;
  }

  .student-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
  }

  .card-header .el-button {
    width: 100%;
  }

  .info-list {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>
