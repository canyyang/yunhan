<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElPagination,
  ElProgress,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus'
import { chargeStudent, deleteTeacher, getTeacherDetail, getTeacherList } from '@/services'
import { charge } from '@/utils'
import { AREAS, SUBJECTS, TEACH_GRADES } from '@/constants'
import { calculateMatchScore } from '@/composables/useMatchScore'
import MatchScoreTag from '@/components/ui/MatchScoreTag.vue'
import '@/styles/search-form.css'

const props = defineProps({
  student: {
    type: [String, Number],
    default: '',
  },
  studentDetail: {
    type: Object,
    default: null,
  },
  edit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['chargeChange'])

const defaultFormInline = {
  id: undefined,
  name: '',
  sex: '',
  subject: [],
  grade: [],
  area: [],
  address: '',
}

const formInline = reactive({ ...defaultFormInline })
const tableData = reactive([])
const teacherDetail = reactive({})
const drawerVisible = ref(false)
const dialogConfirmVisible = ref(false)
const selectId = ref(0)
const selectName = ref('')
const pageNum = ref(1)
const total = ref(0)
const loading = ref(false)
const detailLoading = ref(false)
const isMobile = ref(false)

const displayedTableData = computed(() => {
  const rows = tableData.map((teacher) => ({
    ...teacher,
    match: props.studentDetail ? calculateMatchScore(props.studentDetail, teacher) : null,
  }))

  if (!props.studentDetail) return rows
  return rows.sort((a, b) => b.match.score - a.match.score)
})

const detailMatch = computed(() => calculateMatchScore(props.studentDetail, teacherDetail))

async function fetchData() {
  loading.value = true
  try {
    const data = await getTeacherList(formInline, pageNum.value)
    tableData.splice(0, tableData.length, ...data.list)
    total.value = data.total
  } catch (err) {
    ElMessage({ message: '加载失败，请稍后重试', type: 'error' })
  } finally {
    loading.value = false
  }
}

async function getDetail(id) {
  detailLoading.value = true
  try {
    const data = await getTeacherDetail(id)
    Object.assign(teacherDetail, {
      ...data,
      subjectText: data.subject.join('、'),
      gradeText: data.grade.join('、'),
      areaText: data.area.join('、'),
      studentText: data.student.join('、'),
    })
  } catch (err) {
    ElMessage({ message: '加载详情失败，请稍后重试', type: 'error' })
  } finally {
    detailLoading.value = false
  }
}

const search = () => {
  pageNum.value = 1
  fetchData()
}

const resetFilter = () => {
  Object.assign(formInline, {
    ...defaultFormInline,
    subject: [],
    grade: [],
    area: [],
  })
  pageNum.value = 1
  fetchData()
}

const openDetail = async (id, name) => {
  selectId.value = id
  selectName.value = name
  drawerVisible.value = true
  await getDetail(id)
}

const closeDrawer = () => {
  drawerVisible.value = false
  dialogConfirmVisible.value = false
  selectId.value = 0
  selectName.value = ''
}

const chargeTeacher = async () => {
  const successFn = () => {
    closeDrawer()
    fetchData()
    emit('chargeChange')
  }
  charge('分配中', { id: selectId.value, name: selectName.value, student: props.student }, chargeStudent, '分配成功', successFn)
}

const deleteSelectTeacher = async () => {
  const successFn = () => {
    closeDrawer()
    fetchData()
  }
  charge('删除中', { id: selectId.value }, deleteTeacher, '删除成功', successFn)
}

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  fetchData()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<template>
  <div class="teachers-panel">
    <el-form :inline="true" :model="formInline" class="search-form">
      <el-form-item label="编号:" class="search-form-item">
        <el-input v-model="formInline.id" placeholder="教员编号" />
      </el-form-item>
      <el-form-item label="姓名:" class="search-form-item">
        <el-input v-model="formInline.name" placeholder="教员姓名" />
      </el-form-item>
      <el-form-item label="性别:" class="search-form-item">
        <el-select v-model="formInline.sex" placeholder="教员性别">
          <el-option v-for="item in ['男', '女']" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="科目:" class="search-form-item">
        <el-select v-model="formInline.subject" multiple collapse-tags placeholder="授课科目">
          <el-option v-for="item in SUBJECTS" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="年级:" class="search-form-item">
        <el-select v-model="formInline.grade" multiple collapse-tags placeholder="授课年级">
          <el-option v-for="item in TEACH_GRADES" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="地区:" class="search-form-item">
        <el-select v-model="formInline.area" multiple collapse-tags placeholder="授课地区">
          <el-option v-for="item in AREAS" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="住址:" class="search-form-address">
        <el-input v-model="formInline.address" placeholder="教员住址" />
      </el-form-item>
      <el-form-item class="search-form-button">
        <el-button type="primary" @click="search()">筛选</el-button>
        <el-button @click="resetFilter()">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table-wrapper">
      <el-table v-loading="loading" :data="displayedTableData" empty-text="暂无数据">
        <el-table-column prop="id" label="编号" width="70" />
        <el-table-column v-if="props.studentDetail" label="匹配" width="120">
          <template #default="{ row }">
            <MatchScoreTag :score="row.match.score" />
          </template>
        </el-table-column>
        <el-table-column label="学生" align="center" width="80">
          <template #default="{ row }">
            <el-progress :percentage="Math.min(100, row.student.length * 20)" :show-text="false" />
            <small>{{ row.student.length }} 人</small>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="90" />
        <el-table-column prop="sex" label="性别" width="70" />
        <el-table-column prop="address" label="地址" min-width="160" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="90">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row.id, row.name)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      class="pager"
      :page-size="10"
      :pager-count="5"
      layout="prev, pager, next"
      :total="total"
      v-model:current-page="pageNum"
      @current-change="fetchData"
    />

    <el-drawer v-model="drawerVisible" :title="teacherDetail.name || '教员详情'" :size="isMobile ? '100%' : '520px'">
      <div v-loading="detailLoading" class="drawer-body">
        <div v-if="props.studentDetail" class="match-box">
          <MatchScoreTag :score="detailMatch.score" />
          <div class="reason-list">
            <el-tag v-for="reason in detailMatch.reasons" :key="reason" effect="plain">{{ reason }}</el-tag>
          </div>
        </div>

        <el-descriptions :column="1" label-width="100px" border>
          <el-descriptions-item label="编号">{{ teacherDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ teacherDetail.sex }}</el-descriptions-item>
          <el-descriptions-item label="学生数">{{ teacherDetail.student?.length || 0 }}</el-descriptions-item>
          <el-descriptions-item v-if="teacherDetail.studentText" label="学生详情">
            {{ teacherDetail.studentText }}
          </el-descriptions-item>
          <el-descriptions-item label="教学科目">{{ teacherDetail.subjectText }}</el-descriptions-item>
          <el-descriptions-item label="授课年级">{{ teacherDetail.gradeText }}</el-descriptions-item>
          <el-descriptions-item label="地区">{{ teacherDetail.areaText }}</el-descriptions-item>
          <el-descriptions-item label="住址">{{ teacherDetail.address }}</el-descriptions-item>
          <el-descriptions-item label="毕业学校">{{ teacherDetail.school }}</el-descriptions-item>
          <el-descriptions-item v-if="teacherDetail.university" label="大学">{{ teacherDetail.university }}</el-descriptions-item>
          <el-descriptions-item v-if="teacherDetail.phone" label="号码">{{ teacherDetail.phone }}</el-descriptions-item>
          <el-descriptions-item v-if="teacherDetail.wechat" label="微信">{{ teacherDetail.wechat }}</el-descriptions-item>
          <el-descriptions-item v-if="teacherDetail.qq" label="QQ">{{ teacherDetail.qq }}</el-descriptions-item>
          <el-descriptions-item v-if="teacherDetail.remark" label="备注">{{ teacherDetail.remark }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="closeDrawer()">取消</el-button>
        <el-button v-if="props.edit" type="primary" @click="dialogConfirmVisible = true">分配</el-button>
        <el-button v-else type="danger" @click="dialogConfirmVisible = true">删除</el-button>
      </template>
    </el-drawer>

    <el-dialog v-model="dialogConfirmVisible" top="30vh" width="380">
      <span>{{ props.edit ? '确认分配该魔法导师？' : `确认删除该魔法导师？当前关联 ${teacherDetail.student?.length || 0} 位学员。` }}</span>
      <template #footer>
        <el-button @click="dialogConfirmVisible = false">取消</el-button>
        <el-button v-if="props.edit" type="primary" @click="chargeTeacher()">确认</el-button>
        <el-button v-else type="danger" @click="deleteSelectTeacher()">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.teachers-panel {
  min-width: 0;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.pager {
  justify-content: center;
  margin-top: 16px;
}

.drawer-body {
  display: grid;
  gap: 16px;
}

.match-box {
  padding: 14px;
  border-radius: 16px;
  background: #f8fafc;
}

.reason-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .table-wrapper {
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

  .drawer-body {
    padding-bottom: 12px;
  }

  :deep(.el-drawer__body) {
    padding: 14px;
  }

  :deep(.el-drawer__footer) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 12px 14px;
  }

  :deep(.el-drawer__footer .el-button) {
    width: 100%;
    margin-left: 0;
  }

  :deep(.el-dialog) {
    width: calc(100% - 28px) !important;
  }

  :deep(.el-descriptions__label),
  :deep(.el-descriptions__content) {
    padding: 10px 8px !important;
    word-break: break-word;
  }
}
</style>
