<script setup>
import { useRouter } from 'vue-router'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'

const router = useRouter()

const goPath = (path) => {
  router.push({
    path: path,
  })
}


</script>

<template>
  <div class="tab">
    <span class="title" @click="goPath('/admin')">云汉教育</span>
    <el-dropdown>
      <span class="title">
        其他 ∨
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goPath('/teachers')">教员列表</el-dropdown-item>
          <el-dropdown-item @click="goPath('/public')">公开列表</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.tab {
  margin: 3px 3vw;
  width: 94vw;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  color: #409eff;
}
</style>