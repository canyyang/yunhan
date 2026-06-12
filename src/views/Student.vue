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
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElStep,
  ElSteps,
  ElTag,
} from 'element-plus'
import { useRouter } from 'vue-router'
import { SUBJECTS, STUDENT_GRADES, STUDENT_SOURCES, AREAS } from '@/constants'
import { addStudent } from '@/services'
import { getStage } from '@/utils'
import '@/styles/form-page.css'

const router = useRouter()
const stage = getStage()
const DRAFT_KEY = 'yunhan_student_register_draft'

const createInitialForm = () => ({
  name: '',
  sex: '',
  subject: '',
  grade: '',
  school: '',
  area: '',
  address: '',
  phone: '',
  wechat: '',
  qq: '',
  need: [],
  period: '',
  score: '',
  remark: '',
  yunhan: undefined,
  source: '',
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

const steps = [
  { title: '基本信息', description: '确认学员身份与学校' },
  { title: '学习需求', description: '填写科目、时间与当前水平' },
  { title: '联系方式', description: '至少留下一种有效联系方式' },
  { title: '确认提交', description: '检查信息后完成报名' },
]

const summaryGroups = computed(() => [
  {
    title: '基本信息',
    items: [
      ['姓名', form.name],
      ['性别', form.sex],
      ['年级', form.grade],
      ['就读学校', form.school],
      ['选课方向', form.subject || '未填写'],
      ['所在区域', form.area],
      ['详细住址', form.address],
    ],
  },
  {
    title: '学习需求',
    items: [
      ['补习科目', form.need.join('、')],
      ['补习时间', form.period],
      ['当前水平', form.score],
      ['教员要求', form.remark || '无'],
    ],
  },
  {
    title: '联系与来源',
    items: [
      ['联系电话', form.phone || '未填写'],
      ['微信号', form.wechat || '未填写'],
      ['QQ号', form.qq || '未填写'],
      ['是否云汉负责人推荐', form.yunhan === 'true' ? '是' : '否'],
      ['获知方式', form.source],
    ],
  },
])

watch(
  form,
  (value) => {
    if (!isSubmitted.value) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(value))
    }
  },
  { deep: true },
)

const showWarning = (message) => {
  ElMessage({ message, type: 'warning' })
}

const validateStep = (step = activeStep.value) => {
  if (step === 0) {
    if (!form.name) return showWarning('请填写姓名')
    if (!form.sex) return showWarning('请选择性别')
    if (!form.grade) return showWarning('请选择年级')
    if (!form.school) return showWarning('请填写学校信息')
    if (!form.area) return showWarning('请选择所在区域')
    if (!form.address) return showWarning('请填写详细住址')
  }

  if (step === 1) {
    if (form.need.length === 0) return showWarning('请选择补习科目')
    if (!form.period) return showWarning('请填写补习时间')
    if (!form.score) return showWarning('请填写学员当前水平')
  }

  if (step === 2) {
    if (!form.phone && !form.wechat && !form.qq) {
      return showWarning('请至少填写一项联系方式')
    }
    if (form.yunhan === undefined) return showWarning('请选择是否为云汉负责人推荐')
    if (!form.source) return showWarning('请选择信息来源')
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
    text: '提交中',
    background: 'rgba(255, 255, 255, 0.65)',
  })

  try {
    await addStudent({
      ...form,
      time: new Date().getTime(),
      stage,
    })
    isSubmitted.value = true
    localStorage.removeItem(DRAFT_KEY)
    ElMessage({ message: '提交成功', type: 'success' })
  } catch (error) {
    ElMessage({ message: '网络错误，请稍后重试', type: 'error' })
  } finally {
    loading.close()
  }
}

const goHome = () => {
  router.push({ path: '/' })
}
</script>

<template>
  <main class="form-register-page">
    <section class="form-register-hero">
      <p class="eyebrow">云汉教育 · 第 {{ stage }} 期</p>
      <h1>学员报名</h1>
      <p class="hero-desc">请准确填写学习需求与联系方式，便于后续进行教员匹配与沟通确认。</p>
    </section>

    <el-card v-if="!isSubmitted" class="form-register-card" shadow="never">
      <el-steps :active="activeStep" finish-status="success" align-center class="form-register-steps">
        <el-step v-for="step in steps" :key="step.title" :title="step.title" :description="step.description" />
      </el-steps>

      <el-form :model="form" label-position="top" class="form-register-form">
        <section v-show="activeStep === 0" class="form-register-panel">
          <h2>基本信息</h2>
          <p class="section-desc">这些信息将用于确认学员情况与可服务区域。</p>
          <div class="form-register-grid">
            <el-form-item label="姓名">
              <el-input v-model="form.name" placeholder="请输入学员姓名" />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex">
                <el-radio value="男" size="large">男</el-radio>
                <el-radio value="女" size="large">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年级">
              <el-select v-model="form.grade" placeholder="请选择年级" size="large">
                <el-option v-for="item in STUDENT_GRADES" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="选课方向">
              <el-input v-model="form.subject" placeholder="非高中生无需填写" />
            </el-form-item>
            <el-form-item label="就读学校">
              <el-input v-model="form.school" placeholder="当前就读学校" />
            </el-form-item>
          </div>
          <el-form-item label="所在区域">
            <el-radio-group v-model="form.area" class="form-register-choice">
              <el-radio v-for="item in AREAS" :key="item" :label="item" :value="item" size="large" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="详细住址">
            <el-input v-model="form.address" placeholder="镇/街道+村/小区，请尽量详细" />
          </el-form-item>
        </section>

        <section v-show="activeStep === 1" class="form-register-panel">
          <h2>学习需求</h2>
          <p class="section-desc">越具体的信息，越有助于匹配合适的教员。</p>
          <el-form-item label="补习科目">
            <el-checkbox-group v-model="form.need" class="form-register-choice compact">
              <el-checkbox v-for="item in SUBJECTS" :key="item" :label="item" :value="item" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="补习时间">
            <el-input v-model="form.period" placeholder="例如：周末、晚上、可协商等" />
          </el-form-item>
          <el-form-item label="学员当前科目成绩">
            <el-input v-model="form.score" placeholder="例如：分数、排名、薄弱点等" />
          </el-form-item>
          <el-form-item label="教员要求">
            <el-input v-model="form.remark" placeholder="例如：性别、性格、教学风格等；如无可不填" />
          </el-form-item>
        </section>

        <section v-show="activeStep === 2" class="form-register-panel">
          <h2>联系方式</h2>
          <p class="section-desc">电话、微信、QQ 至少填写一项，便于编委后续联系。</p>
          <div class="form-register-grid">
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="如无可不填" />
            </el-form-item>
            <el-form-item label="微信号">
              <el-input v-model="form.wechat" placeholder="如无可不填" />
            </el-form-item>
            <el-form-item label="QQ号">
              <el-input v-model="form.qq" placeholder="如无可不填" />
            </el-form-item>
            <el-form-item label="请问是云汉负责人让您填写的问卷吗">
              <el-radio-group v-model="form.yunhan">
                <el-radio value="true" size="large">是</el-radio>
                <el-radio value="false" size="large">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="通过何种方式获知云汉">
              <el-select v-model="form.source" size="large" placeholder="请选择">
                <el-option v-for="item in STUDENT_SOURCES" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </div>
        </section>

        <section v-show="activeStep === 3" class="form-register-panel">
          <h2>确认提交</h2>
          <p class="section-desc">请核对以下信息，确认无误后提交。</p>
          <div class="form-register-summary-list">
            <article v-for="group in summaryGroups" :key="group.title" class="form-register-summary-card">
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

      <div class="form-register-actions">
        <el-button v-if="activeStep > 0" @click="prevStep()">上一步</el-button>
        <el-button v-if="activeStep < steps.length - 1" type="primary" @click="nextStep()">下一步</el-button>
        <el-button v-else type="primary" @click="commit()">确认提交</el-button>
      </div>
    </el-card>

    <el-card v-else class="form-register-success" shadow="never">
      <el-tag type="success" size="large">提交成功</el-tag>
      <h2>我们已收到你的报名信息</h2>
      <p>编委会根据填写内容进行初步整理，并在后续安排中联系确认。</p>
      <el-button type="primary" @click="goHome()">返回首页</el-button>
    </el-card>
  </main>
</template>

<style scoped>
.form-register-panel .section-desc {
  margin: 8px 0 18px;
}
</style>
