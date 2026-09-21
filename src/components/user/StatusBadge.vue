<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: { type: String, required: true }
})

const levelMap = {
  L1: { label: '状态良好', color: '#52C41A', bg: '#f0faf0' },
  L2: { label: '轻度波动', color: '#8FD460', bg: '#f5fdf0' },
  L3: { label: '中度压力', color: '#FAAD14', bg: '#fff7e6' },
  L4: { label: '需关注', color: '#FA8C16', bg: '#fff2e0' },
  L5: { label: '高风险预警', color: '#EA6668', bg: '#fdeeee' }
}

const info = computed(() => levelMap[props.level] || null)
</script>

<template>
  <span v-if="info" class="status-badge" :style="{ color: info.color, background: info.bg }">
    <span class="dot" :style="{ background: info.color }" />
    {{ level }} · {{ info.label }}
  </span>
  <span v-else class="status-badge status-none">暂无评估</span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-none {
  color: #9ca3af;
  background: #f4f5f7;
  font-weight: 400;
}
</style>
