<script setup>
import Header from '@/components/Header.vue'
import { onMounted, ref, reactive } from 'vue'
import { ElForm, ElInput, ElFormItem, ElButton, ElTable, ElTableColumn, ElDialog, ElSelect, ElOption, ElPagination, ElMessage } from 'element-plus'
import { getStudentList, editCharge } from '@/services'
import { charge } from '@/utils'
import { HOUSES, TEACHER_FILTER_OPTIONS, getChargeColor } from '@/constants'
import { useRouter } from 'vue-router'
import '@/styles/search-form.css'

const router = useRouter()

const pageNum = ref(1)
const total = ref(0)
const loading = ref(false)

const defaultFormInline = {
  id: '',
  name: '',
  charge: '',
  teacher: '',
  address: '',
}

onMounted(() => {
  fetchData()
})

const handleCurrentChange = () => {
  fetchData()
}

async function fetchData() {
  loading.value = true
  try {
    const data = await getStudentList(formInline, pageNum.value)
    tableData.splice(0, tableData.length, ...data.list)
    total.value = data.total
  } catch (err) {
    ElMessage({
      message: '加载失败，请稍后重试',
      type: 'error',
    })
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

const tableData = reactive([])

const tableRowClassName = ({ row }) => {
  if (row.charge === '等待分院') {
    return 'warning-row'
  } else if (row.teacher === '未分配') {
    return 'success-row'
  }
  return ''
}

const dialogFormVisible = ref(false)
const selectId = ref(0)
const charger = ref('')

const openCharge = (id) => {
  dialogFormVisible.value = true
  selectId.value = id
}

const cancelCharge = () => {
  dialogFormVisible.value = false
  charger.value = ''
  selectId.value = 0
}

const assignHouse = async function() {
  if (charger.value === '') {
    ElMessage({
      message: '请选择学院',
      type: 'warning',
    })
    return
  }
  const data = {
    id: selectId.value,
    charge: charger.value,
  }
  const successFn = () => {
    dialogFormVisible.value = false
    charger.value = ''
    selectId.value = 0
    fetchData()
  }
  charge('分院中', data, editCharge, '分院成功', successFn)
}

const goDetail = (id) => {
  router.push({
    path: `/detail/${id}`,
  })
}

const formInline = reactive({ ...defaultFormInline })
</script>

<template>
  <div class="container">
    <Header />
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
    <div class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="tableData"
        empty-text="暂无数据"
        style="width: 100%; padding: 0 1vw"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="id" label="学员编号" min-width="80" />
        <el-table-column prop="name" label="姓名" min-width="70" />
        <el-table-column prop="charge" label="所属学院" min-width="90">
          <template #default="{ row }">
            <span :style="getChargeColor(row.charge)">{{ row.charge }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="teacher" label="教员" min-width="70" />
        <el-table-column prop="need" label="科目" min-width="80" show-overflow-tooltip />
        <el-table-column prop="sex" label="性别" min-width="50" />
        <el-table-column prop="grade" label="年级" min-width="60" />
        <el-table-column prop="address" show-overflow-tooltip label="地址" min-width="100" />
        <el-table-column fixed="right" label="操作" min-width="90">
          <template #default="{ row }">
            <el-button
              v-if="row.charge === '等待分院'"
              link
              type="primary"
              size="small"
              @click="openCharge(row.id)"
            >
              分院
            </el-button>
            <el-button v-else link type="success" size="small" @click="goDetail(row.id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogFormVisible" title="分院帽" width="300">
      <el-select v-model="charger" placeholder="请使用分院帽分配学院">
        <el-option v-for="item in HOUSES" :key="item" :label="item" :value="item" />
      </el-select>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelCharge()">取消</el-button>
          <el-button type="primary" @click="assignHouse()">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-pagination
      :page-size="20"
      :pager-count="5"
      layout="prev, pager, next"
      :total="total"
      v-model:current-page="pageNum"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}
</style>
