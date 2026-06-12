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
import '@/styles/form-page.css'

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

const steps = [
  { title: '基本信息', description: '填写身份与住址' },
  { title: '教学能力', description: '选择科目与授课年级' },
  { title: '服务范围', description: '填写地区与联系方式' },
  { title: '确认提交', description: '核对信息后提交' },
]

const summaryGroups = computed(() => [
  {
    title: '基本信息',
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
    text: '提交中',
    background: 'rgba(255, 255, 255, 0.65)',
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
  <main class="form-register-page">
    <section class="form-register-hero">
      <p class="eyebrow">云汉教育 · 第 {{ stage }} 期</p>
      <h1>教员登记</h1>
      <p class="hero-desc">请如实填写教学能力与联系方式，便于后续与学员需求进行匹配。</p>
    </section>

    <el-card v-if="!isSubmitted" class="form-register-card" shadow="never">
      <el-steps :active="activeStep" finish-status="success" align-center class="form-register-steps">
        <el-step v-for="step in steps" :key="step.title" :title="step.title" :description="step.description" />
      </el-steps>

      <el-form :model="form" label-position="top" class="form-register-form">
        <section v-show="activeStep === 0" class="form-register-panel">
          <h2>基本信息</h2>
          <p class="section-desc">这些信息将用于确认教员身份与服务区域。</p>
          <div class="form-register-grid">
            <el-form-item label="姓名">
              <el-input v-model="form.name" placeholder="请输入姓名" />
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

        <section v-show="activeStep === 1" class="form-register-panel">
          <h2>教学能力</h2>
          <p class="section-desc">请选择可授科目与年级范围。</p>
          <el-form-item label="教学科目">
            <el-checkbox-group v-model="form.subject" class="form-register-choice">
              <el-checkbox v-for="item in TEACHER_SUBJECTS" :key="item" :label="item" :value="item" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="可接受的教学阶段">
            <el-checkbox-group v-model="form.grade" class="form-register-choice compact">
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

        <section v-show="activeStep === 2" class="form-register-panel">
          <h2>服务范围</h2>
          <p class="section-desc">请选择可服务地区，并留下至少一种联系方式。</p>
          <el-form-item label="可接受的教学地区">
            <el-checkbox-group v-model="form.area" class="form-register-choice">
              <el-checkbox v-for="item in AREAS" :key="item" size="large" :label="item" :value="item" />
            </el-checkbox-group>
          </el-form-item>
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
          </div>
          <el-form-item label="备注">
            <el-input v-model="form.remark" placeholder="要求、建议均可" />
          </el-form-item>
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
      <h2>我们已收到你的登记信息</h2>
      <p>编委会将根据填写内容进行整理，如有合适学员会与你联系。</p>
      <el-button type="primary" @click="router.push('/')">返回首页</el-button>
    </el-card>
  </main>
</template>

<style scoped>
.form-register-panel + .form-register-panel {
  margin-top: 0;
}

.form-register-panel .section-desc {
  margin: 8px 0 18px;
}
</style>
