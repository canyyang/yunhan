<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadio, ElCheckboxGroup, ElCheckbox, ElButton, ElDialog, ElLoading, ElMessage } from 'element-plus'
import { addTeacher } from '../services'
import { getStage } from '@/utils'

const stage = getStage()

const form = reactive({
  name: '',
  sex: '',
  subject: [],
  grade: [],
  area: [],
  address: '',
  school: '',
  university: '',
  phone: '',
  wechat: '',
  qq: '',
  remark: '',
  expand: false
})

const dialogVisible = ref(false)

const submit = () => {
  if (form.name === '') {
    ElMessage({
      message: '请填写姓名',
      type: 'warning',
    })
    return
  }
  if (form.sex === -1) {
    ElMessage({
      message: '请选择性别',
      type: 'warning',
    })
    return
  }
  if (form.subject.length === 0) {
    ElMessage({
      message: '请选择教学科目',
      type: 'warning',
    })
    return
  }
  if (form.grade.length === 0) {
    ElMessage({
      message: '请选择授课年级',
      type: 'warning',
    })
    return
  }
  if (form.area.length === 0) {
    ElMessage({
      message: '请选择授课地区',
      type: 'warning',
    })
    return
  }
  if (form.address === '') {
    ElMessage({
      message: '请填写详细住址',
      type: 'warning',
    })
    return
  }
  if (form.phone === '' && form.wechat === '' && form.qq === '') {
    ElMessage({
      message: '请至少填写一项联系方式',
      type: 'warning',
    })
    return
  }
  dialogVisible.value = true
}

const commit = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '提交中',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const data = {
    ...form,
    time: new Date().getTime(),
    stage: stage,
    student: []
  }
  try {
    const result = await addTeacher(data);
    console.log('教师添加成功:', result);
    ElMessage({
    message: '提交成功',
    type: 'success',
    })
  } catch (error) {
    console.error('添加教师失败:', error);
    ElMessage({
      message: '网络错误',
      type: 'error',
    })
  } finally {
    loading.close()
    dialogVisible.value = false
  }
}

</script>

<template>
  <div class="container">
    <p class="title">云汉{{stage}}期教员报名表</p>
    <el-form :model="form" 
      label-position="top"
      label-width="auto" 
      style="max-width: 600px" 
      class="form">
      <el-form-item label="1、姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="2、性别">
        <el-radio-group v-model="form.sex">
          <el-radio value="男" size="large">男</el-radio>
          <el-radio value="女" size="large">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="3、教学科目">
        <el-checkbox-group v-model="form.subject">
          <el-checkbox v-for="item in ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '政治', '地理']"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="4、可接受的教学阶段">
        <el-checkbox-group v-model="form.grade">
          <el-checkbox  size="large" label="小学" value="小学" />
          <el-checkbox  size="large" label="初中" value="初中" />
          <el-checkbox  size="large" label="高中" value="高中" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="5、可接受的教学地区">
        <el-checkbox-group v-model="form.area">
          <el-checkbox  size="large" label="榕城" value="榕城" />
          <el-checkbox  size="large" label="东山" value="东山" />
          <el-checkbox  size="large" label="蓝城" value="蓝城" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="6、详细住址">
        <el-input v-model="form.address" placeholder="具体到小区或村"/>
      </el-form-item>
      <el-form-item label="7、毕业院校">
        <el-input v-model="form.school" placeholder="毕业高中及班级"/>
      </el-form-item>
      <el-form-item label="8、现就读院校">
        <el-input v-model="form.university" placeholder="高考应届生不必填写" />
      </el-form-item>
      <el-form-item label="9、联系电话">
        <el-input v-model="form.phone" placeholder="如无可不填" />
      </el-form-item>
      <el-form-item label="10、微信号">
        <el-input v-model="form.wechat" placeholder="如无可不填" />
      </el-form-item>
      <el-form-item label="11、QQ号">
        <el-input v-model="form.qq" placeholder="如无可不填" />
      </el-form-item>
      <el-form-item label="12、备注">
        <el-input v-model="form.remark" placeholder="要求、建议均可" />
      </el-form-item>
      <el-form-item label="13、是否接收未选教学科目的基础教学">
        <el-radio-group v-model="form.expand">
          <el-radio value="true" size="large">是</el-radio>
          <el-radio value="false" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-button type="primary" class="submit" @click="submit()">提交</el-button>
    <el-dialog v-model="dialogVisible"  width="70%" top="38vh">
      <span>是否确认提交</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="commit()">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  margin: 20px 0;
  font-weight: bold;
  color: #409eff;
}
.form, .submit {
  width: 90vw;
  margin-left: 4vw;
}
.submit {
  margin-bottom: 4vw;
}
</style>