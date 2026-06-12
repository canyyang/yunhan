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
import { useAdminDataset } from '@/composables/useAdminDataset'
import { editCharge } from '@/services'
import { charge } from '@/utils'
import { filterStudents, paginateList, sortStudentsForList } from '@/utils/adminList'
import { AREAS, HOUSES, TEACHER_FILTER_OPTIONS } from '@/constants'
import '@/styles/search-form.css'

const router = useRouter()
const pageNum = ref(1)
const pageSize = 20
const dialogFormVisible = ref(false)
const selectId = ref(0)
const charger = ref('')

const { students, loading, ensureDataset, fetchDataset } = useAdminDataset()

const defaultFormInline = {
  id: '',
  name: '',
  charge: '',
  teacher: '',
  area: '',
  address: '',
}

const formInline = reactive({ ...defaultFormInline })

const filteredStudents = computed(() => filterStudents(students.value, formInline))
const sortedStudents = computed(() => sortStudentsForList(filteredStudents.value))
const total = computed(() => sortedStudents.value.length)
const tableData = computed(() => paginateList(sortedStudents.value, pageNum.value, pageSize))

const search = () => {
  pageNum.value = 1
}

const resetFilter = () => {
  Object.assign(formInline, defaultFormInline)
  pageNum.value = 1
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

  const successFn = async () => {
    cancelCharge()
    await fetchDataset(true)
  }
  charge('分院中', { id: selectId.value, charge: charger.value }, editCharge, '分院成功', successFn)
}

const goDetail = (id) => {
  router.push({ path: `/admin/students/${id}` })
}

onMounted(async () => {
  try {
    await ensureDataset()
  } catch (err) {
    ElMessage({ message: '加载失败，请稍后重试', type: 'error' })
  }
})
</script>

<template>
  <AdminLayout>
    <PageHeader title="学员中心" description="按状态管理学员，从分院到分配教员跟进流程。" />

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
        <el-form-item label="区域:" class="search-form-item">
          <el-select v-model="formInline.area" placeholder="所在区域" clearable>
            <el-option v-for="item in AREAS" :key="item" :label="item" :value="item" />
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

    <section class="admin-card table-card admin-section">
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
        <el-table-column prop="need" label="科目" min-width="110" show-overflow-tooltip class-name="yh-cell-ellipsis" label-class-name="yh-cell-ellipsis" />
        <el-table-column prop="grade" label="年级" width="80" />
        <el-table-column prop="area" label="区域" width="80" />
        <el-table-column prop="address" label="地址" min-width="160" show-overflow-tooltip class-name="yh-cell-ellipsis" label-class-name="yh-cell-ellipsis" />
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

    <div class="pager-wrap">
      <el-pagination
        class="pager"
        :page-size="pageSize"
        :pager-count="5"
        layout="prev, pager, next"
        :total="total"
        v-model:current-page="pageNum"
      />
    </div>

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
.filter-panel {
  padding: 18px 20px 6px;
}

.table-card {
  padding: 8px 12px 16px;
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

  :deep(.el-dialog) {
    width: calc(100% - 28px) !important;
  }
}
</style>
