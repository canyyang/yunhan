<script setup>
import { computed } from 'vue'

const props = defineProps({
  house: {
    type: String,
    default: '',
  },
})

const className = computed(() => {
  const map = {
    斯莱特林: 'slytherin',
    格兰芬多: 'gryffindor',
    拉文克劳: 'ravenclaw',
    赫奇帕奇: 'hufflepuff',
  }
  return map[props.house] || 'waiting'
})
</script>

<template>
  <span class="house-badge" :class="className">
    <span class="dot"></span>
    {{ house || '未分院' }}
  </span>
</template>

<style scoped>
.house-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #f8fafc;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.slytherin {
  color: var(--yh-house-slytherin);
  background: rgba(42, 98, 61, 0.1);
}

.gryffindor {
  color: var(--yh-house-gryffindor);
  background: rgba(156, 45, 47, 0.1);
}

.ravenclaw {
  color: var(--yh-house-ravenclaw);
  background: rgba(14, 26, 140, 0.1);
}

.hufflepuff {
  color: var(--yh-house-hufflepuff);
  background: rgba(214, 166, 23, 0.13);
}
</style>
