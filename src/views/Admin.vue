<script setup>
import Header from '@/components/Header.vue'
import { onMounted, ref, reactive } from 'vue'
import { ElForm, ElInput, ElFormItem, ElButton, ElTable, ElTableColumn, ElDialog, ElSelect, ElOption, ElPagination, ElMessage  } from 'element-plus'
import { getStudentList, editCharge } from '@/services'
import { charge } from '@/utils'
import { useRouter } from 'vue-router'

const router = useRouter()

const pageNum = ref(1)
const total = ref(10)

const chargers = ['斯莱特林', '格兰芬多', '拉文克劳', '赫奇帕奇']

onMounted(() => {
  fetchData()
})

const handleCurrentChange = () => {
  fetchData()
}

async function fetchData() {
  try {
    const data = await getStudentList(formInline, pageNum.value)
    tableData.splice(0, tableData.length, ...data.list)
    total.value = data.total
  } catch (err) {
    console.error(err)
  }
}


const tableData = reactive([])

const tableRowClassName = ({ row, rowIndex }) => {
  if (row.charge === '等待分院') {
    return 'warning-row';
  } else if (row.teacher === '未分配') {
    return 'success-row';
  }
  return '';
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

const chargeStudent = async function() {
  if (charger.value === '') {
    ElMessage({
    message: '请选择学院',
    type: 'warning',
    })
    return
  }
  const data = {
    id: selectId.value,
    charge: charger.value
  }
  const successFn = () => {
    dialogFormVisible.value = false
    charger.value = ''
    selectId.value = 0
    fetchData()
  }
  charge('分院中', data, editCharge, '分院成功', successFn)
}


// 方法：根据 charge 字段返回字体颜色
const getChargeColor = (charge) => {
  switch(charge) {
    case '等待分院':
      return 'color: #000000;';
    case '斯莱特林':
      return 'color: #2A623D;';
    case '格兰芬多':
      return 'color: #9C2D2F;';
    case '拉文克劳':
      return 'color: #0E1A8C;';
    case '赫奇帕奇':
      return 'color: #F1C232;';
  }
}

const goDetail = (id) => {
  router.push({
    path: `/detail/${id}`,
  })
}

const formInline = reactive({
  id: '',
  name: '',
  charge: '',
  teacher: '',
  address: ''
})

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
        <el-select
          v-model="formInline.charge"
          placeholder="所属学院"
        >
          <el-option
            v-for="item in [...chargers, '等待分院', '']"
            :key="item"
            :label="item || '不限'"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="教员:" class="search-form-item">
        <el-select
          v-model="formInline.teacher"
          placeholder="学员教员"
        >
          <el-option
            v-for="item in ['未分配', '已分配', '']"
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
        <el-button type="primary" @click="fetchData()">筛选</el-button>
      </el-form-item> 
    </el-form>
    <el-table :data="tableData" style="width: 100%; padding: 0 1vw" :row-class-name="tableRowClassName">
      <el-table-column prop="id" label="学员编号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="charge" label="所属学院" >
        <template #default="{ row }">
          <span :style="getChargeColor(row.charge)">{{ row.charge }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="teacher" label="教员" />
      <el-table-column prop="need" label="科目" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="grade" label="年级" />
      <el-table-column prop="address" show-overflow-tooltip label="地址" />
      <el-table-column fixed="right" label="操作" min-width="70">
        <template #default="{ row }">
          <el-button v-if="row.charge === '等待分院'" link type="primary" size="small" @click="openCharge(row.id)">接手</el-button>
          <el-button v-else link type="success" size="small" @click="goDetail(row.id)">操作</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="分院帽" width="300">
      <el-select v-model="charger" placeholder="请使用分院帽分配学院">
        <el-option v-for="item in chargers" :label="item" :value="item" />
      </el-select>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelCharge()">取消</el-button>
          <el-button type="primary" @click="chargeStudent()">确认</el-button>
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
.search-form {
  margin: 1vw 3vw;
}
.search-form .search-form-item:nth-child(odd) {
  margin-right: 3vw;
}
.search-form .search-form-item:nth-child(even) {
  margin-right: 0;
}
.search-form-item {
  width: 45vw;
}
.search-form-address {
  width: 70vw;
  margin-right: 6vw;
}
.search-form-button {
  margin-right: 0;
}
</style>