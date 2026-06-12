<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  hint: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'blue',
  },
})
</script>

<template>
  <article class="stat-card admin-card" :class="tone">
    <span class="label">{{ label }}</span>
    <strong>{{ value }}</strong>
    <small v-if="hint">{{ hint }}</small>
  </article>
</template>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--tone-color, var(--yh-admin-accent));
}

.label {
  color: var(--yh-admin-muted);
  font-size: 14px;
}

strong {
  display: block;
  margin-top: 10px;
  color: #0f172a;
  font-size: 34px;
  line-height: 1;
}

small {
  display: block;
  margin-top: 10px;
  color: #94a3b8;
}

.green {
  --tone-color: #16a34a;
}

.amber {
  --tone-color: #d97706;
}

.red {
  --tone-color: #dc2626;
}

.purple {
  --tone-color: #7c3aed;
}

@media (max-width: 700px) {
  .stat-card {
    padding: 14px 12px 14px 16px;
  }

  .label {
    font-size: 12px;
  }

  strong {
    margin-top: 8px;
    font-size: 28px;
  }

  small {
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
