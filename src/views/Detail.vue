<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElDialog, ElMessage } from 'element-plus'
import { deleteStudent, getStudentDetail, publicStudent } from '@/services'
import { charge } from '@/utils'
import Teachers from '@/components/Teachers.vue'
import Header from '@/components/Header.vue'
import StudentDetailCard from '@/components/StudentDetailCard.vue'

const router = useRouter()
const route = useRoute()

const detailData = reactive({})
const dialogConfirmVisible = ref(false)
const isDelete = ref(true)
const loading = ref(false)

onMounted(() => {
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const data = await getStudentDetail(route.params.id)
    Object.assign(detailData, { ...data })
  } catch (err) {
    ElMessage({
      message: '加载失败，请稍后重试',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const deleteSelectStudent = async function() {
  const data = {
    id: route.params.id,
  }
  const successFn = () => {
    dialogConfirmVisible.value = false
    router.push({
      path: '/admin',
    })
  }
  charge('删除中', data, deleteStudent, '删除成功', successFn)
}

const publicSelectStudent = async function() {
  const data = {
    id: route.params.id,
    isPublic: !detailData.isPublic,
  }
  const successFn = () => {
    dialogConfirmVisible.value = false
    fetchData()
  }
  charge('修改中', data, publicStudent, '修改成功', successFn)
}

const editStudent = () => {
  if (isDelete.value) {
    deleteSelectStudent()
  } else {
    publicSelectStudent()
  }
}
</script>

<template>
  <div>
    <Header />
    <div v-loading="loading">
      <StudentDetailCard v-if="detailData.id" :student="detailData" />
    </div>
    <template v-if="detailData.id">
      <el-button type="primary" class="button" @click="dialogConfirmVisible = true; isDelete = false;">
        {{ detailData.isPublic ? '隐藏' : '公开' }}
      </el-button>
      <el-button type="danger" class="button" @click="dialogConfirmVisible = true; isDelete = true">
        删除
      </el-button>
    </template>
    <el-dialog v-model="dialogConfirmVisible" top="30vh" width="70%">
      <span>确认{{ isDelete ? '删除' : (detailData.isPublic ? '隐藏' : '公开') }}该学员？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogConfirmVisible = false">取消</el-button>
          <el-button :type="isDelete ? 'danger' : 'primary'" @click="editStudent()">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <Teachers v-if="detailData.id" :student="detailData.id" @chargeChange="fetchData()" :edit="true" />
  </div>
</template>

<style scoped>
.button {
  margin-left: 4vw;
  margin-bottom: 2vw;
}
</style>
