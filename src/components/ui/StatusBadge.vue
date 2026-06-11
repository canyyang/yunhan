<script setup>
import { computed } from 'vue'
import { ElTag } from 'element-plus'

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
})

const status = computed(() => {
  if (props.student.charge === '等待分院') {
    return { label: '等待分院', type: 'warning' }
  }
  if (props.student.teacher === '未分配') {
    return { label: '待分配', type: 'success' }
  }
  if (props.student.isPublic) {
    return { label: '已公开', type: 'primary' }
  }
  return { label: '已分配', type: 'info' }
})
</script>

<template>
  <el-tag :type="status.type" effect="plain" round>{{ status.label }}</el-tag>
</template>
