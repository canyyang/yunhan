<script setup>
import { computed, reactive, ref, watch } from 'vue'
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElCheckboxGroup,
  ElForm,
  ElFormItem,
  ElInput,
  ElLoading,
  ElMessage,
  ElRadio,
  ElRadioGroup,
  ElStep,
  ElSteps,
  ElTag,
} from 'element-plus'
import { useRouter } from 'vue-router'
import { addTeacher } from '@/services'
import { getStage } from '@/utils'
import { AREAS, TEACHER_SUBJECTS, TEACH_GRADES } from '@/constants'

const router = useRouter()
const stage = getStage()
const DRAFT_KEY = 'yunhan_teacher_register_draft'

const createInitialForm = () => ({
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
  expand: false,
})

const loadDraft = () => {
  try {
    const draft = localStorage.getItem(DRAFT_KEY)
    return draft ? { ...createInitialForm(), ...JSON.parse(draft) } : createInitialForm()
  } catch (error) {
    return createInitialForm()
  }
}

const form = reactive(loadDraft())
const activeStep = ref(0)
const isSubmitted = ref(false)

const steps = ['身份登记', '教学能力', '服务范围', '确认入库']

const summaryGroups = computed(() => [
  {
    title: '身份信息',
    items: [
      ['姓名', form.name],
      ['性别', form.sex],
      ['毕业院校', form.school || '未填写'],
      ['现就读院校', form.university || '未填写'],
      ['详细住址', form.address],
    ],
  },
  {
    title: '教学能力',
    items: [
      ['教学科目', form.subject.join('、')],
      ['授课年级', form.grade.join('、')],
      ['可授地区', form.area.join('、')],
      ['接收基础教学', form.expand === 'true' ? '是' : '否'],
    ],
  },
  {
    title: '联系方式',
    items: [
      ['联系电话', form.phone || '未填写'],
      ['微信号', form.wechat || '未填写'],
      ['QQ号', form.qq || '未填写'],
      ['备注', form.remark || '无'],
    ],
  },
])

watch(
  form,
  (value) => {
    if (!isSubmitted.value) localStorage.setItem(DRAFT_KEY, JSON.stringify(value))
  },
  { deep: true },
)

const warn = (message) => ElMessage({ message, type: 'warning' })

const validateStep = (step = activeStep.value) => {
  if (step === 0) {
    if (!form.name) return warn('请填写姓名')
    if (!form.sex) return warn('请选择性别')
    if (!form.address) return warn('请填写详细住址')
  }
  if (step === 1) {
    if (form.subject.length === 0) return warn('请选择教学科目')
    if (form.grade.length === 0) return warn('请选择授课年级')
  }
  if (step === 2) {
    if (form.area.length === 0) return warn('请选择授课地区')
    if (!form.phone && !form.wechat && !form.qq) return warn('请至少填写一项联系方式')
  }
  return true
}

const nextStep = () => {
  if (!validateStep()) return
  activeStep.value += 1
}

const prevStep = () => {
  activeStep.value -= 1
}

const commit = async () => {
  if (!validateStep(0) || !validateStep(1) || !validateStep(2)) return

  const loading = ElLoading.service({
    lock: true,
    text: '登记魔法导师中',
    background: 'rgba(15, 23, 42, 0.7)',
  })

  try {
    await addTeacher({
      ...form,
      time: new Date().getTime(),
      stage,
      student: [],
    })
    isSubmitted.value = true
    localStorage.removeItem(DRAFT_KEY)
    ElMessage({ message: '提交成功', type: 'success' })
  } catch (error) {
    ElMessage({ message: '网络错误', type: 'error' })
  } finally {
    loading.close()
  }
}
</script>

<template>
  <main class="teacher-register">
    <section class="hero">
      <p class="eyebrow">云汉第 {{ stage }} 期 · 魔法导师招募</p>
      <h1>加入云汉教员库</h1>
      <p>填写你的教学能力与服务范围，后续将由编委根据学员需求进行匹配。</p>
    </section>

    <el-card v-if="!isSubmitted" class="register-card" shadow="never">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step v-for="step in steps" :key="step" :title="step" />
      </el-steps>

      <el-form :model="form" label-position="top" class="form">
        <section v-show="activeStep === 0" class="panel">
          <h2>身份登记</h2>
          <div class="grid">
            <el-form-item label="姓名">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex">
                <el-radio value="男" size="large">男</el-radio>
                <el-radio value="女" size="large">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="详细住址">
              <el-input v-model="form.address" placeholder="具体到小区或村" />
            </el-form-item>
            <el-form-item label="毕业院校">
              <el-input v-model="form.school" placeholder="毕业高中及班级" />
            </el-form-item>
            <el-form-item label="现就读院校">
              <el-input v-model="form.university" placeholder="高考应届生不必填写" />
            </el-form-item>
          </div>
        </section>

        <section v-show="activeStep === 1" class="panel">
          <h2>教学能力</h2>
          <el-form-item label="教学科目">
            <el-checkbox-group v-model="form.subject" class="choice-grid">
              <el-checkbox v-for="item in TEACHER_SUBJECTS" :key="item" :label="item" :value="item" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="可接受的教学阶段">
            <el-checkbox-group v-model="form.grade" class="choice-grid compact">
              <el-checkbox v-for="item in TEACH_GRADES" :key="item" size="large" :label="item" :value="item" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="是否接收未选教学科目的基础教学">
            <el-radio-group v-model="form.expand">
              <el-radio value="true" size="large">是</el-radio>
              <el-radio value="false" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </section>

        <section v-show="activeStep === 2" class="panel">
          <h2>服务范围</h2>
          <el-form-item label="可接受的教学地区">
            <el-checkbox-group v-model="form.area" class="choice-grid">
              <el-checkbox v-for="item in AREAS" :key="item" size="large" :label="item" :value="item" />
            </el-checkbox-group>
          </el-form-item>
          <div class="grid">
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="如无可不填" />
            </el-form-item>
            <el-form-item label="微信号">
              <el-input v-model="form.wechat" placeholder="如无可不填" />
            </el-form-item>
            <el-form-item label="QQ号">
              <el-input v-model="form.qq" placeholder="如无可不填" />
            </el-form-item>
          </div>
          <el-form-item label="备注">
            <el-input v-model="form.remark" placeholder="要求、建议均可" />
          </el-form-item>
        </section>

        <section v-show="activeStep === 3" class="panel">
          <h2>确认入库</h2>
          <div class="summary-list">
            <article v-for="group in summaryGroups" :key="group.title" class="summary-card">
              <h3>{{ group.title }}</h3>
              <dl>
                <template v-for="[label, value] in group.items" :key="label">
                  <dt>{{ label }}</dt>
                  <dd>{{ value }}</dd>
                </template>
              </dl>
            </article>
          </div>
        </section>
      </el-form>

      <div class="actions">
        <el-button v-if="activeStep > 0" @click="prevStep()">上一步</el-button>
        <el-button v-if="activeStep < steps.length - 1" type="primary" @click="nextStep()">下一步</el-button>
        <el-button v-else type="primary" @click="commit()">确认提交</el-button>
      </div>
    </el-card>

    <el-card v-else class="success-card" shadow="never">
      <el-tag type="success" size="large">登记成功</el-tag>
      <h2>欢迎加入云汉教员库</h2>
      <p>你的信息已进入编委匹配范围，后续如有合适学员会进行联系。</p>
      <el-button type="primary" @click="router.push('/')">返回首页</el-button>
    </el-card>
  </main>
</template>

<style scoped>
.teacher-register {
  min-height: 100vh;
  padding: 42px 16px 56px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 20% 0%, rgba(214, 166, 23, 0.2), transparent 26%),
    radial-gradient(circle at 80% 10%, rgba(37, 99, 235, 0.18), transparent 24%),
    linear-gradient(180deg, #0f172a 0%, #111827 54%, #1f2937 100%);
  color: #e5e7eb;
}

.hero {
  max-width: 760px;
  margin: 0 auto 28px;
  text-align: center;
}

.eyebrow {
  color: #facc15;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.hero h1 {
  margin: 0;
  font-size: 42px;
}

.hero p {
  color: #cbd5e1;
  line-height: 1.7;
}

.register-card,
.success-card {
  max-width: 900px;
  margin: 0 auto;
  border: 1px solid rgba(250, 204, 21, 0.18);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
}

.form {
  max-width: 740px;
  margin: 30px auto 0;
}

.panel h2 {
  margin: 0 0 18px;
  color: #0f172a;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.choice-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.choice-grid.compact {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-list {
  display: grid;
  gap: 16px;
}

.summary-card {
  padding: 18px;
  border-radius: 18px;
  background: #f8fafc;
}

.summary-card h3 {
  margin: 0 0 12px;
  color: #111827;
}

.summary-card dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px 16px;
  margin: 0;
  color: #0f172a;
}

.summary-card dt {
  color: #64748b;
}

.summary-card dd {
  margin: 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  max-width: 740px;
  margin: 28px auto 0;
}

.success-card {
  max-width: 520px;
  padding: 28px;
  text-align: center;
}

.success-card h2 {
  color: #0f172a;
}

.success-card p {
  color: #64748b;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 32px;
  }

  .grid,
  .choice-grid,
  .choice-grid.compact,
  .summary-card dl {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .actions .el-button {
    width: 100%;
    margin-left: 0;
  }
}
</style>
