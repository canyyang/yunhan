<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElButton, ElDialog, ElDescriptions, ElDescriptionsItem } from 'element-plus'
import { deleteStudent, getStudentDetail, publicStudent } from '@/services'
import { charge } from '@/utils';
import Teachers from '@/components/Teachers.vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'

const router = useRouter()

const route = useRoute()

onMounted(() => {
  fetchData()
})

async function fetchData() {
  try {
    const data = await getStudentDetail(route.params.id)
    Object.assign(detailData, { ...data })
  } catch (err) {
    console.error(err)
  }
}

const detailData = reactive({})

const dialogConfirmVisible= ref(false)

const deleteSelectStudent = async function() {
  const data = {
    id: route.params.id
  }
  const successFn = () => {
    dialogConfirmVisible.value = false
    router.push({
      path: '/admin'
    })
  }
  charge('删除中', data, deleteStudent, '删除成功', successFn)
}

const publicSelectStudent = async function() {
  const data = {
    id: route.params.id,
    isPublic: !detailData.isPublic
  }
  const successFn = () => {
    dialogConfirmVisible.value = false
    fetchData()
  }
  charge('修改中', data, publicStudent, '修改成功', successFn)
}

const editStudent = () => {
  if (isDelete.value) {
    deleteSelectStudent();
  } else {
    publicSelectStudent();
  }
}

const isDelete = ref(true)

</script>

<template>
  <div>
    <Header />
    <el-descriptions :title="detailData.name" class="description" :column="2" label-width="15vw" :border="true">
      <el-descriptions-item
        label="编号"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{detailData.id}}
      </el-descriptions-item>
      <el-descriptions-item
        label="科目"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{detailData.need}}
      </el-descriptions-item>
      <el-descriptions-item
        label="教员"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{detailData.teacher}}
      </el-descriptions-item>
      <el-descriptions-item
        label="教编"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{detailData.teacherId || '无'}}
      </el-descriptions-item>
      <el-descriptions-item
        label="性别"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{detailData.sex}}
      </el-descriptions-item>
      <el-descriptions-item
        label="年级"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{detailData.grade}}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="detailData.subject"
        label="选科"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{detailData.subject}}
      </el-descriptions-item>
      <el-descriptions-item
        label="时间"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{detailData.period}}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="detailData.score"
        label="水平"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{detailData.score}}
      </el-descriptions-item>
      <el-descriptions-item
        label="地址"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{detailData.address}}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="detailData.phone"
        label="号码"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{detailData.phone}}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="detailData.wechat"
        label="微信"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
        
      >
        {{detailData.wechat}}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="detailData.qq"
        label="QQ"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{detailData.qq}}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="detailData.remark"
        label="备注"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{detailData.remark}}
      </el-descriptions-item>
      <el-descriptions-item
        label="编委"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{detailData.yunhan ? '是' : '否'}}
      </el-descriptions-item>
      <el-descriptions-item
        label="来源"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{detailData.source}}
      </el-descriptions-item>
    </el-descriptions>
    <el-button type="primary" class="button" @click="dialogConfirmVisible = true; isDelete = false;">{{detailData.isPublic ? '隐藏' : '公开'}}</el-button>
    <el-button type="danger" class="button" @click="dialogConfirmVisible = true; isDelete = true">删除</el-button>
    <el-dialog
      v-model="dialogConfirmVisible"
      top="30vh"
      width="70%"
    >
      <span>确认{{isDelete ? '删除' : (detailData.isPublic ? '隐藏' : '公开')}}该学员？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogConfirmVisible = false">取消</el-button>
          <el-button :type="isDelete ? 'danger' : 'primary'" @click="editStudent()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <Teachers v-if="detailData.id" :student="detailData.id" @chargeChange="fetchData()" :edit="true"/>
  </div>
</template>

<style scoped>
.description {
  box-sizing: border-box;
  margin: 4vw;
  width: 92vw;
}
.button {
  margin-left: 4vw;
  margin-bottom: 2vw;
}
</style>