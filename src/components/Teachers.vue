<script setup>
import { onMounted, ref, reactive, defineEmits } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn, ElDialog, ElDescriptions, ElDescriptionsItem, ElSelect, ElOption, ElPagination  } from 'element-plus'
import { getTeacherList, chargeStudent, getTeacherDetail, deleteTeacher } from '@/services'
import { charge } from '../utils';


const props = defineProps(['student', 'edit'])
const emit = defineEmits()

const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '政治', '地理']
const areas = ['榕城', '东山', '蓝城', '渔湖', '梅云', '仙桥', '曲溪', '埔田', '云路', '锡场', '炮台', '玉滘', '揭西', '惠来', '其他']

onMounted(() => {
  fetchData()
})


async function fetchData() {
  try {
    const data = await getTeacherList(formInline, pageNum.value)
    tableData.splice(0, tableData.length, ...data.list)
    total.value = data.total
  } catch (err) {
    console.error(err)
  }
}

async function getDetail(id) {
  try {
    const data = await getTeacherDetail(id)
    Object.assign(teacherDetail, {
      ...data,
      subject: data.subject.join(','),
      grade: data.grade.join(','),
      area: data.area.join(','),
      num: data.student.length,
      student: data.student.join(',')
    })
  } catch (err) {
    console.error(err)
  }
}

const reloadData = () => {
  fetchData()
}

const tableData = reactive([])

const teacherDetail = reactive({})

const dialogFormVisible = ref(false)
const dialogConfirmVisible = ref(false)
const selectId = ref(0)
const selectName = ref('')

const openCharge = async (id, name) => {
  await getDetail(id)
  selectId.value = id
  selectName.value = name
  dialogFormVisible.value = true
}

const cancelCharge = () => {
  dialogFormVisible.value = false
  selectId.value = 0
  selectName.value = ''
}

const chargeTeacher = async function() {
  const data = {
    id: selectId.value,
    name: selectName.value,
    student: props.student
  }
  const successFn = () => {
    dialogFormVisible.value = false
    dialogConfirmVisible.value = false
    selectId.value = 0
    fetchData()
    emit('chargeChange');
  }
  charge('分配中', data, chargeStudent, '分配成功', successFn)
}

const deleteSelectTeacher = async function() {
  const data = {
    id: selectId.value
  }
  const successFn = () => {
    dialogFormVisible.value = false
    dialogConfirmVisible.value = false
    selectId.value = 0
    fetchData()
  }
  charge('删除中', data, deleteTeacher, '删除成功', successFn)
}

const formInline = reactive({
  id: undefined,
  name: '',
  sex: '',
  subject: [],
  grade: [],
  area: [],
  address: ''
})

const pageNum = ref(1)
const total = ref(10)
const handleCurrentChange = () => {
  fetchData()
}

</script>

<template>
  <div class="container">
    <el-form :inline="true" :model="formInline" class="search-form">
      <el-form-item label="编号:" class="search-form-item">
        <el-input v-model="formInline.id" placeholder="教员编号" />
      </el-form-item>
      <el-form-item label="姓名:" class="search-form-item">
        <el-input v-model="formInline.name" placeholder="教员姓名" />
      </el-form-item> 
      <el-form-item label="性别:" class="search-form-item">
        <el-select
          v-model="formInline.sex"
          placeholder="教员性别"
        >
          <el-option
            v-for="item in ['男', '女']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>     
      <el-form-item label="科目:" class="search-form-item">
        <el-select
          v-model="formInline.subject"
          multiple
          collapse-tags
          placeholder="授课科目"
        >
          <el-option
            v-for="item in subjects"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>  
      <el-form-item label="年级:" class="search-form-item">
        <el-select
          v-model="formInline.grade"
          multiple
          collapse-tags
          placeholder="授课年级"
        >
          <el-option
            v-for="item in ['小学', '初中', '高中']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> 
      <el-form-item label="地区:" class="search-form-item">
        <el-select
          v-model="formInline.area"
          multiple
          collapse-tags
          placeholder="授课地区"
        >
          <el-option
            v-for="item in areas"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>  
      <el-form-item label="住址:" class="search-form-address">
        <el-input v-model="formInline.address" placeholder="教员住址" />
      </el-form-item>   
      <el-form-item class="search-form-button">
        <el-button type="primary" @click="reloadData()">筛选</el-button>
      </el-form-item>   
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="编号" />
      <el-table-column label="学生" align="center" >
        <template #default="{ row }">
          {{row.student.length}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="address" label="地址" width="200" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" min-width="70">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openCharge(row.id, row.name)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="10"
      :pager-count="5"
      layout="prev, pager, next"
      :total="total"
      v-model:current-page="pageNum"
      @current-change="handleCurrentChange"
    />

    <el-dialog v-model="dialogFormVisible" :title="teacherDetail.name" width="90%" >
      <el-descriptions :column="1" label-width="26vw" class="description" :border="true">
        <el-descriptions-item
          label="编号"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.id}}
        </el-descriptions-item>
        <el-descriptions-item
          label="性别"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.sex}}
        </el-descriptions-item>
        <el-descriptions-item
          label="学生数目"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.num}}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="teacherDetail.student"
          label="学生详情"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.student}}
        </el-descriptions-item>
        <el-descriptions-item
          label="教学科目"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.subject}}
        </el-descriptions-item>
        <el-descriptions-item
          label="授课年级"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.grade}}
        </el-descriptions-item>
        <el-descriptions-item
          label="地区"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.area}}
        </el-descriptions-item>
        <el-descriptions-item
          label="住址"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.address}}
        </el-descriptions-item>
        <el-descriptions-item
          label="毕业学校"
          width="66vw"
          align="center"
          label-align="center"

        >
          {{teacherDetail.school}}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="teacherDetail.university"
          label="大学"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.university}}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="teacherDetail.phone"
          label="号码"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.phone}}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="teacherDetail.wechat"
          label="微信"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.wechat}}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="teacherDetail.qq"
          label="QQ"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.qq}}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="teacherDetail.remark"
          label="备注"
          width="66vw"
          align="center"
          label-align="center"
        >
          {{teacherDetail.remark}}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelCharge()">取消</el-button>
          <el-button v-if="props.edit" type="primary" @click="dialogConfirmVisible = true">分配</el-button>
          <el-button v-else type="danger" @click="dialogConfirmVisible = true">删除</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogConfirmVisible"
      top="30vh"
      width="70%"
    >
      <span>{{ props.edit ? '确认分配该魔法导师？' : '确认删除该魔法导师？' }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogConfirmVisible = false">取消</el-button>
          <el-button v-if="props.edit" type="primary" @click="chargeTeacher()">
            确认
          </el-button>
          <el-button v-else type="danger" @click="deleteSelectTeacher()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
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