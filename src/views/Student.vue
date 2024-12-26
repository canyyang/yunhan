<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadio, ElCheckboxGroup, ElCheckbox, ElButton, ElDialog, ElLoading, ElMessage, ElSelect, ElOption } from 'element-plus'
import { addStudent } from '@/services'
import { getStage } from '@/utils'

const stage = getStage()

const form = reactive({
  name: '', // 姓名
  sex: '', // 性别
  subject: '', // 选科
  grade: '', // 年级
  school: '', // 学校
  address: '', // 地址
  phone: '', // 电话号码
  wechat: '', // 微信
  qq: '', // qq
  need: [], // 补习科目
  period: '', // 补习时间
  score: '', // 当前水平
  remark: '', // 备注
  yunhan: undefined, // 是否云汉推荐
  source: '' // 来源
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
  if (form.grade === '') {
    ElMessage({
      message: '请选择年级',
      type: 'warning',
    })
    return
  }
  if (form.school === '') {
    ElMessage({
      message: '请填写学校信息',
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
  if (form.need.length === 0) {
    ElMessage({
      message: '请选择补习科目',
      type: 'warning',
    })
    return
  }
  if (form.period === '') {
    ElMessage({
      message: '请填写补习时间',
      type: 'warning',
    })
    return
  }
  if (form.score === '') {
    ElMessage({
      message: '请填写学员成绩',
      type: 'warning',
    })
    return
  }
  if (form.yunhan === undefined) {
    ElMessage({
      message: '请选择信息来源',
      type: 'warning',
    })
    return
  }
  if (form.source === '') {
    ElMessage({
      message: '请选择信息来源',
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
    stage: stage
  }
  try {
    const result = await addStudent(data);
    console.log('学术添加成功:', result);
    ElMessage({
    message: '提交成功',
    type: 'success',
    })
  } catch (error) {
    console.error('添加学生失败:', error);
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
    <p class="title">云汉{{stage}}期学员报名表</p>
    <el-form :model="form" 
      label-position="top"
      label-width="auto" 
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
      <el-form-item label="3、年级">
        <el-select
          v-model="form.grade"
          placeholder="请选择年级"
          size="large"
        >
          <el-option
            v-for="item in ['小学', '初一', '初二', '初三', '高一', '高二', '高三', '其他']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="4、选课方向">
        <el-input v-model="form.subject" placeholder="非高中生无需填写"/>
      </el-form-item>
      <el-form-item label="5、就读学校">
        <el-input v-model="form.school" placeholder="当前就读学校"/>
      </el-form-item>
      <el-form-item label="6、详细住址">
        <el-input v-model="form.address" placeholder="区+镇/街道+村/小区，请尽量详细以便于匹配"/>
      </el-form-item>
      <el-form-item label="7、联系电话">
        <el-input v-model="form.phone" placeholder="如无可不填" />
      </el-form-item>
      <el-form-item label="8、微信号">
        <el-input v-model="form.wechat" placeholder="如无可不填" />
      </el-form-item>
      <el-form-item label="9、QQ号">
        <el-input v-model="form.qq" placeholder="如无可不填" />
      </el-form-item>
      <el-form-item label="10、补习科目">
        <el-checkbox-group v-model="form.need">
          <el-checkbox v-for="item in ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '政治', '地理', '全科']"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="11、补习时间">
        <el-input v-model="form.period" placeholder="周末或晚上或可协商等" />
      </el-form-item>
      <el-form-item label="12、学员当前科目成绩">
        <el-input v-model="form.score" placeholder="如分数排名等，便于教学指定适宜教学方案" />
      </el-form-item>
      <el-form-item label="13、教员要求">
        <el-input v-model="form.remark" placeholder="如性别性格等，如无可不填" />
      </el-form-item>
      <el-form-item label="14、请问是云汉负责人让您填写的问卷吗">
        <el-radio-group v-model="form.yunhan">
          <el-radio value="true" size="large">是</el-radio>
          <el-radio value="false" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="15、通过何种方式获知云汉">
        <el-select
          v-model="form.source"
          size="large"
          placeholder="请选择"
        >
          <el-option
            v-for="item in ['传单', '亲友', '微信', '回头客']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
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