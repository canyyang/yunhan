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
    <div>
      <p class="eyebrow">YUNHAN ADMIN</p>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--yh-admin-primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

h1 {
  margin: 0;
  color: #0f172a;
  font-size: 30px;
}

p {
  margin: 10px 0 0;
  color: var(--yh-admin-muted);
  line-height: 1.7;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 14px;
  }

  h1 {
    font-size: 24px;
  }

  p {
    margin-top: 6px;
    font-size: 14px;
  }

  .actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }

  .actions :deep(.el-button) {
    width: 100%;
    margin-left: 0;
  }
}
</style>
