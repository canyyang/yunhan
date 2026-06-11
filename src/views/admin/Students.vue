<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElPagination,
  ElSelect,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import AdminLayout from '@/layouts/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import HouseBadge from '@/components/ui/HouseBadge.vue'
import { editCharge, getStudentList } from '@/services'
import { charge } from '@/utils'
import { getStudentStatus } from '@/composables/useStudentStats'
import { HOUSES, TEACHER_FILTER_OPTIONS } from '@/constants'
import '@/styles/search-form.css'

const router = useRouter()
const pageNum = ref(1)
const total = ref(0)
const loading = ref(false)
const tableData = reactive([])
const viewMode = ref('list')
const dialogFormVisible = ref(false)
const selectId = ref(0)
const charger = ref('')

const defaultFormInline = {
  id: '',
  name: '',
  charge: '',
  teacher: '',
  address: '',
}

const formInline = reactive({ ...defaultFormInline })

const kanbanColumns = computed(() => [
  {
    key: 'waitingHouse',
    title: '等待分院',
    desc: '需要使用分院帽',
    students: tableData.filter((item) => getStudentStatus(item) === 'waitingHouse'),
  },
  {
    key: 'waitingTeacher',
    title: '待分配教员',
    desc: '等待魔法导师',
    students: tableData.filter((item) => getStudentStatus(item) === 'waitingTeacher'),
  },
  {
    key: 'assigned',
    title: '已分配',
    desc: '已进入跟进',
    students: tableData.filter((item) => getStudentStatus(item) === 'assigned'),
  },
  {
    key: 'public',
    title: '已公开',
    desc: '公开栏可见',
    students: tableData.filter((item) => getStudentStatus(item) === 'public'),
  },
])

async function fetchData() {
  loading.value = true
  try {
    const data = await getStudentList(formInline, pageNum.value)
    tableData.splice(0, tableData.length, ...data.list)
    total.value = data.total
  } catch (err) {
    ElMessage({ message: '加载失败，请稍后重试', type: 'error' })
  } finally {
    loading.value = false
  }
}

const search = () => {
  pageNum.value = 1
  fetchData()
}

const resetFilter = () => {
  Object.assign(formInline, defaultFormInline)
  pageNum.value = 1
  fetchData()
}

const openCharge = (id) => {
  dialogFormVisible.value = true
  selectId.value = id
}

const cancelCharge = () => {
  dialogFormVisible.value = false
  charger.value = ''
  selectId.value = 0
}

const assignHouse = async () => {
  if (!charger.value) {
    ElMessage({ message: '请选择学院', type: 'warning' })
    return
  }

  const successFn = () => {
    cancelCharge()
    fetchData()
  }
  charge('分院中', { id: selectId.value, charge: charger.value }, editCharge, '分院成功', successFn)
}

const goDetail = (id) => {
  router.push({ path: `/admin/students/${id}` })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <AdminLayout>
    <PageHeader title="学员中心" description="按状态管理学员，从分院到分配教员形成清晰跟进流程。">
      <template #actions>
        <el-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">列表</el-button>
        <el-button :type="viewMode === 'kanban' ? 'primary' : 'default'" @click="viewMode = 'kanban'">看板</el-button>
      </template>
    </PageHeader>

    <section class="admin-card filter-panel">
      <el-form :inline="true" :model="formInline" class="search-form">
        <el-form-item label="编号:" class="search-form-item">
          <el-input v-model="formInline.id" placeholder="学员编号" />
        </el-form-item>
        <el-form-item label="姓名:" class="search-form-item">
          <el-input v-model="formInline.name" placeholder="学员姓名" />
        </el-form-item>
        <el-form-item label="学院:" class="search-form-item">
          <el-select v-model="formInline.charge" placeholder="所属学院">
            <el-option
              v-for="item in [...HOUSES, '等待分院', '']"
              :key="item"
              :label="item || '不限'"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="教员:" class="search-form-item">
          <el-select v-model="formInline.teacher" placeholder="学员教员">
            <el-option
              v-for="item in [...TEACHER_FILTER_OPTIONS, '']"
              :key="item"
              :label="item || '不限'"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="住址:" class="search-form-address">
          <el-input v-model="formInline.address" placeholder="学员住址" />
        </el-form-item>
        <el-form-item class="search-form-button">
          <el-button type="primary" @click="search()">筛选</el-button>
          <el-button @click="resetFilter()">重置</el-button>
        </el-form-item>
      </el-form>
    </section>

    <section v-if="viewMode === 'list'" class="admin-card table-card admin-section">
      <el-table v-loading="loading" :data="tableData" empty-text="暂无数据">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <StatusBadge :student="row" />
          </template>
        </el-table-column>
        <el-table-column label="学院" min-width="130">
          <template #default="{ row }">
            <HouseBadge :house="row.charge" />
          </template>
        </el-table-column>
        <el-table-column prop="teacher" label="教员" min-width="90" />
        <el-table-column prop="need" label="科目" min-width="110" show-overflow-tooltip />
        <el-table-column prop="grade" label="年级" width="80" />
        <el-table-column prop="address" label="地址" min-width="160" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="130">
          <template #default="{ row }">
            <el-button v-if="row.charge === '等待分院'" link type="primary" @click="openCharge(row.id)">
              分院
            </el-button>
            <el-button v-else link type="success" @click="goDetail(row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <section v-else v-loading="loading" class="kanban admin-section">
      <article v-for="column in kanbanColumns" :key="column.key" class="kanban-column">
        <header>
          <div>
            <h3>{{ column.title }}</h3>
            <p>{{ column.desc }}</p>
          </div>
          <strong>{{ column.students.length }}</strong>
        </header>
        <div class="kanban-list">
          <button v-for="student in column.students" :key="student.id" class="student-card" @click="goDetail(student.id)">
            <span>#{{ student.id }} · {{ student.name }}</span>
            <strong>{{ student.need }}</strong>
            <small>{{ student.grade }} / {{ student.address }}</small>
          </button>
        </div>
      </article>
    </section>

    <el-pagination
      class="pager"
      :page-size="20"
      :pager-count="5"
      layout="prev, pager, next"
      :total="total"
      v-model:current-page="pageNum"
      @current-change="fetchData"
    />

    <el-dialog v-model="dialogFormVisible" title="分院帽" width="320">
      <el-select v-model="charger" placeholder="请使用分院帽分配学院">
        <el-option v-for="item in HOUSES" :key="item" :label="item" :value="item" />
      </el-select>
      <template #footer>
        <el-button @click="cancelCharge()">取消</el-button>
        <el-button type="primary" @click="assignHouse()">确认</el-button>
      </template>
    </el-dialog>
  </AdminLayout>
</template>

<style scoped>
.filter-panel,
.table-card {
  padding: 16px;
}

.kanban {
  display: grid;
  grid-template-columns: repeat(4, minmax(240px, 1fr));
  gap: 16px;
  overflow-x: auto;
}

.kanban-column {
  min-height: 360px;
  padding: 16px;
  border: 1px solid var(--yh-admin-border);
  border-radius: var(--yh-admin-radius);
  background: rgba(255, 255, 255, 0.72);
}

.kanban-column header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.kanban-column h3,
.kanban-column p {
  margin: 0;
}

.kanban-column p {
  margin-top: 6px;
  color: var(--yh-admin-muted);
  font-size: 13px;
}

.kanban-column header strong {
  color: var(--yh-admin-primary);
}

.kanban-list {
  display: grid;
  gap: 10px;
}

.student-card {
  display: grid;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 16px;
  background: #fff;
  color: #0f172a;
  text-align: left;
  cursor: pointer;
}

.student-card:hover {
  border-color: rgba(37, 99, 235, 0.42);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
}

.student-card span,
.student-card small {
  color: var(--yh-admin-muted);
}

.pager {
  justify-content: center;
  margin-top: 18px;
}

@media (max-width: 900px) {
  .kanban {
    display: flex;
    gap: 12px;
    margin-right: -10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 4px;
  }

  .kanban-column {
    flex: 0 0 82vw;
    min-height: 320px;
    scroll-snap-align: start;
  }
}

@media (max-width: 768px) {
  .filter-panel,
  .table-card {
    padding: 12px;
  }

  .table-card {
    margin-left: -4px;
    margin-right: -4px;
  }

  :deep(.el-table) {
    font-size: 13px;
  }

  :deep(.el-table .cell) {
    padding: 0 8px;
  }

  .pager {
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 4px;
  }

  :deep(.el-dialog) {
    width: calc(100% - 28px) !important;
  }
}
</style>
