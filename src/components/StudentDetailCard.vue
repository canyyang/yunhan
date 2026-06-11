<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElDescriptions, ElDescriptionsItem } from 'element-plus'

defineProps({
  student: {
    type: Object,
    required: true,
  },
  public: {
    type: Boolean,
    default: false,
  },
})

const isMobile = ref(false)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<template>
  <el-descriptions
    :title="public ? String(student.id) : student.name"
    class="student-detail-card"
    :column="isMobile ? 1 : 2"
    :label-width="isMobile ? '88px' : '15vw'"
    :border="true"
  >
    <template v-if="public">
      <el-descriptions-item label="科目" width="31vw" align="center" label-align="center">
        {{ student.need }}
      </el-descriptions-item>
      <el-descriptions-item label="时间" width="31vw" align="center" label-align="center">
        {{ student.period }}
      </el-descriptions-item>
      <el-descriptions-item label="性别" width="31vw" align="center" label-align="center">
        {{ student.sex }}
      </el-descriptions-item>
      <el-descriptions-item label="年级" width="31vw" align="center" label-align="center">
        {{ student.grade }}
      </el-descriptions-item>
    </template>
    <template v-else>
      <el-descriptions-item label="编号" width="31vw" align="center" label-align="center">
        {{ student.id }}
      </el-descriptions-item>
      <el-descriptions-item label="科目" width="31vw" align="center" label-align="center">
        {{ student.need }}
      </el-descriptions-item>
      <el-descriptions-item label="教员" width="31vw" align="center" label-align="center">
        {{ student.teacher }}
      </el-descriptions-item>
      <el-descriptions-item label="教编" width="31vw" align="center" label-align="center">
        {{ student.teacherId || '无' }}
      </el-descriptions-item>
      <el-descriptions-item label="性别" width="31vw" align="center" label-align="center">
        {{ student.sex }}
      </el-descriptions-item>
      <el-descriptions-item label="年级" width="31vw" align="center" label-align="center">
        {{ student.grade }}
      </el-descriptions-item>
    </template>
    <el-descriptions-item
      v-if="student.subject"
      label="选科"
      width="77vw"
      align="center"
      label-align="center"
      span="2"
    >
      {{ student.subject }}
    </el-descriptions-item>
    <el-descriptions-item
      v-if="!public"
      label="时间"
      width="77vw"
      align="center"
      label-align="center"
      span="2"
    >
      {{ student.period }}
    </el-descriptions-item>
    <el-descriptions-item
      v-if="student.score"
      label="水平"
      width="77vw"
      align="center"
      label-align="center"
      span="2"
    >
      {{ student.score }}
    </el-descriptions-item>
    <el-descriptions-item label="地址" width="77vw" align="center" label-align="center" span="2">
      {{ student.address }}
    </el-descriptions-item>
    <template v-if="!public">
      <el-descriptions-item
        v-if="student.phone"
        label="号码"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{ student.phone }}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="student.wechat"
        label="微信"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{ student.wechat }}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="student.qq"
        label="QQ"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{ student.qq }}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="student.school"
        label="学校"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{ student.school }}
      </el-descriptions-item>
    </template>
    <el-descriptions-item
      v-if="student.remark"
      label="备注"
      width="77vw"
      align="center"
      label-align="center"
      span="2"
    >
      {{ student.remark }}
    </el-descriptions-item>
    <template v-if="!public">
      <el-descriptions-item label="编委" width="31vw" align="center" label-align="center">
        {{ student.yunhan ? '是' : '否' }}
      </el-descriptions-item>
      <el-descriptions-item label="来源" width="31vw" align="center" label-align="center">
        {{ student.source }}
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<style scoped>
.student-detail-card {
  box-sizing: border-box;
  margin: 4vw;
  width: 92vw;
}

@media (max-width: 768px) {
  .student-detail-card {
    margin: 0;
    width: 100%;
  }

  :deep(.el-descriptions__title) {
    font-size: 18px;
  }

  :deep(.el-descriptions__label),
  :deep(.el-descriptions__content) {
    padding: 10px 8px !important;
    word-break: break-word;
  }
}
</style>
