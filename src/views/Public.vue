<script setup>
import { ElDescriptions, ElDescriptionsItem  } from 'element-plus'
import { getPublicStudent } from '@/services'
import { reactive, onMounted } from 'vue'

const publicList = reactive([])

onMounted(() => {
  fetchData()
})

async function fetchData() {
  try {
    const data = await getPublicStudent()
    publicList.splice(0, publicList.length, ...data)
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div>
    <p class="title">云汉待接学员信息栏</p>
    <p class="intro">如有合适学员，请根据学员编号私聊编委</p>
    <el-descriptions v-for="item in publicList" :key="item.id" :title="String(item.id)" class="description" :column="2" label-width="15vw" :border="true">
      <el-descriptions-item
        label="科目"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{item.need}}
      </el-descriptions-item>
      <el-descriptions-item
        label="时间"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{item.period}}
      </el-descriptions-item>
      <el-descriptions-item
        label="性别"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{item.sex}}
      </el-descriptions-item>
      <el-descriptions-item
        label="年级"
        width="31vw"
        align="center"
        label-align="center"
      >
        {{item.grade}}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="item.subject"
        label="选科"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{item.subject}}
      </el-descriptions-item>
      <el-descriptions-item
        label="地址"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{item.address}}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="item.score"
        label="水平"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{item.score}}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="item.remark"
        label="备注"
        width="77vw"
        align="center"
        label-align="center"
        span="2"
      >
        {{item.remark}}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  margin: 20px 0;
  font-weight: bold;
  color: #409eff;
}
.intro {
  color: #337ecc;
  margin-left: 4vw;
}
.description {
  box-sizing: border-box;
  margin: 4vw 4vw 8vw;
  width: 92vw;
}
</style>