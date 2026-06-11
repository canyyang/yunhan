<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElSkeleton, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import AdminLayout from '@/layouts/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import StudentStatsChart from '@/components/admin/StudentStatsChart.vue'
import { useStudentStats } from '@/composables/useStudentStats'

const router = useRouter()
const { loading, stats, refresh } = useStudentStats()

const houseData = computed(() =>
  Object.entries(stats.value.houseCounts).map(([name, value]) => ({ name, value })),
)

const subjectData = computed(() =>
  Object.entries(stats.value.subjectCounts)
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8),
)

const loadStats = async (force = false) => {
  try {
    await refresh(force)
  } catch (error) {
    ElMessage({ message: '工作台数据加载失败，请稍后重试', type: 'error' })
  }
}

const goDetail = (id) => {
  router.push({ path: `/admin/students/${id}` })
}

onMounted(() => loadStats())
</script>

<template>
  <AdminLayout>
    <PageHeader title="魔法工作台" description="汇总本期学员状态、分院进度与待处理事项。">
      <template #actions>
        <el-button :loading="loading" type="primary" @click="loadStats(true)">同步数据</el-button>
      </template>
    </PageHeader>

    <el-skeleton v-if="loading && stats.total === 0" :rows="8" animated />

    <template v-else>
      <section class="stats-grid">
        <StatCard label="全部学员" :value="stats.total" hint="当前聚合结果" />
        <StatCard label="等待分院" :value="stats.waitingHouse" hint="优先处理" tone="amber" />
        <StatCard label="待分配教员" :value="stats.waitingTeacher" hint="需要匹配导师" tone="green" />
        <StatCard label="已公开" :value="stats.public" hint="公开信息栏可见" tone="purple" />
      </section>

      <section class="chart-grid admin-section">
        <StudentStatsChart title="学院分布" type="pie" :data="houseData" />
        <StudentStatsChart title="科目需求 Top" :data="subjectData" />
      </section>

      <section class="admin-card todo-card admin-section">
        <div class="section-head">
          <div>
            <h3>待办学员</h3>
            <p>优先显示等待分院与待分配教员的学员。</p>
          </div>
          <el-button text type="primary" @click="router.push('/admin/students')">查看全部</el-button>
        </div>
        <div class="mobile-todo-list">
          <button v-for="row in stats.todos" :key="row.id" type="button" @click="goDetail(row.id)">
            <span>#{{ row.id }} · {{ row.name }}</span>
            <strong>{{ row.need }}</strong>
            <StatusBadge :student="row" />
          </button>
        </div>
        <div class="todo-table">
          <el-table :data="stats.todos" empty-text="暂无待办学员">
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="need" label="科目" show-overflow-tooltip />
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <StatusBadge :student="row" />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template #default="{ row }">
                <el-button link type="primary" @click="goDetail(row.id)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </template>
  </AdminLayout>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 16px;
}

.todo-card {
  padding: 20px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.section-head h3,
.section-head p {
  margin: 0;
}

.section-head p {
  margin-top: 8px;
  color: var(--yh-admin-muted);
}

@media (max-width: 1000px) {
  .stats-grid,
  .chart-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 700px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .todo-card {
    padding: 14px;
  }

  .section-head {
    align-items: stretch;
    flex-direction: column;
  }

  .todo-table {
    display: none;
  }

  .mobile-todo-list {
    display: grid;
    gap: 10px;
  }

  .mobile-todo-list button {
    display: grid;
    gap: 8px;
    width: 100%;
    padding: 12px;
    border: 1px solid var(--yh-admin-border);
    border-radius: 14px;
    background: #fff;
    color: #0f172a;
    text-align: left;
  }

  .mobile-todo-list span {
    color: var(--yh-admin-muted);
    font-size: 13px;
  }
}

@media (min-width: 701px) {
  .mobile-todo-list {
    display: none;
  }
}
</style>
