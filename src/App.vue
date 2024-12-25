<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
</script>

<style>
body {
  margin: 0;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
</style>