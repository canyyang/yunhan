<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import Teachers from '@/components/Teachers.vue'
</script>

<template>
  <AdminLayout>
    <PageHeader title="教员中心" description="查看教员能力、服务区域与当前带生负荷。" />
    <section class="admin-card teachers-card">
      <Teachers />
    </section>
  </AdminLayout>
</template>

<style scoped>
.teachers-card {
  padding: 16px;
}

@media (max-width: 768px) {
  .teachers-card {
    padding: 12px;
  }
}
</style>
