<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElDialog, ElMessage } from 'element-plus'
import AdminLayout from '@/layouts/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import HouseBadge from '@/components/ui/HouseBadge.vue'
import StudentDetailCard from '@/components/StudentDetailCard.vue'
import Teachers from '@/components/Teachers.vue'
import { deleteStudent, getStudentDetail, publicStudent } from '@/services'
import { charge } from '@/utils'

const router = useRouter()
const route = useRoute()
const detailData = reactive({})
const loading = ref(false)
const dialogConfirmVisible = ref(false)
const isDelete = ref(true)

async function fetchData() {
  loading.value = true
  try {
    const data = await getStudentDetail(route.params.id)
    Object.assign(detailData, data)
  } catch (err) {
    ElMessage({ message: '加载失败，请稍后重试', type: 'error' })
  } finally {
    loading.value = false
  }
}

const deleteSelectStudent = async () => {
  const successFn = () => {
    dialogConfirmVisible.value = false
    router.push({ path: '/admin/students' })
  }
  charge('删除中', { id: route.params.id }, deleteStudent, '删除成功', successFn)
}

const publicSelectStudent = async () => {
  const successFn = () => {
    dialogConfirmVisible.value = false
    fetchData()
  }
  charge('修改中', { id: route.params.id, isPublic: !detailData.isPublic }, publicStudent, '修改成功', successFn)
}

const editStudent = () => {
  if (isDelete.value) {
    deleteSelectStudent()
  } else {
    publicSelectStudent()
  }
}

const copySummary = async () => {
  const text = [
    `学员编号：${detailData.id}`,
    `姓名：${detailData.name}`,
    `年级：${detailData.grade}`,
    `科目：${detailData.need}`,
    `时间：${detailData.period}`,
    `地址：${detailData.address}`,
    `要求：${detailData.remark || '无'}`,
  ].join('\n')

  await navigator.clipboard?.writeText(text)
  ElMessage({ message: '已复制学员摘要', type: 'success' })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <AdminLayout>
    <PageHeader title="学员详情" description="集中查看学员需求、联系方式与教员推荐。">
      <template #actions>
        <el-button @click="router.push('/admin/students')">返回学员中心</el-button>
        <el-button type="primary" @click="copySummary()">复制摘要</el-button>
      </template>
    </PageHeader>

    <section v-loading="loading" class="detail-shell">
      <main class="detail-main admin-card">
        <div v-if="detailData.id" class="detail-title">
          <div>
            <span>#{{ detailData.id }}</span>
            <h2>{{ detailData.name }}</h2>
          </div>
          <div class="badges">
            <StatusBadge :student="detailData" />
            <HouseBadge :house="detailData.charge" />
          </div>
        </div>
        <StudentDetailCard v-if="detailData.id" :student="detailData" />
      </main>

      <aside v-if="detailData.id" class="detail-side admin-card">
        <h3>快捷操作</h3>
        <p>公开信息不包含联系方式，可用于待接学员信息栏。</p>
        <el-button
          type="primary"
          class="side-button"
          @click="dialogConfirmVisible = true; isDelete = false;"
        >
          {{ detailData.isPublic ? '隐藏公开信息' : '公开到信息栏' }}
        </el-button>
        <el-button
          type="danger"
          plain
          class="side-button"
          @click="dialogConfirmVisible = true; isDelete = true"
        >
          删除学员
        </el-button>
      </aside>
    </section>

    <section v-if="detailData.id" class="admin-section admin-card recommend-card">
      <div class="recommend-head">
        <h3>推荐魔法导师</h3>
        <p>根据科目、年级、地区与当前带生数量计算前端匹配度。</p>
      </div>
      <Teachers :student="detailData.id" :student-detail="detailData" @chargeChange="fetchData()" :edit="true" />
    </section>

    <el-dialog v-model="dialogConfirmVisible" top="30vh" width="360">
      <span>确认{{ isDelete ? '删除' : (detailData.isPublic ? '隐藏' : '公开') }}该学员？</span>
      <template #footer>
        <el-button @click="dialogConfirmVisible = false">取消</el-button>
        <el-button :type="isDelete ? 'danger' : 'primary'" @click="editStudent()">确认</el-button>
      </template>
    </el-dialog>
  </AdminLayout>
</template>

<style scoped>
.detail-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 18px;
}

.detail-main,
.detail-side,
.recommend-card {
  padding: 20px;
}

.detail-title {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  margin-bottom: 12px;
}

.detail-title span {
  color: var(--yh-admin-muted);
}

.detail-title h2 {
  margin: 4px 0 0;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-side h3,
.detail-side p,
.recommend-head h3,
.recommend-head p {
  margin: 0;
}

.detail-side p,
.recommend-head p {
  margin-top: 8px;
  color: var(--yh-admin-muted);
  line-height: 1.7;
}

.side-button {
  width: 100%;
  margin: 16px 0 0;
}

.recommend-head {
  margin-bottom: 16px;
}

:deep(.student-detail-card) {
  width: 100%;
  margin: 0;
  box-shadow: none;
}

@media (max-width: 980px) {
  .detail-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .detail-main,
  .detail-side,
  .recommend-card {
    padding: 14px;
  }

  .detail-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .detail-title h2 {
    font-size: 24px;
  }

  .badges {
    width: 100%;
  }

  .side-button {
    margin-top: 10px;
  }

  .side-button + .side-button {
    margin-left: 0;
  }

  :deep(.el-dialog) {
    width: calc(100% - 28px) !important;
  }
}
</style>
