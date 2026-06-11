<script setup>
import { computed } from 'vue'
import { ElTag } from 'element-plus'

const props = defineProps({
  score: {
    type: Number,
    default: 0,
  },
})

const tagType = computed(() => {
  if (props.score >= 80) return 'success'
  if (props.score >= 55) return 'warning'
  return 'info'
})
</script>

<template>
  <el-tag :type="tagType" effect="dark" round>匹配度 {{ Math.round(score) }}%</el-tag>
</template>
