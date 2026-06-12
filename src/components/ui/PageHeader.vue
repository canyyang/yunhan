<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <header class="page-header">
    <div class="page-header-content">
      <div class="page-header-title-row">
        <h1>{{ title }}</h1>
        <div v-if="$slots.actions" class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
      <p v-if="description">{{ description }}</p>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  margin-bottom: 16px;
  padding: 18px 22px;
  border: 1px solid var(--yh-admin-header-border);
  border-radius: var(--yh-admin-radius);
  background: linear-gradient(135deg, #ecf5ff 0%, #f8fbff 55%, #ffffff 100%);
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.06);
}

.page-header-content {
  min-width: 0;
}

.page-header-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

h1 {
  margin: 0;
  color: #303133;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
}

p {
  margin: 8px 0 0;
  color: var(--yh-admin-muted);
  font-size: 14px;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .page-header {
    padding: 14px 16px;
    margin-bottom: 12px;
  }

  .page-header-title-row {
    align-items: flex-start;
    gap: 12px;
  }

  h1 {
    font-size: 22px;
  }

  p {
    margin-top: 6px;
    font-size: 13px;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions :deep(.el-button) {
    margin-left: 0;
  }
}
</style>
