<script setup>
import { ElEmpty } from 'element-plus'

defineProps({
  description: {
    type: String,
    default: '暂无数据',
  },
})
</script>

<template>
  <div class="empty-state admin-card">
    <el-empty :description="description" />
  </div>
</template>

<style scoped>
.empty-state {
  padding: 16px;
}
</style>
